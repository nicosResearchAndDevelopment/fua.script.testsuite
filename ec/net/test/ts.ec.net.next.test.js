const
    {describe, test, before, after} = require('mocha'),
    expect                          = require('expect'),
    util                            = require('../src/ts.ec.net.util.js'),
    testing                         = require('@nrd/fua.module.testing'),
    TestsuiteAgent                  = require('../../../src/code/agent.testsuite.next.js');

describe('ts.ec.net.ping', function () {

    this.timeout('10s');

    let agent = null;

    before('init', async function () {
        agent = await TestsuiteAgent.create({
            connect: {
                type:               'http',
                url:                'https://testbed.nicos-rd.com:8080/testing',
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
    }); // before('init')

    after('exit', async function () {
        await agent.close();
    }); // after

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
