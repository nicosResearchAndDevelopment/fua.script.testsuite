const
    util   = require('./ts.ec.net.util.js'),
    ec_net = require('./ts.ec.net.js');

module.exports = async function initializeNet(agent) {
    // TODO add to testsuite agent

    ec_net.on('error', (error) => {
        util.logError(error);
        debugger;
    });
};
