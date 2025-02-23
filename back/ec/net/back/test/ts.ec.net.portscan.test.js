const
    {describe, test, before, after} = require('mocha'),
    expect                          = require('expect'),
    testing                         = require('@fua/module.testing'),
    util                            = require('../src/ts.ec.net.util.js'),
    config                          = require('../../../src/config/config.testsuite.js'),
    TestsuiteAgent                  = require('../../../src/code/agent.testsuite.js'),
    initializeNet                   = require('../src/initialize.net.js');

describe('ts.ec.net.portscan', function () {

    //this.timeout('10s');
    this.timeout(0);

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

    //test('should successfully make a portscan for the applicant', async function () {
    //
    //    const testResult = await session.agent.enforce(
    //        session.agent.Token({
    //            id:     undefined,
    //            start:  undefined,
    //            thread: `${util.utcDateTime()} : TS-MOCHA : test : ping : portscan`
    //        }),
    //        {
    //            testCase: 'urn:ts:ec:net:tc:portscan',
    //            param:    {
    //                host:  session.applicant.host,
    //                ports: {
    //                    needed: undefined, // REM: TC claims to need those
    //                    //used:   undefined, // REM: applicant claims to use those
    //                    bad: {tcp: [21]} // REM: TC claims those to be bad, validation-result on NOT_bad, PASS|FAIL|NOT_APPLICABLE
    //                    //bad:    {tcp: []}
    //                }
    //            },
    //            operator: 'https://testbed.nicos-rd.com/domain/user#jlangkau'
    //        }
    //    );
    //
    //    expect(testResult.data.validationResult).toMatchObject({
    //        value: 'PASS'
    //    });
    //
    //}); // test('should successfully make a portscan for the applicant')

    test('should successfully make a portscan for the applicant', async function () {

        const token = testing.token({
            //test:      this.test.titlePath().join('.'),
            //applicant: testing.property('applicant'),
            testCase: 'urn:ts:ec:net:tc:portscan',
            param:    {
                host:  testing.property('host'),
                ports: {
                    needed: {tcp: [80]}, // REM: TC claims to need those
                    //used:   undefined, // REM: applicant claims to use those
                    bad: {tcp: [21]} // REM: TC claims those to be bad, validation-result on NOT_bad, PASS|FAIL|NOT_APPLICABLE
                    //bad:    {tcp: []}
                }
            }
        });

        await agent.launchTestCase(token);

        expect(token.data).toMatchObject({
            validation: {
                success: true
            }
        });

    }); // test('should successfully make a portscan for the applicant')

}); // describe('ts.ec.net.ping')
