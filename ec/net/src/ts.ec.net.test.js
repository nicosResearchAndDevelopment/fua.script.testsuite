const
    {describe, test, before, after} = require('mocha'),
    expect                          = require('expect'),
    util                            = require('@nrd/fua.core.util'),
    // testing                         = require('@nrd/fua.module.testing'),
    TestsuiteAgent                  = require('../../../src/code/agent.testsuite.next.js'),
    basicAuth                       = (user, password) => 'Basic ' + Buffer.from(user + ':' + password).toString('base64');

describe('urn:ts:ec:net', function () {

    this.timeout('10s');

    let agent = null;

    before('init', async function () {
        // TODO move initialization to a central location and generalize it
        agent = await TestsuiteAgent.create({
            connect: {
                type: 'http',
                // url: 'https://localhost:8080/testing',
                url:                'https://tb.nicos-rd.com/testing',
                headers:            {
                    'Authorization': basicAuth('testsuite', 'testsuite')
                },
                rejectUnauthorized: false
            },
            session: {
                file:       [__dirname, '../../../session/session.json'],
                properties: {
                    //suite:    this.test.parent.titlePath().join('.'),
                    date:     util.localDate(),
                    operator: 'test@nicos-ag.com'
                }
            }
        });
    });

    after('exit', async function () {
        await agent.close();
    });

    test('urn:tb:ec:net:tm:ping', async function () {
        const token = await agent.test({
            ecosystem:  'urn:tb:ec:net',
            testMethod: 'urn:tb:ec:net:tm:ping',
            param:      {
                host: agent.testing.property('host')
            }
        });
        console.log(token.serialize());
        expect(token.result.isAlive).toBe(true);
    });

    test('urn:tb:ec:net:tc:reachable', async function () {
        const token = await agent.test({
            ecosystem: 'urn:tb:ec:net',
            testCase:  'urn:tb:ec:net:tc:reachable',
            param:     {
                host: agent.testing.property('host')
            }
        });
        console.log(token.serialize());
        expect(token.validation.success).toBe(true);
    });

});
