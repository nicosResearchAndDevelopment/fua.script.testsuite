const
    {TestingConsumer} = require('@nrd/fua.module.testing'),
    util              = require('./ts.util.js');

function Testsuite(testingConsumer) {
    if (!new.target) return new Testsuite(testingConsumer);
    util.assert(testingConsumer instanceof TestingConsumer,
        'expected testingConsumer to be a TestingConsumer');
    this.prop = testingConsumer.property.bind(testingConsumer);
    this.test = testingConsumer.test.bind(testingConsumer);
    Object.freeze(this);
}

module.exports = Testsuite;
