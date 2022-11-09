const
    path             = require('path'),
    util             = require('./util.testsuite.js'),
    ServerAgent      = require('@nrd/fua.agent.server'),
    testing_model    = require('@nrd/fua.module.testing/model'),
    socket_io_client = require('socket.io-client');

class TestsuiteAgent extends ServerAgent {

    static id = 'http://www.nicos-rd.com/fua/testbed#TestsuiteAgent';

    #prefix          = '';
    #tbSocketUrl     = '';
    #tbSocketOptions = null;
    #tbSocket        = null;
    #tbEmit          = null;
    #testcases       = Object.create(null);
    #ecosystems      = Object.create(null);

    #connected      = false;
    #connectPromise = null;

    constructor(options = {}) {
        util.assert(util.isString(options.prefix) && options.prefix.length > 0, 'expected prefix to be a non empty string');
        util.assert(util.isObject(options.testbed), 'expected testbed to be an object');
        util.assert(util.isString(options.testbed.schema), 'expected testbed.schema to be a string');
        util.assert(util.isString(options.testbed.host), 'expected testbed.host to be a string');
        util.assert(util.isString(options.testbed.port) || util.isInteger(options.testbed.port), 'expected testbed.port to be a string or an integer');
        util.assert(util.isNull(options.testbed.options) || util.isObject(options.testbed.options), 'expected testbed.options to be an object or null');

        super(options);

        this.#prefix          = options.prefix;
        this.#tbSocketUrl     = `${options.testbed.schema}://${options.testbed.host}:${options.testbed.port}/execute`;
        this.#tbSocketOptions = options.testbed.options || {};
    } // TestsuiteAgent#constructor

    async initialize(options = {}) {
        await super.initialize(options);

        this.#tbSocket = socket_io_client(this.#tbSocketUrl, this.#tbSocketOptions);
        this.#tbEmit   = util.promisify(this.#tbSocket.emit).bind(this.#tbSocket);

        this.#tbSocket.on('connect', () => {
            this.#tbEmit('subscribe', {room: 'event'});
            this.emit('testbed_socket_connect');
        });

        this.#tbSocket.on('error', (error) => {
            if (util.isString(error)) error = new Error(error);
            else if (!(error instanceof Error) && util.isString(error?.message)) error = new Error(error.message);
            // util.logError(error);
            this.emit('error', error);
        });

        this.#tbSocket.on('event', (event) => {
            // util.logObject(event);
            this.emit('event', event);
        });

        // TODO evaluate if it is actually better to not wait for the connect event
        this.#connectPromise = new Promise((resolve, reject) => {
            let onError, onConnect;
            this.#tbSocket.once('connect', onConnect = () => {
                this.#tbSocket.off(onError);
                this.#connected = true;
                resolve();
            });
            this.#tbSocket.once('error', onError = (err) => {
                this.#tbSocket.off(onConnect);
                reject(err);
            });
        });

        if (this.event && this.#tbSocket)
            this.event.connectIOSocket(this.#tbSocket, 'fua.module.testing.TestToken.**');

        return this;
    } // TestsuiteAgent#initialize

    get id() {
        return this.uri;
    }

    get ecosystems() {
        return this.#ecosystems;
    }

    get ec() {
        return this.ecosystems;
    }

    get prefix() {
        return this.#prefix;
    }

    get testbed_connected() {
        return this.#tbSocket && this.#tbSocket.connected;
    }

    addTestCase(ecName, fnName, tcFunction) {
        util.assert(util.isString(ecName), 'expected ecName to be a string');
        util.assert(util.isString(fnName), 'expected fnName to be a string');
        util.assert(util.isFunction(tcFunction), 'expected tcFunction to be a function');

        const tcName = `${ecName}/${fnName}`;
        util.assert(ecName in this.#ecosystems, 'unknown ecosystem: ' + ecName);
        util.assert(!(tcName in this.#testcases), 'not unique testcase: ' + tcName);
        this.#testcases[tcName] = tcFunction;

        if (tcFunction.id) {
            // NOTE the id is generated bases on the testsuite uri, which is not ideal
            // TODO find a consistent and reliable pattern for loading testcases
            util.assert(!(tcFunction.id in this.#testcases), 'not unique testcase id: ' + tcFunction.id);
            this.#testcases[tcFunction.id] = tcFunction;
        }

        if (tcFunction.urn) {
            util.assert(!(tcFunction.urn in this.#testcases), 'not unique testcase urn: ' + tcFunction.urn);
            this.#testcases[tcFunction.urn] = tcFunction;
        }
    }

    addTestCases(ecName, ecTestCases) {
        util.assert(util.isString(ecName), 'expected ecName to be a string');
        util.assert(util.isObject(ecTestCases), 'expected ecTestCases to be an object');
        for (let [fnName, tcFunction] of Object.entries(ecTestCases)) {
            this.addTestCase(ecName, fnName, tcFunction);
        }
    }

    async test(token, data) {
        this.#connected || await this.#connectPromise;

        util.assert(this.#tbSocket, 'expected testbed socket to be defined');
        const
            _testToken_             = {id: token.id, start: token.start, thread: []},
            [testToken, testResult] = await this.#tbEmit('test', _testToken_, data);
        //that = await this.#tbEmit('test', testToken, data);

        if (util.isString(testToken)) {
            util.assert(testToken === token.id, 'expected testToken to be the token id');
        } else if (util.isObject(testToken)) {
            util.assert(testToken.id === token.id, 'expected testToken id to be the token id');
            if (util.isArray(testToken.thread)) token.thread.push(...testToken.thread);
        }

        data.testResult = testResult;
        //data.testResult = {
        //    'timestamp':         util.utcDateTime(),
        //    'operationalResult': testResult
        //};
        data.testToken = testToken;
        return {token, data};
    } // TestsuiteAgent#test

    /**
     * @param {fua.module.testing.TestToken} token
     * @returns {Promise<void>}
     */
    async launchTestCase(token) {
        this.#connected || await this.#connectPromise;

        util.assert(this.#tbSocket, 'expected testbed socket to be defined');
        util.assert(this.#testcases, 'expected testcases to be defined');
        util.assert(this.event, 'expected an event agent to be defined');

        util.assert(token instanceof testing_model.TestToken, 'expected token to be a TestToken');
        util.assert(util.isString(token.data.testCase), 'expected token.data.testCase to be a string');

        const tcFunction = this.#testcases[token.data.testCase];
        util.assert(tcFunction, `testcase "${token.data.testCase}" function not found`);

        try {
            token.connect(this.event);
            await tcFunction(token);
            util.assert(util.isObject(token.data.validation), 'expected token.data.validation to be an object');
            token.assign({validation: {success: true}});
        } catch (err) {
            token.log(err);
            token.assign({validation: {success: false}});
            throw err;
        }
    } // TestsuiteAgent#launchTestCase

    async enforce(token, data) {
        this.#connected || await this.#connectPromise;

        util.assert(this.#tbSocket, 'expected testbed socket to be defined');
        util.assert(this.#testcases, 'expected testcases to be defined');
        const tcFunction = this.#testcases[data.testCase];
        util.assert(tcFunction, 'testcase function not found');
        try {
            const result                = await tcFunction(token, data);
            data.validationResult.value = 'PASS';
            return result;
        } catch (err) {
            data.validationResult.value = 'FAIL';
            throw err;
        }
    } // TestsuiteAgent#enforce

    Token({
              id:     id = `${this.uri}token/${util.uuid.v1()}`,
              start:  start = util.dateTime(),
              thread: thread = []
          }) {
        return {
            id:     id,
            type:   [`${this.#prefix}:Token`],
            start:  start,
            thread: util.toArray(thread)
        };
    } // TestsuiteAgent#Token

    async getQuestionnaire() {
        const questionnaire = this.space.getNode('ids3c-co:IDS_CheckListApproach_Questionnaire');
        if (!questionnaire.isLoaded('@type')) await questionnaire.load();
        const result = questionnaire.dataset();

        for (let criteriaGroup of questionnaire.getNodes('ids3cm:criteriaGroup')) {
            if (!criteriaGroup.isLoaded('@type')) await criteriaGroup.load();
            result.add(criteriaGroup.dataset());

            for (let question of criteriaGroup.getNodes('ids3cm:question')) {
                if (!question.isLoaded('@type')) await question.load();
                result.add(question.dataset());

                for (let questionChoice of question.getNodes('ids3cm:validChoice')) {
                    if (!questionChoice.isLoaded('@type')) await questionChoice.load();
                    result.add(questionChoice.dataset());
                }

                for (let questionChoice of question.getNodes('ids3cm:invalidChoice')) {
                    if (!questionChoice.isLoaded('@type')) await questionChoice.load();
                    result.add(questionChoice.dataset());
                }

                for (let matrixColumn of question.getNodes('ids3cm:matrixColumn')) {
                    if (!matrixColumn.isLoaded('@type')) await matrixColumn.load();
                    result.add(matrixColumn.dataset());
                }
            }
        }

        return result;
    } // getQuestionnaire

} // TestsuiteAgent

module.exports = TestsuiteAgent;
