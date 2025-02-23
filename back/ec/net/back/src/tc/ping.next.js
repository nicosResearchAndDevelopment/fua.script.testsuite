const
    testcase = exports,
    util     = require('../ts.ec.net.util.js'),
    expect   = require('expect');

testcase.ec   = 'net';
testcase.name = 'ping';
testcase.id   = 'https://testsuite.nicos-rd.com/ec/net/tc/activity/ping/';
testcase.urn  = 'urn:ts:ec:net:tc:ping';

/**
 * @param {fua.module.testing.TestToken} token
 * @returns {Promise<void>}
 */
testcase.method = async function (token) {

    token.log(`started testcase ${testcase.urn}`);

    token.assign({
        ec:      'net',
        command: 'ping'
    });

    token.log(`syncing with the testbed - ec: ${token.data.ec}, command: ${token.data.ping}`);

    await token.sync();

    token.log(`sync complete, start validating`);

    expect(token.data.testResult).toBeTruthy();

    token.data.validation = {
        result: {
            timestamp: util.utcDateTime()
        }
    };

    expect(token.data.testResult.isAlive).toBe(true);

    token.state('IS_ALIVE', true);

    token.log(`validation finished successfully`);

};
