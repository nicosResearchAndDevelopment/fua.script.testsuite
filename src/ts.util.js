const
    _util = require('@fua/core.util'),
    path  = require('path'),
    util  = exports = module.exports = {
        ..._util,
        assert: _util.Assert('app.testsuite')
    };

util.joinPath  = (...segments) => path.join(...segments).replace(/\\/g, '/');
util.basicAuth = (user, password) => 'Basic ' + Buffer.from(user + ':' + password).toString('base64');

module.exports = Object.freeze(util);
