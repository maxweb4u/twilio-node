'use strict';

/* jshint ignore:start */
/**
 * This code was generated by
 * \ / _    _  _|   _  _
 *  | (_)\/(_)(_|\/| |(/_  v1.0.0
 *       /       /
 */
/* jshint ignore:end */

var Q = require('q');  /* jshint ignore:line */
var _ = require('lodash');  /* jshint ignore:line */
var Page = require('../../../base/Page');  /* jshint ignore:line */
var deserialize = require(
    '../../../base/deserialize');  /* jshint ignore:line */
var serialize = require('../../../base/serialize');  /* jshint ignore:line */
var values = require('../../../base/values');  /* jshint ignore:line */

var CompositionList;
var CompositionPage;
var CompositionInstance;
var CompositionContext;

/* jshint ignore:start */
/**
 * @constructor Twilio.Video.V1.CompositionList
 * @description Initialize the CompositionList
 * PLEASE NOTE that this class contains preview products that are subject to change. Use them with caution. If you currently do not have developer preview access, please contact help@twilio.com.
 *
 * @param {Twilio.Video.V1} version - Version of the resource
 */
/* jshint ignore:end */
CompositionList = function CompositionList(version) {
  /* jshint ignore:start */
  /**
   * @function compositions
   * @memberof Twilio.Video.V1
   * @instance
   *
   * @param {string} sid - sid of instance
   *
   * @returns {Twilio.Video.V1.CompositionContext}
   */
  /* jshint ignore:end */
  function CompositionListInstance(sid) {
    return CompositionListInstance.get(sid);
  }

  CompositionListInstance._version = version;
  // Path Solution
  CompositionListInstance._solution = {};
  CompositionListInstance._uri = _.template(
    '/Compositions' // jshint ignore:line
  )(CompositionListInstance._solution);
  /* jshint ignore:start */
  /**
   * Streams CompositionInstance records from the API.
   *
   * This operation lazily loads records as efficiently as possible until the limit
   * is reached.
   *
   * The results are passed into the callback function, so this operation is memory efficient.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function each
   * @memberof Twilio.Video.V1.CompositionList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {composition.status} [opts.status] - The status
   * @param {Date} [opts.dateCreatedAfter] - The date_created_after
   * @param {Date} [opts.dateCreatedBefore] - The date_created_before
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
  CompositionListInstance.each = function each(opts, callback) {
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
    var currentResource = 0;
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
          if (done || (!_.isUndefined(opts.limit) && currentResource >= opts.limit)) {
            done = true;
            return false;
          }

          currentResource++;
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

    fetchNextPage(_.bind(this.page, this, _.merge(opts, limits)));
  };

  /* jshint ignore:start */
  /**
   * @description Lists CompositionInstance records from the API as a list.
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function list
   * @memberof Twilio.Video.V1.CompositionList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {composition.status} [opts.status] - The status
   * @param {Date} [opts.dateCreatedAfter] - The date_created_after
   * @param {Date} [opts.dateCreatedBefore] - The date_created_before
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
  CompositionListInstance.list = function list(opts, callback) {
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
   * Retrieve a single page of CompositionInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function page
   * @memberof Twilio.Video.V1.CompositionList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {composition.status} [opts.status] - The status
   * @param {Date} [opts.dateCreatedAfter] - The date_created_after
   * @param {Date} [opts.dateCreatedBefore] - The date_created_before
   * @param {string} [opts.pageToken] - PageToken provided by the API
   * @param {number} [opts.pageNumber] -
   *          Page Number, this value is simply for client state
   * @param {number} [opts.pageSize] - Number of records to return, defaults to 50
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  CompositionListInstance.page = function page(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'Status': _.get(opts, 'status'),
      'DateCreatedAfter': serialize.iso8601DateTime(_.get(opts, 'dateCreatedAfter')),
      'DateCreatedBefore': serialize.iso8601DateTime(_.get(opts, 'dateCreatedBefore')),
      'PageToken': opts.pageToken,
      'Page': opts.pageNumber,
      'PageSize': opts.pageSize
    });

    var promise = this._version.page({uri: this._uri, method: 'GET', params: data});

    promise = promise.then(function(payload) {
      deferred.resolve(new CompositionPage(this._version, payload, this._solution));
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
   * Retrieve a single target page of CompositionInstance records from the API.
   * Request is executed immediately
   *
   * If a function is passed as the first argument, it will be used as the callback function.
   *
   * @function getPage
   * @memberof Twilio.Video.V1.CompositionList
   * @instance
   *
   * @param {composition.status} [opts.status] - The status
   * @param {Date} [opts.dateCreatedAfter] - The date_created_after
   * @param {Date} [opts.dateCreatedBefore] - The date_created_before
   * @param {string} [targetUrl] - API-generated URL for the requested results page
   * @param {function} [callback] - Callback to handle list of records
   *
   * @returns {Promise} Resolves to a list of records
   */
  /* jshint ignore:end */
  CompositionListInstance.getPage = function getPage(targetUrl, callback) {
    var deferred = Q.defer();

    var promise = this._version._domain.twilio.request({method: 'GET', uri: targetUrl});

    promise = promise.then(function(payload) {
      deferred.resolve(new CompositionPage(this._version, payload, this._solution));
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
   * create a CompositionInstance
   *
   * @function create
   * @memberof Twilio.Video.V1.CompositionList
   * @instance
   *
   * @param {object|function} opts - ...
   * @param {string|list} [opts.audioSources] - The audio_sources
   * @param {string|list} [opts.videoSources] - The video_sources
   * @param {composition.video_layout} [opts.videoLayout] - The video_layout
   * @param {string} [opts.resolution] - The resolution
   * @param {composition.format} [opts.format] - The format
   * @param {number} [opts.desiredBitrate] - The desired_bitrate
   * @param {number} [opts.desiredMaxDuration] - The desired_max_duration
   * @param {string} [opts.statusCallback] - The status_callback
   * @param {string} [opts.statusCallbackMethod] - The status_callback_method
   * @param {boolean} [opts.trim] - The trim
   * @param {boolean} [opts.reuse] - The reuse
   * @param {function} [callback] - Callback to handle processed record
   *
   * @returns {Promise} Resolves to processed CompositionInstance
   */
  /* jshint ignore:end */
  CompositionListInstance.create = function create(opts, callback) {
    if (_.isFunction(opts)) {
      callback = opts;
      opts = {};
    }
    opts = opts || {};

    var deferred = Q.defer();
    var data = values.of({
      'AudioSources': serialize.map(_.get(opts, 'audioSources'), function(e) { return e; }),
      'VideoSources': serialize.map(_.get(opts, 'videoSources'), function(e) { return e; }),
      'VideoLayout': _.get(opts, 'videoLayout'),
      'Resolution': _.get(opts, 'resolution'),
      'Format': _.get(opts, 'format'),
      'DesiredBitrate': _.get(opts, 'desiredBitrate'),
      'DesiredMaxDuration': _.get(opts, 'desiredMaxDuration'),
      'StatusCallback': _.get(opts, 'statusCallback'),
      'StatusCallbackMethod': _.get(opts, 'statusCallbackMethod'),
      'Trim': serialize.bool(_.get(opts, 'trim')),
      'Reuse': serialize.bool(_.get(opts, 'reuse'))
    });

    var promise = this._version.create({uri: this._uri, method: 'POST', data: data});

    promise = promise.then(function(payload) {
      deferred.resolve(new CompositionInstance(this._version, payload, this._solution.sid));
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
   * Constructs a composition
   *
   * @function get
   * @memberof Twilio.Video.V1.CompositionList
   * @instance
   *
   * @param {string} sid - The sid
   *
   * @returns {Twilio.Video.V1.CompositionContext}
   */
  /* jshint ignore:end */
  CompositionListInstance.get = function get(sid) {
    return new CompositionContext(this._version, sid);
  };

  return CompositionListInstance;
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Video.V1.CompositionPage
 * @augments Page
 * @description Initialize the CompositionPage
 * PLEASE NOTE that this class contains preview products that are subject to change. Use them with caution. If you currently do not have developer preview access, please contact help@twilio.com.
 *
 * @param {Twilio.Video.V1} version - Version of the resource
 * @param {object} response - Response from the API
 * @param {object} solution - Path solution
 *
 * @returns CompositionPage
 */
/* jshint ignore:end */
CompositionPage = function CompositionPage(version, response, solution) {
  // Path Solution
  this._solution = solution;

  Page.prototype.constructor.call(this, version, response, this._solution);
};

_.extend(CompositionPage.prototype, Page.prototype);
CompositionPage.prototype.constructor = CompositionPage;

/* jshint ignore:start */
/**
 * Build an instance of CompositionInstance
 *
 * @function getInstance
 * @memberof Twilio.Video.V1.CompositionPage
 * @instance
 *
 * @param {object} payload - Payload response from the API
 *
 * @returns CompositionInstance
 */
/* jshint ignore:end */
CompositionPage.prototype.getInstance = function getInstance(payload) {
  return new CompositionInstance(this._version, payload);
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Video.V1.CompositionInstance
 * @description Initialize the CompositionContext
 * PLEASE NOTE that this class contains preview products that are subject to change. Use them with caution. If you currently do not have developer preview access, please contact help@twilio.com.
 *
 * @property {string} accountSid - The account_sid
 * @property {composition.status} status - The status
 * @property {Date} dateCreated - The date_created
 * @property {string} dateCompleted - The date_completed
 * @property {string} dateDeleted - The date_deleted
 * @property {string} sid - The sid
 * @property {string} audioSources - The audio_sources
 * @property {string} videoSources - The video_sources
 * @property {composition.video_layout} videoLayout - The video_layout
 * @property {string} resolution - The resolution
 * @property {composition.format} format - The format
 * @property {number} bitrate - The bitrate
 * @property {number} size - The size
 * @property {number} duration - The duration
 * @property {string} url - The url
 * @property {string} links - The links
 *
 * @param {Twilio.Video.V1} version - Version of the resource
 * @param {object} payload - The instance payload
 * @param {sid} sid - The sid
 */
/* jshint ignore:end */
CompositionInstance = function CompositionInstance(version, payload, sid) {
  this._version = version;

  // Marshaled Properties
  this.accountSid = payload.account_sid; // jshint ignore:line
  this.status = payload.status; // jshint ignore:line
  this.dateCreated = deserialize.iso8601DateTime(payload.date_created); // jshint ignore:line
  this.dateCompleted = payload.date_completed; // jshint ignore:line
  this.dateDeleted = payload.date_deleted; // jshint ignore:line
  this.sid = payload.sid; // jshint ignore:line
  this.audioSources = payload.audio_sources; // jshint ignore:line
  this.videoSources = payload.video_sources; // jshint ignore:line
  this.videoLayout = payload.video_layout; // jshint ignore:line
  this.resolution = payload.resolution; // jshint ignore:line
  this.format = payload.format; // jshint ignore:line
  this.bitrate = deserialize.integer(payload.bitrate); // jshint ignore:line
  this.size = deserialize.integer(payload.size); // jshint ignore:line
  this.duration = deserialize.integer(payload.duration); // jshint ignore:line
  this.url = payload.url; // jshint ignore:line
  this.links = payload.links; // jshint ignore:line

  // Context
  this._context = undefined;
  this._solution = {sid: sid || this.sid, };
};

Object.defineProperty(CompositionInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new CompositionContext(this._version, this._solution.sid);
    }

    return this._context;
  }
});

/* jshint ignore:start */
/**
 * fetch a CompositionInstance
 *
 * @function fetch
 * @memberof Twilio.Video.V1.CompositionInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed CompositionInstance
 */
/* jshint ignore:end */
CompositionInstance.prototype.fetch = function fetch(callback) {
  return this._proxy.fetch(callback);
};

/* jshint ignore:start */
/**
 * remove a CompositionInstance
 *
 * @function remove
 * @memberof Twilio.Video.V1.CompositionInstance
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed CompositionInstance
 */
/* jshint ignore:end */
CompositionInstance.prototype.remove = function remove(callback) {
  return this._proxy.remove(callback);
};


/* jshint ignore:start */
/**
 * @constructor Twilio.Video.V1.CompositionContext
 * @description Initialize the CompositionContext
 * PLEASE NOTE that this class contains preview products that are subject to change. Use them with caution. If you currently do not have developer preview access, please contact help@twilio.com.
 *
 * @param {Twilio.Video.V1} version - Version of the resource
 * @param {sid} sid - The sid
 */
/* jshint ignore:end */
CompositionContext = function CompositionContext(version, sid) {
  this._version = version;

  // Path Solution
  this._solution = {sid: sid, };
  this._uri = _.template(
    '/Compositions/<%= sid %>' // jshint ignore:line
  )(this._solution);
};

/* jshint ignore:start */
/**
 * fetch a CompositionInstance
 *
 * @function fetch
 * @memberof Twilio.Video.V1.CompositionContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed CompositionInstance
 */
/* jshint ignore:end */
CompositionContext.prototype.fetch = function fetch(callback) {
  var deferred = Q.defer();
  var promise = this._version.fetch({uri: this._uri, method: 'GET'});

  promise = promise.then(function(payload) {
    deferred.resolve(new CompositionInstance(this._version, payload, this._solution.sid));
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
 * remove a CompositionInstance
 *
 * @function remove
 * @memberof Twilio.Video.V1.CompositionContext
 * @instance
 *
 * @param {function} [callback] - Callback to handle processed record
 *
 * @returns {Promise} Resolves to processed CompositionInstance
 */
/* jshint ignore:end */
CompositionContext.prototype.remove = function remove(callback) {
  var deferred = Q.defer();
  var promise = this._version.remove({uri: this._uri, method: 'DELETE'});

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
  CompositionList: CompositionList,
  CompositionPage: CompositionPage,
  CompositionInstance: CompositionInstance,
  CompositionContext: CompositionContext
};
