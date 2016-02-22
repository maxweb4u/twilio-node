'use strict';

var _ = require('lodash');
var Q = require('q');
var Page = require('../../../../base/Page');
var deserialize = require('../../../../base/deserialize');
var values = require('../../../../base/values');

var PhoneNumberPage;
var PhoneNumberList;
var PhoneNumberInstance;
var PhoneNumberContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Trunking.V1.TrunkContext.PhoneNumberPage
 * @augments Page
 * @description Initialize the PhoneNumberPage
 *
 * @param {Twilio.Trunking.V1} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {string} trunkSid - The trunk_sid
 *
 * @returns PhoneNumberPage
 */
/* jshint ignore:end */
function PhoneNumberPage(version, response, trunkSid) {
  Page.prototype.constructor.call(this, version, response);

  // Path Solution
  this._solution = {
    trunkSid: trunkSid
  };
}

_.extend(PhoneNumberPage.prototype, Page.prototype);
PhoneNumberPage.prototype.constructor = PhoneNumberPage;

/* jshint ignore:start */
/**
 * Build an instance of PhoneNumberInstance
 *
 * @function getInstance
 * @memberof Twilio.Trunking.V1.TrunkContext.PhoneNumberPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns PhoneNumberInstance
 */
/* jshint ignore:end */
PhoneNumberPage.prototype.getInstance = function getInstance(payload) {
  return new PhoneNumberInstance(
    this._version,
    payload,
    this._solution.trunkSid
  );
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Trunking.V1.TrunkContext.PhoneNumberList
 * @description Initialize the PhoneNumberList
 *
 * @param {Twilio.Trunking.V1} version - Version of the resource
 * @param {string} trunkSid - The trunk_sid
 */
/* jshint ignore:end */
function PhoneNumberList(version, trunkSid) {
  /* jshint ignore:start */
  /**
   * @function phoneNumbers
   * @memberof Twilio.Trunking.V1.TrunkContext
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Trunking.V1.TrunkContext.PhoneNumberContext}
   */
  /* jshint ignore:end */
  function PhoneNumberListInstance(sid) {
    return PhoneNumberListInstance.get(sid);
  }

  PhoneNumberListInstance._version = version;
  // Path Solution
  PhoneNumberListInstance._solution = {
    trunkSid: trunkSid
  };
  PhoneNumberListInstance._uri = _.template(
    '/Trunks/<%= trunkSid %>/PhoneNumbers' // jshint ignore:line
  )(PhoneNumberListInstance._solution);
  /* jshint ignore:start */
  /**
   * create a PhoneNumberInstance
   *
   * @function create
   * @memberof Twilio.Trunking.V1.TrunkContext.PhoneNumberList
   * @instance
   *
   * @param {object} opts - ...
   * @param {string} opts.phoneNumberSid - The phone_number_sid
   * @param {function} [callback] - Callback to handle processed record
   *
   * @returns {Promise} Resolves to processed PhoneNumberInstance
   */
  /* jshint ignore:end */
  PhoneNumberListInstance.create = function create(opts, callback) {
    if (_.isUndefined(opts)) {
      throw new Error('Required parameter "opts" missing.');
    }
    if (_.isUndefined(opts.phoneNumberSid)) {
      throw new Error('Required parameter "opts.phoneNumberSid" missing.');
    }

    var deferred = Q.defer();
    var data = values.of({
      'PhoneNumberSid': opts.phoneNumberSid
    });

    var promise = this._version.create({
      uri: this._uri,
      method: 'POST',
      data: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new PhoneNumberInstance(
        this._version,
        payload,
        this._solution.trunkSid,
        this._solution.sid
      ));
    }.bind(this));

    promise.catch(function(error) {
      deferred.reject(error);
    });

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Streams PhoneNumberInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.Trunking.V1.TrunkContext.PhoneNumberList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         each() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize=50] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no pageSize is defined but a limit is defined,
   *         each() will attempt to read the limit with the most efficient
   *         page size, i.e. min(limit, 1000)
   * @param {Function} [opts.callback] -
   *         Function to process each record. If this and a positional
   * callback are passed, this one will be used
   * @param {Function} [opts.done] -
   *          Function to be called upon completion of streaming
   * @param {Function} [callback] - Function to process each record
   */
  /* jshint ignore:end */
  PhoneNumberListInstance.each = function each(opts, callback) {
    opts = opts || {};
    if (_.isFunction(opts)) {
      opts = { callback: opts };
    } else if (_.isFunction(callback) && !_.isFunction(opts.callback)) {
      opts.callback = callback;
    }

    if (_.isUndefined(opts.callback)) {
      throw new Error('Callback function must be provided');
    }

    var done = false;
    var currentPage = 1;
    var limits = this._version.readLimits({
      limit: opts.limit,
      pageSize: opts.pageSize
    });

    function onComplete(error) {
      done = true;
      if (_.isFunction(opts.done)) {
        opts.done(error);
      }
    }

    function fetchNextPage(fn) {
      var promise = fn();
      if (_.isUndefined(promise)) {
        onComplete();
        return;
      }

      promise.then(function(page) {
        _.each(page.instances, function(instance) {
          if (done) {
            return false;
          }

          opts.callback(instance, onComplete);
        });

        if ((limits.pageLimit && limits.pageLimit <= currentPage)) {
          onComplete();
        } else if (!done) {
          currentPage++;
          fetchNextPage(_.bind(page.nextPage, page));
        }
      });

      promise.catch(onComplete);
    }

    fetchNextPage(_.bind(this.page, this, opts));
  };

  /* jshint ignore:start */
  /**
   * @description Lists PhoneNumberInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.Trunking.V1.TrunkContext.PhoneNumberList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {number} [opts.limit] -
   *         Upper limit for the number of records to return.
   *         list() guarantees never to return more than limit.
   *         Default is no limit
   * @param {number} [opts.pageSize] -
   *         Number of records to fetch per request,
   *         when not set will use the default value of 50 records.
   *         If no page_size is defined but a limit is defined,
   *         list() will attempt to read the limit with the most
   *         efficient page size, i.e. min(limit, 1000)
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  PhoneNumberListInstance.list = function list(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};
    var deferred = Q.defer();
    var allResources = [];
    opts.callback = function(resource, done) {
      allResources.push(resource);

      if (!_.isUndefined(opts.limit) && allResources.length === opts.limit) {
        done();
      }
    };

    opts.done = function(error) {
      if (_.isUndefined(error)) {
        deferred.resolve(allResources);
      } else {
        deferred.reject(error);
      }
    };

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    this.each(opts);
    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Retrieve a single page of PhoneNumberInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.Trunking.V1.TrunkContext.PhoneNumberList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  PhoneNumberListInstance.page = function page(opts, callback) {
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'PageToken': opts.pageToken,
      'Page': opts.pageNumber,
      'PageSize': opts.pageSize
    });

    var promise = this._version.page({
      uri: this._uri,
      method: 'GET',
      params: data
    });

    promise = promise.then(function(payload) {
      deferred.resolve(new PhoneNumberPage(
        this._version,
        payload,
        this._solution.trunkSid,
        this._solution.sid
      ));
    }.bind(this));

    promise.catch(function(error) {
      deferred.reject(error);
    });

    if (_.isFunction(callback)) {
      deferred.promise.nodeify(callback);
    }

    return deferred.promise;
  };

  /* jshint ignore:start */
  /**
   * Constructs a phone_number
   *
   * @function get
   * @memberof Twilio.Trunking.V1.TrunkContext.PhoneNumberList
   * @instance
   *
   * @param {string} sid - The sid
   *
   * @returns {Twilio.Trunking.V1.TrunkContext.PhoneNumberContext}
   */
  /* jshint ignore:end */
  PhoneNumberListInstance.get = function get(sid) {
    return new PhoneNumberContext(
      this._version,
      this._solution.trunkSid,
      sid
    );
  };

  return PhoneNumberListInstance;
}


/* jshint ignore:start */
/**
 * @constructor Twilio.Trunking.V1.TrunkContext.PhoneNumberInstance
 * @description Initialize the PhoneNumberContext
 *
 * @property {string} accountSid - The account_sid
 * @property {phone_number.address_requirement} addressRequirements -
 *          The address_requirements
 * @property {string} apiVersion - The api_version
 * @property {string} beta - The beta
 * @property {string} capabilities - The capabilities
 * @property {Date} dateCreated - The date_created
 * @property {Date} dateUpdated - The date_updated
 * @property {string} friendlyName - The friendly_name
 * @property {string} links - The links
 * @property {string} phoneNumber - The phone_number
 * @property {string} sid - The sid
 * @property {string} smsApplicationSid - The sms_application_sid
 * @property {string} smsFallbackMethod - The sms_fallback_method
 * @property {string} smsFallbackUrl - The sms_fallback_url
 * @property {string} smsMethod - The sms_method
 * @property {string} smsUrl - The sms_url
 * @property {string} statusCallback - The status_callback
 * @property {string} statusCallbackMethod - The status_callback_method
 * @property {string} trunkSid - The trunk_sid
 * @property {string} url - The url
 * @property {string} voiceApplicationSid - The voice_application_sid
 * @property {string} voiceCallerIdLookup - The voice_caller_id_lookup
 * @property {string} voiceFallbackMethod - The voice_fallback_method
 * @property {string} voiceFallbackUrl - The voice_fallback_url
 * @property {string} voiceMethod - The voice_method
 * @property {string} voiceUrl - The voice_url
 *
 * @param {Twilio.Trunking.V1} version - Version of the resource
 * @param {object} payload - The instance payload
 * @param {sid} trunkSid - The trunk_sid
 * @param {sid} sid - The sid
 */
/* jshint ignore:end */
function PhoneNumberInstance(version, payload, trunkSid, sid) {
  this._version = version;

  // Marshaled Properties
  this.accountSid = payload.account_sid; // jshint ignore:line
  this.addressRequirements = payload.address_requirements; // jshint ignore:line
  this.apiVersion = payload.api_version; // jshint ignore:line
  this.beta = payload.beta; // jshint ignore:line
  this.capabilities = payload.capabilities; // jshint ignore:line
  this.dateCreated = deserialize.iso8601DateTime(payload.date_created); // jshint ignore:line
  this.dateUpdated = deserialize.iso8601DateTime(payload.date_updated); // jshint ignore:line
  this.friendlyName = payload.friendly_name; // jshint ignore:line
  this.links = payload.links; // jshint ignore:line
  this.phoneNumber = payload.phone_number; // jshint ignore:line
  this.sid = payload.sid; // jshint ignore:line
  this.smsApplicationSid = payload.sms_application_sid; // jshint ignore:line
  this.smsFallbackMethod = payload.sms_fallback_method; // jshint ignore:line
  this.smsFallbackUrl = payload.sms_fallback_url; // jshint ignore:line
  this.smsMethod = payload.sms_method; // jshint ignore:line
  this.smsUrl = payload.sms_url; // jshint ignore:line
  this.statusCallback = payload.status_callback; // jshint ignore:line
  this.statusCallbackMethod = payload.status_callback_method; // jshint ignore:line
  this.trunkSid = payload.trunk_sid; // jshint ignore:line
  this.url = payload.url; // jshint ignore:line
  this.voiceApplicationSid = payload.voice_application_sid; // jshint ignore:line
  this.voiceCallerIdLookup = payload.voice_caller_id_lookup; // jshint ignore:line
  this.voiceFallbackMethod = payload.voice_fallback_method; // jshint ignore:line
  this.voiceFallbackUrl = payload.voice_fallback_url; // jshint ignore:line
  this.voiceMethod = payload.voice_method; // jshint ignore:line
  this.voiceUrl = payload.voice_url; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {
    trunkSid: trunkSid,
    sid: sid || this.sid,
  };
}

Object.defineProperty(PhoneNumberInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new PhoneNumberContext(
        this._version,
        this._solution.trunkSid,
        this._solution.sid
      );
    }

    return this._context;
  },
});

/* jshint ignore:start */
/**
 * fetch a PhoneNumberInstance
 *
 * @function fetch
 * @memberof Twilio.Trunking.V1.TrunkContext.PhoneNumberInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed PhoneNumberInstance
 */
/* jshint ignore:end */
PhoneNumberInstance.prototype.fetch = function fetch(callback) {
  return this._proxy.fetch(callback);
};

/* jshint ignore:start */
/**
 * remove a PhoneNumberInstance
 *
 * @function remove
 * @memberof Twilio.Trunking.V1.TrunkContext.PhoneNumberInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed PhoneNumberInstance
 */
/* jshint ignore:end */
PhoneNumberInstance.prototype.remove = function remove(callback) {
  return this._proxy.remove(callback);
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Trunking.V1.TrunkContext.PhoneNumberContext
 * @description Initialize the PhoneNumberContext
 *
 * @param {Twilio.Trunking.V1} version - Version of the resource
 * @param {sid} trunkSid - The trunk_sid
 * @param {sid} sid - The sid
 */
/* jshint ignore:end */
function PhoneNumberContext(version, trunkSid, sid) {
  this._version = version;

  // Path Solution
  this._solution = {
    trunkSid: trunkSid,
    sid: sid,
  };
  this._uri = _.template(
    '/Trunks/<%= trunkSid %>/PhoneNumbers/<%= sid %>' // jshint ignore:line
  )(this._solution);
}

/* jshint ignore:start */
/**
 * fetch a PhoneNumberInstance
 *
 * @function fetch
 * @memberof Twilio.Trunking.V1.TrunkContext.PhoneNumberContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed PhoneNumberInstance
 */
/* jshint ignore:end */
PhoneNumberContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({
    uri: this._uri,
    method: 'GET'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(new PhoneNumberInstance(
      this._version,
      payload,
      this._solution.trunkSid,
      this._solution.sid
    ));
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

/* jshint ignore:start */
/**
 * remove a PhoneNumberInstance
 *
 * @function remove
 * @memberof Twilio.Trunking.V1.TrunkContext.PhoneNumberContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed PhoneNumberInstance
 */
/* jshint ignore:end */
PhoneNumberContext.prototype.remove = function remove(callback) {
  var deferred = Q.defer();
  var promise = this._version.remove({
    uri: this._uri,
    method: 'DELETE'
  });

  promise = promise.then(function(payload) {
    deferred.resolve(payload);
  }.bind(this));

  promise.catch(function(error) {
    deferred.reject(error);
  });

  if (_.isFunction(callback)) {
    deferred.promise.nodeify(callback);
  }

  return deferred.promise;
};

module.exports = {
  PhoneNumberPage: PhoneNumberPage,
  PhoneNumberList: PhoneNumberList,
  PhoneNumberInstance: PhoneNumberInstance,
  PhoneNumberContext: PhoneNumberContext
};