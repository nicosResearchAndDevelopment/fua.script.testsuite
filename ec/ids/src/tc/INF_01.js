const
    util = require('../ts.ec.ids.util.js'),
    NAME = 'INF_01';

module.exports = function MethodFactory_INF_01(
    {
        ec:          ec = 'ids',
        tc_root_uri: tc_root_uri,
        tc_root_urn: tc_root_urn,
        agent:       agent
    }
) {
    const
        uri                             = `${tc_root_uri}${NAME}/`,
        urn                             = `${tc_root_urn}${NAME}`,
        ErrorTestResultIsMissing        = util.createErrorTestResultIsMissing({urn, uri}),
        ErrorOperationalResultIsMissing = util.createErrorOperationalResultIsMissing({urn, uri});

    async function INF_01(token, data) {
        const result = {token, data, error: null};

        try {
            token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : called`);

            data.ec      = ec;
            data.command = 'requestApplicantsSelfDescription';

            await agent.test(token, data);

            token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : before : validation`);

            if (!data.testResult) throw new ErrorTestResultIsMissing();
            if (!data.testResult.operationalResult) throw new ErrorOperationalResultIsMissing();

            data.validationResult = {
                id:        `${uri}/validation/result/${util.uuid.v1()}`,
                timestamp: util.utcDateTime(),
                value:     ((data.testResult.operationalResult['@type'] === 'ids:SelfDescription') ? util.PASS : util.FAIL)
            };
        } catch (err) {
            result.error = err;
            util.logError(err);
        } // try

        token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : before : return`);
        return result;
    } // INF_01

    Object.defineProperties(INF_01, {
        id:   {value: uri, enumerable: true},
        urn:  {value: urn, enumerable: true},
        name: {value: NAME, enumerable: true}
    });

    return Object.freeze(INF_01);
}; // module.exports = MethodFactory_INF_01
