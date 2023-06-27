const
    {describe, test} = require('mocha'),
    expect           = require('expect');

describe('ts.ec.dev', function () {

    this.timeout('10s');

    test('datetime', async function () {
        const
            tolerance    = 200,
            startDate    = new Date(),
            token        = await this.ts.test({
                ecosystem:  'urn:tb:ec:dev',
                testMethod: 'urn:tb:ec:dev:tm:datetime'
            }),
            endDate      = new Date(),
            tokenDate    = new Date(token.result.datetime),
            timeBefore   = tokenDate - startDate,
            timeAfter    = endDate - tokenDate,
            dateToString = (date) => date.getHours().toString().padStart(2, '0') + ':'
                + date.getMinutes().toString().padStart(2, '0') + ':'
                + date.getSeconds().toString().padStart(2, '0') + '.'
                + date.getMilliseconds().toString().padStart(3, '0'),
            timeToString = (time) => (time < 0 ? '-' : '+')
                + dateToString(new Date(
                    0, 0, 0,
                    Math.floor(Math.abs(time) / 3600000),
                    Math.floor(Math.abs(time) / 60000) % 60,
                    Math.floor(Math.abs(time) / 1000) % 60,
                    Math.abs(time) % 1000
                )).replace(/00:/g, '').replace(/^0+(?=\d)/, '');

        expect(token.result.datetime).toBeTruthy();
        console.log(`datetime: ${dateToString(startDate)} [${timeToString(-timeBefore)}] < ${dateToString(tokenDate)} < [${timeToString(timeAfter)}] ${dateToString(endDate)}`);
        expect(timeBefore).toBeGreaterThan(-tolerance);
        expect(timeAfter).toBeGreaterThan(-tolerance);
    });

});
