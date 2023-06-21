const
    fixtures  = exports,
    hooks     = fixtures.mochaHooks = {},
    testing   = require('@nrd/fua.module.testing'),
    util      = require('./ts.util.js'),
    config    = require('./ts.config.js'),
    Testsuite = require('./ts.agent.js');

fixtures.mochaGlobalSetup = async function () {
    util.assert(util.isString(config.connect.type), 'expected config.connect.type to be a string');
    util.assert(util.isString(config.session.file) || util.isStringArray(config.session.file),
        'expected config.session.file to be a string or string array');
    util.assert(util.isObject(config.session.properties), 'expected config.session.properties to be an object');

    const
        testsuiteId                      = config.id,
        {connectType, ...connectOptions} = config.connect,
        {file: session, properties}      = config.session;

    fixtures.testingConsumer = testing.Consumer.from({'@id': testsuiteId, connectType, connectOptions});
    await fixtures.testingConsumer.init({session, properties});
};

fixtures.mochaGlobalTeardown = async function () {
    await fixtures.testingConsumer.exit();
    delete fixtures.testingConsumer;
};

hooks.beforeAll = async function () {
    this.ts = this.testsuite = new Testsuite(fixtures.testingConsumer);
};

// hooks.afterAll = async function () {};
// hooks.beforeEach = async function () {};
// hooks.afterEach = async function () {};
