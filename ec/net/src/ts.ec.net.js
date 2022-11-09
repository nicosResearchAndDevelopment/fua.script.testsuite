const
    EventEmitter = require('events'),
    util         = require('../../../src/code/util.testsuite.js'),
    testcases    = {
        ping:     require('./tc/ping.next.js'),
        portscan: require('./tc/portscan.next.js')
    };

class EcosystemNet {

    #emitter   = new EventEmitter();
    #testcases = Object.create(null);

    constructor() {
        for (let testcase of Object.values(testcases)) {
            this.#testcases[testcase.name] = Object.assign(
                async function (token) {
                    await testcase.method(token);
                }, {
                    id:  testcase.id,
                    urn: testcase.urn
                }
            );
            util.lockProp(this.#testcases, testcase.name);
        }
        Object.freeze(this.#testcases);
    }

    get testcases() {
        return this.#testcases;
    }

    on(eventName, listener) {
        this.#emitter.on(eventName, listener);
        return this;
    } // EcosystemLDP#on

    once(eventName, listener) {
        this.#emitter.once(eventName, listener);
        return this;
    } // EcosystemLDP#once

    off(eventName, listener) {
        this.#emitter.off(eventName, listener);
        return this;
    } // EcosystemLDP#off

} // EcosystemNet

module.exports = EcosystemNet;
