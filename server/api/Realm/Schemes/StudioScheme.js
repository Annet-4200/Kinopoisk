const StudioScheme = {
    name: 'Studio',
    primaryKey: 'id',
    properties: {
        id:            'string',
        name:          'string',
        yearFoundation:'string',
        country:       'string',
        image:         'string?',
        films:         {type: 'linkingObjects', objectType: 'Film', property: 'studio'}
    }
};

module.exports = StudioScheme;