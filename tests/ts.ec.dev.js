const
    {describe, test} = require('mocha'),
    expect           = require('expect'),
    util             = require('@nrd/fua.core.util');

describe('ts.ec.dev', function () {

    this.timeout('10s');

    test('expect', async function () {
        expect(this.expect).toBe(expect);

        expect(typeof expect.toBeTypeOf).toBe('function');
        expect(() => expect('lorem').toBeTypeOf('string')).not.toThrow();
        expect(() => expect('ipsum').toBeTypeOf('object')).toThrow();
        expect(() => expect(null).not.toBeTypeOf('object')).toThrow();
    });

    test('datetime', async function () {
        const
            startDate      = new Date(),
            token          = await this.ts.test({
                ecosystem:  'urn:tb:ec:dev',
                testMethod: 'urn:tb:ec:dev:tm:datetime'
            }),
            endDate        = new Date(),
            tokenDate      = new Date(token.result.datetime),
            timeBefore     = tokenDate.getTime() - startDate.getTime(),
            timeAfter      = endDate.getTime() - tokenDate.getTime(),
            timeBetween    = endDate.getTime() - startDate.getTime(),
            dateToString   = (date) => date.getHours().toString().padStart(2, '0') + ':'
                + date.getMinutes().toString().padStart(2, '0') + ':'
                + date.getSeconds().toString().padStart(2, '0') + '.'
                + date.getMilliseconds().toString().padStart(3, '0'),
            timeToString   = (time) => (time < 0 ? '-' : '+')
                + dateToString(new Date(0, 0, 0,
                    Math.floor(Math.abs(time) / 3600000),
                    Math.floor(Math.abs(time) / 60000) % 60,
                    Math.floor(Math.abs(time) / 1000) % 60,
                    Math.abs(time) % 1000
                )).replace(/00:/g, '').replace(/^0+(?=\d)/, ''),
            maxShift       = 500,
            maxDelay       = 1000,
            toleratedStart = new Date(startDate.getTime() - maxShift),
            toleratedEnd   = new Date(endDate.getTime() + maxShift);

        expect(token.result.datetime).toBeTruthy();
        console.log(`datetime: ${dateToString(startDate)} < [${timeToString(timeBefore)}] ${dateToString(tokenDate)} < [${timeToString(timeAfter)}] ${dateToString(endDate)}`);
        expect(tokenDate.getTime()).toBeGreaterThan(toleratedStart.getTime());
        expect(tokenDate.getTime()).toBeLessThan(toleratedEnd.getTime());
        expect(timeBetween).toBeLessThan(maxDelay);
    });

});
