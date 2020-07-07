const ActorScheme = {
    name: 'Actor',
    primaryKey: 'id',
    properties: {
        id:        'string',
        name:      'string',
        birthDate: 'string',
        country:   'string',
        genre:     'Genre[]',
        films:     {type: 'linkingObjects', objectType: 'Film', property: 'actors'},
        magnumOpus:'Film?',
        image:     'string?',
        award:     {type: 'linkingObjects', objectType: 'Award', property: 'actor'}
    }
};

module.exports = ActorScheme;