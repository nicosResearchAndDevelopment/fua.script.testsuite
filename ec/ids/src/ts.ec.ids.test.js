const
    {describe, test, before, after} = require('mocha'),
    expect                          = require('expect'),
    util                            = require('@nrd/fua.core.util'),
    // testing                         = require('@nrd/fua.module.testing'),
    TestsuiteAgent                  = require('../../../src/code/agent.testsuite.next.js'),
    basicAuth                       = (user, password) => 'Basic ' + Buffer.from(user + ':' + password).toString('base64'),
    SocketIOClient                  = require('socket.io-client');

describe('urn:ts:ec:ids', function () {

    this.timeout('100s');

    before('init', async function () {
        await initTestsuite();
        await initRC();
    });

    after('exit', async function () {
        await exitTestsuite();
    });

    let agent = null, rcClient = null;

    async function initTestsuite() {
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
    } // initTestsuite

    async function exitTestsuite() {
        await agent.close();
    } // exitTestsuite

    async function initRC() {
        rcClient = SocketIOClient.io(agent.testing.property('applicant'));
        await new Promise((resolve, reject) => rcClient.on('connect', resolve).on('connect_error', reject));
    } // initRC

    async function refreshDat() {
        await new Promise((resolve, reject) => {
            const callback = (err, result) => err ? reject(util.errorFromJSON(err)) : resolve(result);
            rcClient.emit('refreshDAT', {}, callback);
        });
    } // refreshDat

    test('urn:tb:ec:ids:tm:DAPSInteraction:captureDAT', async function () {
        const [token] = await Promise.all([
            agent.test({
                ecosystem:  'urn:tb:ec:ids',
                testMethod: 'urn:tb:ec:ids:tm:DAPSInteraction:captureDAT',
                param:      {
                    sub: agent.testing.property('ski_aki')
                }
            }),
            util.pause('500ms').then(refreshDat)
        ]);

        console.log(token.serialize());
        expect(token.result.token).toBeTruthy();
        expect(token.result.payload.sub).toBe(token.param.sub);
    });

    test('urn:tb:ec:ids:tc:DAPSInteraction:ReceiveDATfromDAPS', async function () {
        const [token] = await Promise.all([
            agent.test({
                ecosystem: 'urn:tb:ec:ids',
                testCase:  'urn:tb:ec:ids:tc:DAPSInteraction:ReceiveDATfromDAPS',
                param:     {
                    connector: {
                        clientId: agent.testing.property('ski_aki')
                    }
                }
            }),
            util.pause('500ms').then(refreshDat)
        ]);

        console.log(token.serialize());
        expect(token.validation.datReceived).toBe(true);
    });

});
