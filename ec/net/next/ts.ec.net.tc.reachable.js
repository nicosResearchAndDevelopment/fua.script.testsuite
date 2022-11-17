const
    util       = require('./ts.ec.net.util.js'),
    {TestCase} = require('@nrd/fua.module.testing/model');

/** @type {fua.module.testing.TestCase} */
module.exports = new TestCase({
    '@id': 'urn:ts:ec:net:tc:reachable',
    /** @param {fua.module.testing.TestToken} token */
    async processor(token) {
        token.log(`started testcase ${this}`);

        util.expect(token.data.testCase).toBe(this.id);
        util.expect(token.data.param).toBeTruthy();

        const pingToken = token.token({
            ecosystem:  'urn:tb:ec:net',
            testMethod: 'urn:tb:ec:net:tm:ping',
            param:      {
                host: token.data.param.host
            }
        });

        pingToken.log(`syncing with the testbed`);
        await pingToken.sync();
        pingToken.log(`sync complete, start validating`);

        util.expect(pingToken.data.result).toBeTruthy();

        token.data.validation = {
            timestamp: util.utcDateTime(),
            isAlive:   pingToken.data.result.isAlive || false
        };

        util.expect(token.data.validation.isAlive).toBe(true);
        token.state('IS_ALIVE', true);

        token.data.validation.success = true;
        token.log(`validation finished successfully`);
    }
});
