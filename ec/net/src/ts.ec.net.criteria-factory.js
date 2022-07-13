const
    util = require('./ts.ec.net.util.js');

function createCriterionMethod({root_uri, ...defaultArgs}) {
    return function criterionMethod({id, ...criterionArgs}) {
        return {
            ...defaultArgs,
            id: id || root_uri + util.uuid.v1(),
            ...criterionArgs
        };
    }; // criterionMethod
} // createCriterionMethod

module.exports = function CriteriaFactory(
    {
        root_uri: root_uri,
        root_urn: root_urn = "urn:ts:ec:net:criterion:"
    }
) {
    const
        crit_root_uri = root_uri + 'result/',
        crit_root_urn = root_urn + 'result:',
        criteria      = {};

    Object.defineProperties(criteria, {
        id: {value: crit_root_uri}
    });

    criteria.IS_ALIVE = createCriterionMethod({
        root_uri: crit_root_uri
    });

    criteria.PORTS_CORRECT = createCriterionMethod({
        root_uri: crit_root_uri
    });

    return Object.freeze(criteria);
}; // module.exports = CriteriaFactory
