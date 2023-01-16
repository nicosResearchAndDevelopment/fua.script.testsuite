const
    util           = require('../../../src/code/util.testsuite.js'),
    TestsuiteAgent = require('../../../src/code/agent.testsuite.js'),
    EcosystemIDS   = require('./ts.ec.ids.js'),
    methodsFactory = require('./ts.ec.ids.methods-factory.js'),
    EC_NAME        = 'ids';

module.exports = async function initializeIDS(
    {
        'agent': agent
    } = {}
) {
    util.assert(agent instanceof TestsuiteAgent, 'expected agent to be a TestsuiteAgent');
    util.assert(!agent.ecosystems[EC_NAME], 'expected ecosystem ' + EC_NAME + ' not to be initialized already');

    const ec_net = agent.ecosystems[EC_NAME] = new EcosystemIDS();
    util.lockProp(agent.ecosystems, EC_NAME);

    agent.addTestCases(EC_NAME, methodsFactory({
        root_uri:    'https://testsuite.nicos-rd.com/',
        agent:       agent,
        console_log: false
    }));

    // TODO connect the ecosystem

    ec_net.on('error', (error) => {
        util.logError(error);
        debugger;
    });

    return ec_net;
}; // module.exports = async function initializeNet
