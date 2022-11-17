const
    util               = require('./ts.ec.net.util.js'),
    {TestingEcosystem} = require('@nrd/fua.module.testing/model');

/** @type {fua.module.testing.TestingEcosystem} */
module.exports = new TestingEcosystem({
    '@id':     'urn:ts:ec:net',
    testCases: [
        require('./ts.ec.net.tc.reachable.js')
    ]
});
