const
    util           = require('../../../src/code/util.testsuite.js'),
    TestsuiteAgent = require('../../../src/code/agent.testsuite.js'),
    EcosystemNet   = require('./ts.ec.net.js'),
    methodsFactory = require('./ts.ec.net.methods-factory.js'),
    EC_NAME        = 'net';

module.exports = async function initializeNet(
    {
        'agent': agent
    } = {}
) {
    util.assert(agent instanceof TestsuiteAgent, 'expected agent to be a TestsuiteAgent');
    util.assert(!agent.ecosystems[EC_NAME], 'expected ecosystem ' + EC_NAME + ' not to be initialized already');

    const ec_net = agent.ecosystems[EC_NAME] = new EcosystemNet();
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
