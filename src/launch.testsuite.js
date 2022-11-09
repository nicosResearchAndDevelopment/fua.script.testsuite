const
    config         = require('./config/config.testsuite.js'),
    util           = require('./code/util.testsuite.js'),
    BasicAuth      = require('@nrd/fua.agent.amec/BasicAuth'),
    TestsuiteAgent = require('./code/agent.testsuite.js'),
    TestsuiteApp   = require('./app.testsuite.js'),
    TestsuiteLab   = require('./lab.testsuite.js'),
    initializeNet  = require('../ec/net/src/initialize.net.js'),
    initializeIDS  = require('../ec/ids/src/initialize.ids.js');

(async function LaunchTestsuite() {

    /* 1. Construct a server agent for your setup: */

    util.logText('creating testsuite agent');

    const testsuiteAgent = await TestsuiteAgent.create({
        schema:   (config.server.url.match(/^\w+(?=:\/\/)/) || ['http'])[0],
        hostname: (config.server.url.match(/^\w+:\/\/([^/#:]+)(?=[/#:]|$)/) || [null, 'localhost'])[1],
        port:     config.server.port,
        context:  config.space.context,
        store:    config.space.datastore,
        // space:     config.space,
        amec:     true,
        server:   config.server.options,
        app:      true,
        event:    true,
        io:       true,
        domain:   true,
        sessions: {
            resave:            false,
            saveUninitialized: false,
            secret:            config.server.id
        },
        prefix:   'ts',
        testbed:  config.testbed
    });

    /* 2. Use additional methods to configure the setup: */

    testsuiteAgent.amec.registerMechanism(BasicAuth.prefLabel, BasicAuth({
        domain: testsuiteAgent.domain
    }));

    /* 3. Wait for all ecosystems to initialize: */

    util.logText('initializing ecosystems');

    await Promise.all([
        initializeNet({'agent': testsuiteAgent}),
        initializeIDS({'agent': testsuiteAgent})
    ]);

    util.logText('ecosystems initialized (' + Object.keys(testsuiteAgent.ecosystems).join(', ') + ')');

    /* 4. Launch the main app: */

    util.logText('starting application');

    await TestsuiteApp({
        'config': config,
        'agent':  testsuiteAgent
    });

    /* 5. Launch the testing lab: */

    await TestsuiteLab({
        'config': config,
        'agent':  testsuiteAgent
    });

    util.logSuccess('launch complete');

})().catch((err) => {

    /* ERR. Log any error during launch and exit the application: */

    util.logError(err);
    debugger;
    process.exit(1);

}); // LaunchTestsuite
