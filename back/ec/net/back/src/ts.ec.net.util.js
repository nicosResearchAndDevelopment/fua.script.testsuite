const
    path  = require('path'),
    _util = require('@fua/core.util'),
    _uuid = require('@fua/core.uuid'),
    util  = exports = module.exports = {
        ..._util,
        assert: _util.Assert('ts.ec.ids')
    };

util.path = path;
util.uuid = _uuid;

util.PASS           = 'PASS';
util.FAIL           = 'FAIL';
util.NOT_APPLICABLE = 'NOT_APPLICABLE';

util.pause = function (seconds) {
    return new Promise((resolve) => {
        if (seconds >= 0) setTimeout(resolve, 1e3 * seconds);
        else setImmediate(resolve);
    });
};

util.createErrorTestResultIsMissing = function ({urn = 'urn:gbx', uri = ''} = {}) {
    return class ErrorTestResultIsMissing extends Error {
        constructor() {
            super(urn + ' : test result is missing');
            this.code      = urn + ':error:test-result-is-missing';
            this.id        = uri + 'error/' + util.uuid.v1();
            this.prov      = uri;
            this.timestamp = util.utcDateTime();
            util.lockAllProp(this);
        }
    }; // ErrorTestResultIsMissing
}; // createErrorTestResultIsMissing

util.createErrorBadPort = function ({urn = 'urn:gbx', uri = ''} = {}) {
    return class ErrorBadPort extends Error {
        constructor(port) {
            super(urn + ' : bad port <' + port + '>');
            this.code      = urn + ':error:ports-bad';
            this.id        = uri + 'error/' + util.uuid.v1();
            this.prov      = uri;
            this.timestamp = util.utcDateTime();
            util.lockAllProp(this);
        }
    }; // ErrorBadPort
}; // createErrorBadPort

util.createErrorPortsNeededNotFound = function ({urn = 'urn:gbx', uri = ''} = {}) {
    return class ErrorPortsNeededNotFound extends Error {
        constructor(port) {
            super(urn + ' : ports needed, NOT found <' + port + '>');
            this.code      = urn + ':error:ports-needed-not-found';
            this.id        = uri + 'error/' + util.uuid.v1();
            this.prov      = uri;
            this.timestamp = util.utcDateTime();
            util.lockAllProp(this);
        }
    }; // ErrorPortsNeededNotFound
}; // createErrorPortsNeededNotFound

module.exports = Object.freeze(util);
