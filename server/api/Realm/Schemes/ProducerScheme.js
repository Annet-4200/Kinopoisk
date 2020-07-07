const ProducerScheme = {
    name: 'Producer',
    primaryKey: 'id',
    properties: {
        id:            'string',
        name:          'string',
        birthDate:     'string',
        country:       'string',
        genre:         'Genre[]',
        image:         'string?',
        numberOfFilms: 'int'
    }
};

module.exports = ProducerScheme;