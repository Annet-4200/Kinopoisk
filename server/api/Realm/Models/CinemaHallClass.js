const uuidv4 = require('uuid/v4');
const _ = require('lodash');

module.exports = class CinemaHall {

    static setRealm(realm) {
        this.realm = realm
    }
    static newCinemaHall(params) {
        params.id = uuidv4();
        return new Promise(resolve => {
            this.realm.write(() => {
                const result = this.realm.create('CinemaHall', params);
                resolve(_.assign({}, result));
            })
        })
    }

    static getCinemaHalls() {
        return this.realm.objects('CinemaHall');
    }

    static getCinemaHallById(id) {
        return new Promise(resolve => {
            const result = this.realm.objects('CinemaHall').filtered(`id = $0`, id);
            resolve(result[0])
        })
    }

    static setValueById(id, params) {
        return new Promise(resolve => {
            this.getCinemaHallById(id).then(cinemaHall => {
                this.realm.write(() => {
                    _.forEach(params, (value, key) => {
                        cinemaHall[key] = value;
                    })
                });
                resolve(cinemaHall);
            }).catch(err => {
                resolve('CinemaHall not found')
            })
        })
    };

    static deleteCinemaHallById(id) {
        return new Promise(resolve => {
            this.getCinemaHallById(id).then(cinemaHall => {
                this.realm.write(() => {
                  this.realm.delete(cinemaHall);
                  resolve('CinemaHall successfully deleted.')
                })
            }).catch(err => {
                resolve('CinemaHall not found')
            })
        })
    }
};