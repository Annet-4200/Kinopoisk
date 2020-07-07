const CinemaHallScheme = {
    name: 'CinemaHall',
    primaryKey: 'id',
    properties: {
        id:       'string',
        number:   'int',
        cinema:   'Cinema',
        spots:    'int',
        sessions: {type: 'linkingObjects', objectType: 'Session', property: 'cinemaHall'}
    }
};
module.exports = CinemaHallScheme;