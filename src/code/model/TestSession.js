const
    util  = require('../util.testsuite.js'),
    model = require('./index.js');

class TestSession {

    #statements = Object.create(null);
    #history    = [];

    constructor(history) {
        if (history) for (let {key, value, ts} of history) {
            util.assert(util.isString(key), 'expected key to be a string', TypeError);
            util.assert(util.isNumber(ts), 'expected ts to be a number', TypeError);
            if (this.#history.length > 0) util.assert(ts > this.#history[this.#history.length - 1].ts, 'expected ts to be greater than last ts', TypeError);
            if (util.isNull(value)) {
                delete this.#statements[key];
                this.#history.push({key, value: null, ts});
            } else {
                this.#statements[key] = value;
                this.#history.push({key, value, ts});
            }
        }
    }

    set(key, value) {
        util.assert(util.isString(key), 'expected key to be a string', TypeError);
        const ts = util.hrt();
        if (this.#history.length > 0) util.assert(ts > this.#history[this.#history.length - 1].ts, 'expected ts to be greater than last ts', TypeError);
        if (util.isNull(value)) {
            delete this.#statements[key];
            this.#history.push({key, value: null, ts});
        } else {
            this.#statements[key] = value;
            this.#history.push({key, value, ts});
        }
        return this;
    }

    get(key) {
        if (!util.isString(key)) return null;
        return (key in this.#statements) ? this.#statements[key] : null;
    }

    has(key) {
        if (!util.isString(key)) return false;
        return key in this.#statements;
    }

} // TestSession

module.exports = TestSession;
