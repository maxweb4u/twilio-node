'use strict';

var _ = require('lodash');
var Instance = require('../../../../base');
var InstanceContext = require('../../../../base/InstanceContext');
var values = require('../../../../base/values');

var CredentialListInstance;
var CredentialListContext;

function CredentialListInstance() {
}

Object.defineProperty(CredentialListInstance.prototype,
  '_proxy', {
  get: function() {
    if (!this._context) {
      this._context = new CredentialListContext(
        this._version,
        this._solution.trunkSid,
        this._solution.sid
      );
    }

    return this._context;
  },
});

Object.defineProperty(CredentialListInstance.prototype,
  'accountSid', {
  get: function() {
    return this._properties.accountSid;
  },
});

Object.defineProperty(CredentialListInstance.prototype,
  'sid', {
  get: function() {
    return this._properties.sid;
  },
});

Object.defineProperty(CredentialListInstance.prototype,
  'trunkSid', {
  get: function() {
    return this._properties.trunkSid;
  },
});

Object.defineProperty(CredentialListInstance.prototype,
  'friendlyName', {
  get: function() {
    return this._properties.friendlyName;
  },
});

Object.defineProperty(CredentialListInstance.prototype,
  'dateCreated', {
  get: function() {
    return this._properties.dateCreated;
  },
});

Object.defineProperty(CredentialListInstance.prototype,
  'dateUpdated', {
  get: function() {
    return this._properties.dateUpdated;
  },
});

Object.defineProperty(CredentialListInstance.prototype,
  'url', {
  get: function() {
    return this._properties.url;
  },
});

/**
 * Initialize the CredentialListContext
 *
 * @param {Version} version - Version that contains the resource
 * @param {object} payload - The instance payload
 * @param {sid} trunkSid: The trunk_sid
 * @param {sid} sid: The sid
 *
 * @returns {CredentialListContext}
 */
CredentialListInstance.prototype.CredentialListInstance = function
    CredentialListInstance(version, payload, trunkSid, sid) {
  Instance.constructor.call(this, version);

  // Marshaled Properties
  this._properties = {
    accountSid: payload.account_sid, // jshint ignore:line,
    sid: payload.sid, // jshint ignore:line,
    trunkSid: payload.trunk_sid, // jshint ignore:line,
    friendlyName: payload.friendly_name, // jshint ignore:line,
    dateCreated: payload.date_created, // jshint ignore:line,
    dateUpdated: payload.date_updated, // jshint ignore:line,
    url: payload.url, // jshint ignore:line,
  };

  // Context
  this._context = undefined;
  this._solution = {
    trunkSid: trunkSid,
    sid: sid || this._properties.sid,
  };
};

/**
 * Fetch a CredentialListInstance
 *
 * @returns Fetched CredentialListInstance
 */
CredentialListInstance.prototype.fetch = function fetch() {
  return this._proxy.fetch();
};

/**
 * Deletes the CredentialListInstance
 *
 * @returns true if delete succeeds, false otherwise
 */
CredentialListInstance.prototype.delete = function delete() {
  return this._proxy.delete();
};


/**
 * Initialize the CredentialListContext
 *
 * @param {Version} version - Version that contains the resource
 * @param {sid} trunkSid - The trunk_sid
 * @param {sid} sid - The sid
 *
 * @returns {CredentialListContext}
 */
function CredentialListContext(version, trunkSid, sid) {
  InstanceContext.constructor.call(this, version);

  // Path Solution
  this._solution = {
    trunkSid: trunkSid,
    sid: sid,
  };
  this._uri = _.template(
    '/Trunks/<% trunk_sid %>/CredentialLists/<% sid %>', // jshint ignore:line
    this._solution
  );
}

/**
 * Fetch a CredentialListInstance
 *
 * @returns Fetched CredentialListInstance
 */
CredentialListContext.prototype.fetch = function fetch() {
  var params = values.of({});

  var payload = this._version.fetch({
    method: 'GET',
    uri: this._uri,
    params: params,
  });

  return new CredentialListInstance(
    this._version,
    payload,
    this._solution.trunkSid,
    this._solution.sid
  );
};

/**
 * Deletes the CredentialListInstance
 *
 * @returns true if delete succeeds, false otherwise
 */
CredentialListContext.prototype.delete = function delete() {
  return this._version.delete('delete', this._uri);
};

module.exports = {
  CredentialListInstance: CredentialListInstance,
  CredentialListContext: CredentialListContext
};