const
    config     = exports,
    util       = require('./ts.util.js'),
    subprocess = require('@nrd/fua.module.subprocess'),
    args       = subprocess.parseArgv(),
    env        = process.env;

config.id = args.id || env.TESTSUITE_ID || null;

config.connect = {
    type:    'http',
    url:     args.url || env.TESTBED_URL || 'https://tb.nicos-rd.com/testing',
    headers: {
        'Authorization': util.basicAuth(
            args.username || env.TESTSUITE_USERNAME || 'testsuite',
            args.password || env.TESTSUITE_PASSWORD || 'testsuite'
        )
    }
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
