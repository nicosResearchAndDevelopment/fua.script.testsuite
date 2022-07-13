const
    util = require('../ts.ec.ids.util.js'),
    NAME = 'SUT_provides_self_description';

module.exports = function MethodFactory_SUT_provides_self_description(
    {
        ec:          ec = 'ids',
        tc_root_uri: tc_root_uri,
        tc_root_urn: tc_root_urn,
        agent:       agent,
        criterion:   criterion,
        console_log: console_log = false
    }
) {
    const
        uri                             = `${tc_root_uri}activity/${NAME}/`,
        urn                             = `${tc_root_urn}${NAME}`,
        testCase                        = `${tc_root_uri}${NAME}/`,
        ErrorTestResultIsMissing        = util.createErrorTestResultIsMissing({urn, uri}),
        ErrorOperationalResultIsMissing = util.createErrorOperationalResultIsMissing({urn, uri});

    async function SUT_provides_self_description(token, data) {
        const result = {token, data, error: null};

        try {
            token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : called`);

            data.ec      = ec;
            data.command = 'requestApplicantsSelfDescription';

            await agent.test(token, data);

            token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : before : validation`);

            if (!data.testResult) throw  new ErrorTestResultIsMissing();
            if (!data.testResult.operationalResult) throw new ErrorOperationalResultIsMissing();

            data.validationResult = {
                id:        `${uri}/validation/result/${util.uuid.v1()}`,
                timestamp: util.utcDateTime(),
                value:     (data.testResult.operationalResult['@type'] === 'ids:SelfDescription') ? util.PASS : util.FAIL,
                criterion: {}
            };

            data.validationResult.criterion.INF_01 = criterion.INF_01({
                id:          `${uri}validation/criterion/INF_01/${util.uuid.v1()}`,
                prov:        SUT_provides_self_description.id,
                testCase:    testCase,
                description: 'SUT provides correct Self Description',
                status:      (data.testResult.operationalResult['@type'] === 'ids:SelfDescription') ? util.PASS : util.FAIL,
                timestamp:   util.utcDateTime()
            });

            data.validationResult.criterion.INF_05 = criterion.INF_05({
                id:          `${uri}validation/criterion/INF_01/${util.uuid.v1()}`,
                prov:        SUT_provides_self_description.id,
                testCase:    testCase,
                description: 'SUT provides correct DAT',
                status:      util.FAIL,
                timestamp:   util.utcDateTime()
            });
        } catch (err) {
            result.error = err;
            util.logError(err);
        } // try

        if (console_log) util.logObject(result);

        token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : before : return`);
        return result;
    } // SUT_provides_self_description

    Object.defineProperties(SUT_provides_self_description, {
        id:   {value: uri, enumerable: true},
        urn:  {value: urn, enumerable: true},
        name: {value: NAME, enumerable: true}
    });

    return Object.freeze(SUT_provides_self_description);
}; // module.exports = MethodFactory_SUT_provides_self_description
