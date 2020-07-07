const SessionScheme = {
    name: 'Session',
    primaryKey: 'id',
    properties: {
        id:        'string',
        film:      'Film',
        date:      'string',
        time:      'string',
        cinema:    'Cinema',
        price:     'int',
        cinemaHall:'CinemaHall'
    }
};
module.exports = SessionScheme;