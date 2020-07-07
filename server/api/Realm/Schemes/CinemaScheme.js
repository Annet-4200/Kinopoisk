const CinemaScheme = {
    name: 'Cinema',
    primaryKey: 'id',
    properties: {
        id:        'string',
        name:      'string',
        city:      'string',
        address:   'string',
        shownFilms:'Film[]',
        session:   'Session[]'
    }
};
module.exports = CinemaScheme;