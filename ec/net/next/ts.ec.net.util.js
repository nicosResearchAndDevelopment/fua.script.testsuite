const
    _util = require('@nrd/fua.core.util'),
    util  = exports = module.exports = {
        ..._util,
        assert: _util.Assert('ts.ec.net')
    };

util.expect = require('expect');

module.exports = Object.freeze(util);
