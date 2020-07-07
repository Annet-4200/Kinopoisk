const UserScheme = {
    name: 'User',
    primaryKey: 'id',
    properties: {
        id:            'string',
        name:          {type: 'string', default: 'anonymous'},
        login:         'string',
        password:      'string',
        token:         'string',
        expiration:    'string',
        image:         'string?',
        favouriteFilms:'Film[]',
        filmsToWatch:  'Film[]',
        watchedFilms:  'Film[]',
        nickname:      'string?',
        birthDate:     'string?',
        email:         'string?',
        gender:        'string?',
    }
};


module.exports = UserScheme;