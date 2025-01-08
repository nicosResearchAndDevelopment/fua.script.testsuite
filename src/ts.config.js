const
    config     = exports,
    util       = require('./ts.util.js'),
    https      = require('https'),
    subprocess = require('@fua/module.subprocess'),
    args       = subprocess.parseArgv(),
    env        = process.env;

config.id = args.id || env.TESTSUITE_ID || null;

config.connect = {
    type:    'http',
    url:     args.url || env.TESTING_URL || 'https://tb.nicos-rd.com/testing',
    headers: {
        'Authorization': util.basicAuth(
            args.username || env.TESTSUITE_USERNAME || 'testsuite',
            args.password || env.TESTSUITE_PASSWORD || 'testsuite'
        )
    },
    agent:   new https.Agent({
        rejectUnauthorized: !(args.insecure || env.TESTING_INSECURE)
    })
};

config.session = {
    file:       [
        __dirname, '../data',
        args.session || env.TEST_SESSION || 'default',
        'session.json'
    ],
    properties: {
        date:     util.localDate(),
        operator: args.operator || env.TESTING_OPERATOR || 'default'
    }
};
