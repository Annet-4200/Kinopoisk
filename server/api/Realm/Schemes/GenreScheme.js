const GenreScheme = {
    name: 'Genre',
    primaryKey: 'id',
    properties: {
        id:       'string',
        name:     'string',
        ageLimit: 'int?'
    }
};

module.exports = GenreScheme;