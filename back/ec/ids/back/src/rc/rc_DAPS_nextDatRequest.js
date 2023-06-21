const
    util = require('../ts.ec.ids.util.js'),
    NAME = 'rc_DAPS_nextDatRequest';

module.exports = function MethodFactory_rc_DAPS_nextDatRequest(
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

    async function rc_DAPS_nextDatRequest(token, data) {
        const result = {token, data, error: null};

        try {
            token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : called`);

            data.ec      = ec;
            data.command = 'rc_DAPS_nextDatRequest';

            await agent.test(token, data);

            token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : before : validation`);

            if (!data.testResult) throw new ErrorTestResultIsMissing();
            if (!data.testResult.operationalResult) throw new ErrorOperationalResultIsMissing();

            data.validationResult = {
                id:        `${uri}/validation/result/${util.uuid.v1()}`,
                timestamp: util.utcDateTime(),
                status:    ((data.testResult.operationalResult['@type'] === 'ids:SelfDescription') ? util.PASS : util.FAIL)
            };
        } catch (err) {
            result.error = err;
            util.logError(err);
        } // try

        token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : before : return`);
        return result;
    } // rc_refreshDAT

    Object.defineProperties(rc_DAPS_nextDatRequest, {
        id:   {value: uri, enumerable: true},
        urn:  {value: urn, enumerable: true},
        name: {value: NAME, enumerable: true}
    });

    return Object.freeze(rc_DAPS_nextDatRequest);
}; // module.exports = MethodFactory_rc_DAPS_nextDatRequest
