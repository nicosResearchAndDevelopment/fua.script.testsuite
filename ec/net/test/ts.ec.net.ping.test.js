const
    {describe, test, before, after} = require('mocha'),
    expect                          = require('expect'),
    testing                         = require('@nrd/fua.module.testing'),
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

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        await testing.init({
            load:   [__dirname, '../../../session/session.json'],
            select: {
                //suite:    this.test.parent.titlePath().join('.'),
                date:     util.localDate(),
                operator: 'test@nicos-ag.com'
            }
        });

        expect(testing.property('applicant')).toBe('example.org');

    }); // before('initialize session')

    after('exit', async function () {
        await testing.exit();

        //await util.pause('1s');
        //expect(() => testing.token()).toThrow();
        //expect(() => testing.property('applicant')).toThrow();

    }); // after

    test('should successfully ping the applicant', async function () {

        const token = testing.token({
            //test:      this.test.titlePath().join('.'),
            //applicant: testing.property('applicant'),
            testCase: 'urn:ts:ec:net:tc:ping',
            param:    {
                'host': testing.property('host')
            },
            validation: {}
        });
        token.log("DAS IST EIN TEST!!!!!!!!!!!!!!!!!!!!!!!!!");

        const testResult = await session.agent.enforce(
            session.agent.Token({
                id:     undefined,
                start:  undefined,
                thread: `${util.utcDateTime()} : TS-MOCHA : test : ping : start`
            }),
            {
                testCase: 'urn:ts:ec:net:tc:ping',
                param:    {
                    'host': session.applicant.host
                },
                operator: 'https://testbed.nicos-rd.com/domain/user#jlangkau'
            }
        );

        expect(testResult.error).toMatchObject({
            value: 'PASS'
        });
        expect(testResult.data.validationResult).toMatchObject({
            value: 'PASS'
        });

    }); // test('should successfully ping the applicant')

}); // describe('ts.ec.net.ping')
