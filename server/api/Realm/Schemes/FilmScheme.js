const FilmScheme = {
    name: 'Film',
    primaryKey: 'id',
    properties: {
        id:          'string',
        name:        'string',
        year:        'string',
        country:     'string?',
        genre:       'Genre[]',
        duration:    'int?',
        studio:      'Studio?',
        rating:      'double',
        ratesAmount: 'int',
        budget:      'int?',
        producer:    'Producer[]',
        actors:      'Actor[]',
        description: 'string',
        image:       'string?',
        award:       {type: 'linkingObjects', objectType: 'Award', property: 'film'},
        cinemas:     {type: 'linkingObjects', objectType: 'Cinema', property: 'shownFilms'}
    }
};

module.exports = FilmScheme;