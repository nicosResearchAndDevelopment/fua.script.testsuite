const
    util = require('../ts.ec.net.util.js'),
    NAME = 'portscan';

module.exports = function MethodFactory_portscan(
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
        ErrorTestResultIsMissing = util.createErrorTestResultIsMissing({urn, uri}),
        ErrorBadPort             = util.createErrorBadPort({urn, uri}),
        ErrorPortsNeededNotFound = util.createErrorPortsNeededNotFound({urn, uri});

    async function portscan(token, data) {
        const result = {token, data, error: null};

        try {
            token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : called`);

            data.ec      = ec;
            data.command = NAME;

            await agent.test(token, data);

            token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : before : validation`);

            if (!data.testResult) throw new ErrorTestResultIsMissing();

            data.validationResult = {
                id:        `${uri}portscan/validation/result/${util.uuid.v1()}`,
                timestamp: util.utcDateTime(),
                //testCase:              urn,
                //testCriterion:         undefined,
                //testCaseSpecification: undefined,
                ports: {},
                //value:                 util.PASS // REM: sub-failings will set to 'util.FAIL',
                criterion: {}
            };

            // TODO rework the following code for a more streamlined structure

            let
                status = util.PASS,
                error  = null;

            if (data.param.ports.needed) {
                token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : validation : ports : needed`);
                const ports_found     = [];
                const ports_NOT_found = [];
                for (const [protocol, ports] of Object.entries(data.param.ports.needed)) {
                    ports.forEach((p) => {
                        if (data.testResult.operationalResult[protocol][p]) {
                            let node = {
                                protocol: protocol,
                                port:     p
                            };
                            if (data.testResult.operationalResult[protocol][p].service)
                                node.service = data.testResult.operationalResult[protocol][p].service;
                            if (data.testResult.operationalResult[protocol][p].state)
                                node.state = data.testResult.operationalResult[protocol][p].state;
                            ports_found.push(node);
                        } else {
                            ports_NOT_found.push(p);
                        } // if ()
                    });
                } // for ([protocol, ports])

                if (ports_NOT_found.length > 0) {
                    data.validationResult.ports.needed = {
                        status: util.FAIL
                    };
                    status                             = util.FAIL;
                    error                              = new ErrorPortsNeededNotFound(JSON.stringify(ports_NOT_found));
                } else {
                    data.validationResult.ports.needed = {
                        status: util.PASS
                    };
                } // if ()

            } else {
                data.validationResult.ports.needed = {
                    value: util.NOT_APPLICABLE
                };
            } // if (data.param.ports.needed)

            if (!error && data.param.ports.bad) {
                token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : validation : ports : NOT_bad`);
                const ports_found = [];
                for (const [protocol, ports] of Object.entries(data.param.ports.bad)) {
                    ports.forEach((p) => {
                        if (data.testResult.operationalResult[protocol][p]) {
                            let node = {
                                protocol: protocol,
                                port:     p
                            };
                            if (data.testResult.operationalResult[protocol][p].service)
                                node.service = data.testResult.operationalResult[protocol][p].service;
                            if (data.testResult.operationalResult[protocol][p].state)
                                node.state = data.testResult.operationalResult[protocol][p].state;
                            ports_found.push(node);
                        } // if ()
                    });
                } // for ([protocol, ports])

                if (ports_found.length > 0) {
                    data.validationResult.ports.NOT_bad = {
                        status: util.FAIL
                    };
                    status                              = util.FAIL;
                    error                               = new ErrorBadPort(JSON.stringify(ports_found));
                } else {
                    data.validationResult.ports.NOT_bad = {
                        status: util.PASS
                    };
                } // if ()

            } else {
                data.validationResult.ports.NOT_bad = {
                    status: util.NOT_APPLICABLE
                };
                status                              = util.FAIL;
            } // if (data.param.ports.bad)

            data.validationResult.criterion.PORTS_CORRECT = criterion.PORTS_CORRECT({
                id:          `${uri}validation/criterion/PORTS_CORRECT/${util.uuid.v1()}`,
                prov:        portscan.id,
                testCase:    testCase,
                description: 'SUT answers on portscan',
                status:      status,
                timestamp:   util.utcDateTime()
            });

        } catch (err) {
            result.error = err;
            util.logError(err);
        } // try

        if (console_log) util.logObject(result);

        token.thread.push(`${util.utcDateTime()} : TESTSUITE : ${urn} : before : return`);
        return result;
    } // portscan

    Object.defineProperties(portscan, {
        id:   {value: uri, enumerable: true},
        urn:  {value: urn, enumerable: true},
        name: {value: NAME, enumerable: true}
    });

    return Object.freeze(portscan);
}; // module.exports = MethodFactory_portscan
