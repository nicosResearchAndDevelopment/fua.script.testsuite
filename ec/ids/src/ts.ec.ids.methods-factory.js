const
    CriteriaFactory = require('./ts.ec.ids.criteria-factory.js'),
    methodFactories = Object.freeze({
        INF_01:                        require('./tc/INF_01.js'),
        SUT_provides_self_description: require('./tc/SUT_provides_self_description.js'),
        rc_refreshDAT:                 require('./rc/rc_refreshDAT.js')
    });

function createExternalMethod({methodFactory, ...factoryArgs}) {
    const internalMethod = methodFactory(factoryArgs);

    async function externalMethod(token, data, session) {
        let result = await internalMethod(token, data);
        if (session) await session.write({
            ...result,
            testcase: internalMethod.name
        });
        if (result.error) throw result.error;
        return result;
    } // externalMethod

    Object.defineProperties(externalMethod, {
        name: {value: internalMethod.name},
        id:   {value: internalMethod.id},
        urn:  {value: internalMethod.urn}
    });

    return externalMethod;
} // createExternalMethod

module.exports = function MethodsFactory(
    {
        root_uri = '',
        root_urn = 'urn:ts:',
        ...factoryArgs
    }
) {
    const
        tc_root_uri = root_uri + 'ec/net/tc/',
        tc_root_urn = root_urn + 'ec:net:tc:',
        criterion   = CriteriaFactory({
            root_uri: tc_root_uri + 'criterion/',
            root_urn: tc_root_urn + 'criterion:'
        }),
        methods     = Object.create(null);

    Object.defineProperties(methods, {
        id: {value: tc_root_uri}
    });

    methods.SUT_provides_self_description = createExternalMethod({
        methodFactory: methodFactories.SUT_provides_self_description,
        tc_root_uri, tc_root_urn, criterion, ...factoryArgs
    });

    methods.rc_refreshDAT = createExternalMethod({
        methodFactory: methodFactories.rc_refreshDAT,
        tc_root_uri, tc_root_urn, criterion, ...factoryArgs
    });

    return Object.freeze(methods);
}; // module.exports = MethodsFactory
