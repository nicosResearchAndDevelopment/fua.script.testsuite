const
    {describe, test, before, after} = require('mocha'),
    expect                          = require('expect'),
    util                            = require('../src/ts.ec.net.util.js'),
    config                          = require('../../../src/config/config.testsuite.js'),
    TestsuiteAgent                  = require('../../../src/code/agent.testsuite.js'),
    initializeNet                   = require('../src/ts.ec.net.methods-factory.js');

describe('ts.ec.net.ping', function () {

    this.timeout('10s');

    let session = Object.create(null);

    before('initialize session', async function () {

        session.applicant = require('../../../session/ids/tb_ids_bob/config.json');

        session.agent = await TestsuiteAgent.create({
            context: config.space.context,
            store:   config.space.datastore,
            prefix:  'ts',
            testbed: config.testbed
        });

        session.agent.testcases = {
            net: initializeNet({
                root_uri:    config.server.id,
                agent:       session.agent,
                console_log: false
            })
        };

    }); // before('initialize session')

    test('should successfully ping the applicant', async function () {

        const testResult = await session.agent.enforce(
            session.agent.Token({
                id:     undefined,
                start:  undefined,
                thread: `${util.utcDateTime()} : TESTSUITE : app : process : start`
            }),
            {
                testCase: 'urn:ts:ec:net:tc:ping',
                param:    {
                    'host': session.applicant.host
                },
                operator: 'https://testbed.nicos-rd.com/domain/user#jlangkau'
            }
        );

        expect(testResult.data.validationResult).toMatchObject({
            value: 'PASS'
        });

        expect(testResult.data.testResult).toMatchObject({
            isAlive: true
        });

    }); // test('should successfully ping the applicant')

}); // describe('ts.ec.net.ping')
