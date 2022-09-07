const
    {describe, test, before, after} = require('mocha'),
    expect                          = require('expect'),
    util                            = require('../src/ts.ec.ids.util.js'),
    config                          = require('../../../src/config/config.testsuite.js'),
    TestsuiteAgent                  = require('../../../src/code/agent.testsuite.js'),
    initializeIds                   = require('../src/ts.ec.ids.methods-factory.js');

describe('ts.ec.ids.getDATfromDAPS', function () {

    //this.timeout('10s');
    this.timeout('60s');

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
            'ids': initializeIds({
                root_uri:    config.server.id,
                agent:       session.agent,
                console_log: false
            })
        };

    }); // before('initialize session')

    test('should refresh RC\'s DAT', async function () {

        const testResult = await session.agent.enforce(
            session.agent.Token({
                id:     undefined,
                start:  undefined,
                thread: `${util.utcDateTime()} : TS-MOCHA : test : getDATfromDAPS : start`
            }),
            /* data */ { // REM : CUT refreshes DAT

                //ec:       "ids",
                ////command:  "rc_refreshDAT",
                //command:  "refreshDAT",

                testCase: 'urn:ts:ec:ids:tc:rc_refreshDAT',
                operator: 'https://testbed.nicos-rd.com/domain/user#jlangkau',
                param:    {
                    rc:        "https://alice.nicos-rd.com:8099/",
                    daps:      "default",
                    tweak_dat: {
                        exp: 11234234234
                    },
                    verifyDAT: true
                }
            },
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

    }); // test('should refresh RC's DAT')

    test('should set DAPS to next DAT-request', async function () {

        const testResult = await session.agent.enforce(
            session.agent.Token({
                id:     undefined,
                start:  undefined,
                thread: `${util.utcDateTime()} : TS-MOCHA : test : DAPS_nextDatRequest : start`
            }),
            /* data */ { // REM : CUT refreshes DAT

                //ec:       "ids",
                ////command:  "rc_refreshDAT",
                //command:  "refreshDAT",

                testCase: 'urn:ts:ec:ids:tc:rc_DAPS_nextDatRequest',
                operator: 'https://testbed.nicos-rd.com/domain/user#jlangkau',
                param:    {
                    daps: "default",
                    next: {
                        address:   "next", // REM: next OR CUT-ip
                        once:      true,
                        tweak_dat: {
                            exp: 11234234234
                        }
                    }
                }
            }
        );

        expect(testResult.data.validationResult).toMatchObject({
            value: 'PASS'
        });

    }); // test('should set DAPS to next DAT-reqeust')

}); // describe('ts.ec.net.ping')
