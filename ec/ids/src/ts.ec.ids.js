const
    EventEmitter = require('events'),
    util         = require('../../../src/code/util.testsuite.js');

class EcosystemIDS {

    #emitter = new EventEmitter();

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

} // EcosystemIDS

module.exports = EcosystemIDS;
