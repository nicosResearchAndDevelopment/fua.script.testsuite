const
    util        = require('./util.testsuite.js'),
    ServerAgent = require('@fua/agent.server'),
    testing     = require('@fua/module.testing');

class TestsuiteAgent extends ServerAgent {

    static id = 'http://www.nicos-rd.com/fua/testbed#TestsuiteAgent';

    #testing = null;

    async initialize(options = {}) {

        await super.initialize(options);

        if (options.connect && options.session) {
            const {type: connectType, ...connectOptions} = options.connect || {};
            util.assert(util.isString(connectType), 'expected connectType to be a string');

            const {file: session, properties} = options.session || {};
            util.assert(util.isString(session) || util.isArray(session), 'expected session to be a string or string array');
            util.assert(util.isObject(properties), 'expected properties to be an object');

            this.#testing = await testing.Consumer.from({
                '@id': this.uri,
                connectType,
                connectOptions
            }).init({
                session,
                properties
            });
        }

        return this;
    } // TestsuiteAgent#initialize

    get testing() {
        return this.#testing;
    }

    async close() {
        if (this.testing) await this.testing.exit();
        if (this.server) await super.close();
    } // TestsuiteAgent#close

    async test(tokenArgs = {}) {
        util.assert(this.testing, 'expected testing to be defined');
        return await this.testing.test(tokenArgs);
    } // TestsuiteAgent#test

} // TestsuiteAgent

module.exports = TestsuiteAgent;
