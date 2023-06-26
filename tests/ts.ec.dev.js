const
    {describe, test} = require('mocha'),
    expect           = require('expect');

describe('ts.ec.dev', function () {

    this.timeout('10s');

    test('datetime', async function () {
        const token = await this.ts.test({
            ecosystem:  'urn:tb:ec:dev',
            testMethod: 'urn:tb:ec:dev:tm:datetime'
        });
        console.log(token.serialize());
        expect(token.result.datetime).toBeTruthy();
        console.log('date:', new Date(token.result.datetime));
    });

});
