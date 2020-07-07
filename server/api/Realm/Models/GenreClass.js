const uuidv4 = require('uuid/v4');
const _ = require('lodash');
module.exports = class Genre {

    static setRealm(realm) {
        this.realm = realm
    }

    static newGenre(params) {
        params.id = uuidv4();
        return new Promise(resolve => {
            this.realm.write(() => {
                const result = this.realm.create('Genre', params);
                resolve(_.assign({},result));
            })
        })
    }

    static getGenres() {
        return this.realm.objects('Genre');
    }

    static getGenreById(id) {
        return new Promise(resolve => {
            const result = this.realm.objects('Genre').filtered(`id = $0`, id);
            resolve(result[0])
        })
    }

    static setValueById(id, params) {
        return new Promise(resolve => {
            this.getGenreById(id).then(genre => {
                this.realm.write(() => {
                    _.forEach(params, (value, key) => {
                        genre[key] = value;
                    })
                });
                resolve(genre);
            }).catch(err => {
                resolve('Genre not found')
            })
        })
    };

    static deleteGenreById(id) {
        return new Promise(resolve => {
            this.getGenreById(id).then(genre => {
                this.realm.write(() => {
                  this.realm.delete(genre);
                  resolve('Genre successfully deleted.')
                })
            }).catch(err => {
                resolve('Genre not found')
            })
        })
    }
};