const
    {describe, test, before, after} = require('mocha'),
    expect                          = require('expect'),
    testing                         = require('@nrd/fua.module.testing'),
    util                            = require('../src/ts.ec.net.util.js');

describe('ts.ec.net.ping', function () {

    this.timeout('10s');

    /** @type {fua.module.testing.TestingConsumer} */
    let agent = null;

    before('init', async function () {
        agent = await testing.Consumer.from({
            connectType:    'http',
            connectOptions: {
                url:                'https://testbed.nicos-rd.com:8080/testing',
                rejectUnauthorized: false
            }
        }).init({
            session:    [__dirname, '../../../session/session.json'],
            properties: {
                //suite:    this.test.parent.titlePath().join('.'),
                date:     util.localDate(),
                operator: 'test@nicos-ag.com'
            }
        });
    }); // before('init')

    after('exit', async function () {
        await agent.exit();
    }); // after

    test('urn:tb:ec:net:tc:reachable', async function () {
        const token = await agent.test({
            ecosystem: 'urn:tb:ec:net',
            testCase:  'urn:tb:ec:net:tc:reachable',
            param:     {
                host: agent.property('host')
            }
        });
        console.log(token.serialize());
        expect(token.validation.success).toBe(true);
    });

});
