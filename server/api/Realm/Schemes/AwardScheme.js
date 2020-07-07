const AwardsScheme = {
    name: 'Award',
    primaryKey: 'id',
    properties: {
        id:          'string',
        name:        'string',
        nomination:  'string',
        actor:       'Actor?',
        producer:    'Producer?',
        film:        'Film'
    }
};

module.exports = AwardsScheme;