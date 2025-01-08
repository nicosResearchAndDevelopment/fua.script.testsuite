const
    {describe, test, before, after} = require('mocha'),
    expect                          = require('expect'),
    config                          = require('../src/config/config.testsuite.js'),
    TestsuiteAgent                  = require('../src/code/agent.testsuite.js'),
    {Space}                         = require('@fua/module.space');

describe('ts.space', function () {

    this.timeout('10s');

    let space = null;

    before('initialize space', async function () {

        const agent = await TestsuiteAgent.create({
            context: config.space.context,
            store:   config.space.datastore,
            prefix:  'ts',
            testbed: config.testbed
        });

        space = agent.space;
        expect(space).toBeInstanceOf(Space);

    }); // before('initialize space')

    test('develop', async function () {

        const ts_node = await space.getNode('https://testsuite.nicos-rd.com/').load();
        console.log(ts_node.toJSON());

    }); // test('develop')

}); // describe('ts.space')
