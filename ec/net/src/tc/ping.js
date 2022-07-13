const
    util = require('../ts.ec.net.util.js'),
    NAME = 'ping';

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

    async function ping(token, data) {
        const result = {token, data, error: null};

        try {

            token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : called`);

            data.ec      = ec;
            data.command = NAME;

            await agent.test(token, data);

            token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : before : validation`);

            if (!data.testResult) throw new ErrorTestResultIsMissing();

            data.validationResult = {
                id:        `${uri}validation/result/${util.uuid.v1()}`,
                timestamp: util.utcDateTime(),
                //value:     ((data.testResult.isAlive === true) ? util.PASS : util.FAIL),
                criterion: {
                    IS_ALIVE: criterion.IS_ALIVE({
                        id:          `${uri}validation/criterion/IS_ALIVE/${util.uuid.v1()}`,
                        prov:        ping.id,
                        testCase:    testCase,
                        description: 'SUT pinged',
                        status:      ((data.testResult.isAlive === true) ? util.PASS : util.FAIL),
                        timestamp:   util.utcDateTime()
                    })
                }
            };

        } catch (err) {
            result.error = err;
            util.logError(err);
        } // try

        if (console_log) util.logObject(result);

        token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : before : return`);
        return result;
    } // ping

    Object.defineProperties(ping, {
        id:   {value: uri, enumerable: true},
        urn:  {value: urn, enumerable: true},
        name: {value: NAME, enumerable: true}
    });

    return Object.freeze(ping);
}; // module.exports = MethodFactory_ping
