const
    util   = require('./ts.util.js'),
    expect = module.exports = require('expect');

/**
 * @this {MatcherContext}
 * @param {unknown} value
 * @param {string} type
 * @returns {ExpectationResult}
 */
function toBeTypeOf(value, type) {
    util.assert(util.isString(type) && /^\w+$/.test(type), 'type must be a string');
    const pass    = typeof value === type;
    const message = () => this.utils.matcherHint('toBeTypeOf', 'value', 'type', this)
        + '\n\nExpected type: ' + (pass ? 'not ' : '') + this.utils.printExpected(type)
        + '\nReceived type: ' + this.utils.printReceived(typeof value);
    return {pass, message};
}

expect.extend({
    toBeTypeOf
});
