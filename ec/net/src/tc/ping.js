const
    util      = require('../ts.ec.net.util.js'),
    expect    = require('expect'),
    NAME      = 'ping';
const testing = require("@nrd/fua.module.testing");

module.exports = function MethodFactory_ping(
    {
        ec:          ec = 'net',
        tc_root_uri: tc_root_uri,
        tc_root_urn: tc_root_urn,
        agent:       agent,
        criterion:   criterion,
        console_log: console_log = false
    }
) {
    const
        uri                      = `${tc_root_uri}activity/${NAME}/`,
        urn                      = `${tc_root_urn}${NAME}`,
        testCase                 = `${tc_root_uri}${NAME}/`,
        ErrorTestResultIsMissing = util.createErrorTestResultIsMissing({urn, uri});

    /**
     *
     * @param {fua.module.testing.TestToken} token
     * @returns {Promise<void>}
     */
    async function ping(token) {

        token.log(`TESTSUITE : ${urn} : called`);

        token.data.ec      = ec;
        token.data.command = NAME;

        await token.sync();

        //token.assign({mahl: "zeit"});
        //token.data.mahl2 = "zeitig";

        token.log(`TESTSUITE : ${urn} : before : validation`);

        // region validation

        token.data.validation = {
            result: {
                timestamp: util.utcDateTime()
            }
        };

        expect(token.data.testResult.isAlive).toBe(true);

        token.state('IS_ALIVE', true);

        // endregion validation

        return {error: null};

    } // ping

    Object.defineProperties(ping, {
        id:   {value: uri, enumerable: true},
        urn:  {value: urn, enumerable: true},
        name: {value: NAME, enumerable: true}
    });

    return Object.freeze(ping);
}; // module.exports = MethodFactory_ping
