const
    {describe, test, before, after} = require('mocha'),
    expect                          = require('expect'),
    testing                         = require('@fua/module.testing'),
    util                            = require('../src/ts.ec.net.util.js'),
    config                          = require('../../../src/config/config.testsuite.js'),
    TestsuiteAgent                  = require('../../../src/code/agent.testsuite.js'),
    initializeNet                   = require('../src/initialize.net.js');

describe('ts.ec.net.ping', function () {

    this.timeout('10s');

    let agent = null;

    before('initialize session', async function () {

        agent = await TestsuiteAgent.create({
            context: config.space.context,
            store:   config.space.datastore,
            prefix:  'ts',
            testbed: config.testbed,
            event:   true
        });

        await initializeNet({
            'agent': agent
        });

        await testing.init({
            load:   [__dirname, '../../../session/session.json'],
            select: {
                //suite:    this.test.parent.titlePath().join('.'),
                date:     util.localDate(),
                operator: 'test@nicos-ag.com'
            },
            events: agent.event
        });

    }); // before('initialize session')

    after('exit', async function () {
        await testing.exit();
        await agent.close();
    }); // after

    test('should successfully ping the applicant', async function () {

        const token = testing.token({
            testCase: 'urn:ts:ec:net:tc:ping',
            param:    {
                'host': testing.property('host')
            }
        });

        token.log("N DAS IST EIN TEST!!!!!!!!!!!!!!!!!!!!!!!!!");

        await agent.launchTestCase(token);

        expect(token.data).toMatchObject({
            validation: {
                success: true
            }
        });

    }); // test('should successfully ping the applicant')

}); // describe('ts.ec.net.ping')
