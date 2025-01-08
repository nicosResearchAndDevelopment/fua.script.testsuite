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

util.PASS = 'PASS';
util.FAIL = 'FAIL';

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

util.createErrorOperationalResultIsMissing = function ({urn = 'urn:gbx', uri = ''} = {}) {
    return class ErrorOperationalResultIsMissing extends Error {
        constructor() {
            super(urn + ' : operational result is missing');
            this.code      = urn + ':error:operational-result-is-missing';
            this.id        = uri + 'error/' + util.uuid.v1();
            this.prov      = uri;
            this.timestamp = util.utcDateTime();
            util.lockAllProp(this);
        }
    }; // ErrorOperationalResultIsMissing
}; // createErrorOperationalResultIsMissing

// REM: Error classes should be fixed for the whole testsuite
//      and not created individually with changing error codes.
//      The following code would be more suitable for general error classes.
//
// util.ErrorTestResultIsMissing = util.createErrorClass(
//     'ErrorTestResultIsMissing',
//     'urn:gbx:ts:ec:ids:error:missing-test-result',
//     function (source) {
//         this.source    = source || '';
//         this.timestamp = util.utcDateTime();
//         util.lockAllProp(this);
//     }
// ); // ErrorTestResultIsMissing
//
// util.ErrorOperationalResultIsMissing = util.createErrorClass(
//     'ErrorOperationalResultIsMissing',
//     'urn:gbx:ts:ec:ids:error:missing-operational-result',
//     function (source) {
//         this.source    = source || '';
//         this.timestamp = util.utcDateTime();
//         util.lockAllProp(this);
//     }
// ); // ErrorOperationalResultIsMissing

module.exports = Object.freeze(util);
