const
    testcase = exports,
    util     = require('../ts.ec.net.util.js'),
    expect   = require('expect');

testcase.ec   = 'net';
testcase.name = 'portscan';
testcase.id   = 'https://testsuite.nicos-rd.com/ec/net/tc/activity/portscan/';
testcase.urn  = 'urn:ts:ec:net:tc:portscan';

/**
 * @param {fua.module.testing.TestToken} token
 * @returns {Promise<void>}
 */
testcase.method = async function (token) {

    token.log(`started testcase ${testcase.urn}`);

    token.assign({
        ec:      'net',
        command: 'portscan'
    });

    token.log(`syncing with the testbed - ec: ${token.data.ec}, command: ${token.data.ping}`);

    await token.sync();

    token.log(`sync complete, start validating`);

    expect(token.data.testResult).toBeTruthy();

    token.data.validation = {
        result: {
            timestamp: util.utcDateTime(),
            ports:     {}
        }
    };

    if (token.data.param.ports.needed) {
        token.log(`checking needed ports`);

        const ports_found     = [];
        const ports_NOT_found = [];
        for (const [protocol, ports] of Object.entries(token.data.param.ports.needed)) {
            ports.forEach((p) => {
                if (token.data.testResult.operationalResult[protocol][p]) {
                    let node = {
                        protocol: protocol,
                        port:     p
                    };
                    if (token.data.testResult.operationalResult[protocol][p].service)
                        node.service = token.data.testResult.operationalResult[protocol][p].service;
                    if (token.data.testResult.operationalResult[protocol][p].state)
                        node.state = token.data.testResult.operationalResult[protocol][p].state;
                    ports_found.push(node);
                } else {
                    ports_NOT_found.push(p);
                } // if ()
            });
        } // for ([protocol, ports])

        if (ports_found.length < token.data.param.ports.needed.length) {
            token.data.validation.result.ports.found     = ports_found;
            token.data.validation.result.ports.not_found = ports_NOT_found;
            token.state('ec/net/PORTS_NEEDED', false);
        } else {
            token.data.validation.result.ports.found = ports_found;
            token.state('ec/net/PORTS_NEEDED', true);
        } // if ()

    } // if (token.data.param.ports.needed)

    if (token.data.param.ports.bad) {
        token.log(`checking bad ports`);

        const ports_found = [];
        for (const [protocol, ports] of Object.entries(token.data.param.ports.bad)) {
            ports.forEach((p) => {
                if (token.data.testResult.operationalResult[protocol][p]) {
                    let node = {
                        protocol: protocol,
                        port:     p
                    };
                    if (token.data.testResult.operationalResult[protocol][p].service)
                        node.service = token.data.testResult.operationalResult[protocol][p].service;
                    if (token.data.testResult.operationalResult[protocol][p].state)
                        node.state = token.data.testResult.operationalResult[protocol][p].state;
                    ports_found.push(node);
                } // if ()
            });
        } // for ([protocol, ports])

        if (ports_found.length > 0) {
            token.data.validation.result.ports.bad_found = ports_found;
            token.state('ec/net/NO_BAD_PORT', false);
        } else {
            token.state('ec/net/NO_BAD_PORT', true);
        } // if ()
    } // if (token.data.param.ports.bad)

    delete token.data.testResult.operationalResult;

    token.state('ec/net/PORTS_CORRECT', true);

    token.log(`validation finished successfully`);

};
