const uuidv4 = require('uuid/v4');

const _ = require('lodash');
module.exports = class Film {

    static setRealm(realm) {
        this.realm = realm
    }

    static newFilm(params) {
        params.id = uuidv4();
        return new Promise(resolve => {
            this.realm.write(() => {
                const result = this.realm.create('Film', params);
                resolve(_.assign({},result));
            })
        })
    }

    static getFilms() {
        return this.realm.objects('Film');
    }

    static getFilmById(id) {
        return new Promise(resolve => {
            const result = this.realm.objects('Film').filtered(`id = $0`, id);
            resolve(result[0])
        })
    }

    static setValueById(id, params) {
        return new Promise(resolve => {
            this.getFilmById(id).then(film => {
                this.realm.write(() => {
                    _.forEach(params, (value, key) => {
                        console.log("key in set", key);
                        console.log("value in set", value);
                        film[key] = value;
                    })
                });
                resolve(film);
            }).catch(err => {
                resolve('Film not found and')
            })
        })
    };

    static deleteFilmById(id) {
        return new Promise(resolve => {
            this.getFilmById(id).then(film => {
                this.realm.write(() => {
                  this.realm.delete(film);
                  resolve('Film successfully deleted.')
                })
            }).catch(err => {
                resolve('Film not found')
            })
        })
    }
};