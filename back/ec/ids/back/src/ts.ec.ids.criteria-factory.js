const
    util = require('./ts.ec.ids.util.js');

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
        root_uri = '',
        root_urn = 'urn:ts:ec:ids:criterion:'
    }
) {
    const
        crit_root_uri = root_uri + 'result/',
        crit_root_urn = root_urn + 'result:',
        criteria      = Object.create(null);

    Object.defineProperties(criteria, {
        id: {value: crit_root_uri}
    });

    criteria.INF_01 = createCriterionMethod({
        root_uri:  crit_root_uri,
        criterion: 'https://w3id.org/ids3c-component/INF_01'
    });

    criteria.INF_02 = createCriterionMethod({
        root_uri:  crit_root_uri,
        criterion: 'https://w3id.org/ids3c-component/INF_02'
    });

    criteria.INF_03 = createCriterionMethod({
        root_uri:  crit_root_uri,
        criterion: 'https://w3id.org/ids3c-component/INF_03'
    });

    criteria.INF_04 = createCriterionMethod({
        root_uri:  crit_root_uri,
        criterion: 'https://w3id.org/ids3c-component/INF_04'
    });

    criteria.INF_05 = createCriterionMethod({
        root_uri:  crit_root_uri,
        criterion: 'https://w3id.org/ids3c-component/INF_05'
    });

    return Object.freeze(criteria);
}; // module.exports = CriteriaFactory
