const
    {describe, test, before, after} = require('mocha'),
    expect                          = require('expect'),
    util                            = require('@fua/core.util'),
    SocketIOClient                  = require('socket.io-client');

describe('ts.ec.ids', function () {

    this.timeout('10s');

    const context = Object.create(null);

    before(async function () {
        context.rcClient = SocketIOClient.io(this.ts.prop('url'));
        await new Promise((resolve, reject) => context.rcClient.on('connect', resolve).on('connect_error', reject));
        context.refreshDat = () => new Promise((resolve, reject) => {
            const callback = (err, result) => err ? reject(util.errorFromJSON(err)) : resolve(result);
            context.rcClient.emit('refreshDAT', {}, callback);
        });
    });

    after(function () {
        context.rcClient.close();
    });

    describe('DAPSInteraction', function () {

        test('captureDAT', async function () {
            const [token] = await Promise.all([
                this.ts.test({
                    ecosystem:  'urn:tb:ec:ids',
                    testMethod: 'urn:tb:ec:ids:tm:DAPSInteraction:captureDAT',
                    param:      {
                        sub: this.ts.prop('ski_aki')
                    }
                }),
                util.pause('500ms').then(context.refreshDat)
            ]);
            console.log(token.serialize());
            expect(token).toHaveProperty('result.token');
            expect(token).toHaveProperty('result.payload.sub', token.param.sub);
        });

        test('ReceiveDATfromDAPS', async function () {
            const [token] = await Promise.all([
                this.ts.test({
                    ecosystem: 'urn:tb:ec:ids',
                    testCase:  'urn:tb:ec:ids:tc:DAPSInteraction:ReceiveDATfromDAPS',
                    param:     {
                        connector: {
                            clientId: this.ts.prop('ski_aki')
                        }
                    }
                }),
                util.pause('500ms').then(context.refreshDat)
            ]);
            console.log(token.serialize());
            expect(token).toHaveProperty('validation.datReceived', true);
        });

    });

});
