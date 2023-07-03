const
    {describe, test} = require('mocha'),
    expect           = require('expect');

describe('ts.ec.net', function () {

    this.timeout('10s');

    test('ping', async function () {
        const token = await this.ts.test({
            ecosystem:  'urn:tb:ec:net',
            testMethod: 'urn:tb:ec:net:tm:ping',
            param:      {
                host: this.ts.prop('host')
            }
        });
        console.log(token.serialize());
        expect(token).toHaveProperty('result.isAlive', true);
    });

    test('portscan', async function () {
        const token = await this.ts.test({
            ecosystem:  'urn:tb:ec:net',
            testMethod: 'urn:tb:ec:net:tm:portscan',
            param:      {
                host: this.ts.prop('host')
            }
        });
        console.log(token.serialize());
        expect(token).toHaveProperty('result.entries', expect.any(Array));
    });

    test('reachable', async function () {
        const token = await this.ts.test({
            ecosystem: 'urn:tb:ec:net',
            testCase:  'urn:tb:ec:net:tc:reachable',
            param:     {
                host: this.ts.prop('host')
            }
        });
        console.log(token.serialize());
        expect(token).toHaveProperty('validation.success', true);
    });

});
