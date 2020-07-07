const uuidv4 = require('uuid/v4');
module.exports = class Cinema {

    static setRealm(realm) {
        this.realm = realm
    }

    static newCinema(params) {
        params.id = uuidv4();
        return new Promise(resolve => {
            this.realm.write(() => {
                const result = this.realm.create('Cinema', params);
                resolve(result);
            })
        })
    }

    static getCinemas() {
        return this.realm.objects('Cinema');
    }

    static getCinemaById(id) {
        return new Promise(resolve => {
            const result = this.realm.objects('Cinema').filtered(`id = $0`, id);
            resolve(result[0])
        })
    }

    static setValueById(id, params) {
        return new Promise(resolve => {
            this.getCinemaById(id).then(cinema => {
                this.realm.write(() => {
                    _.forEach(params, (value, key) => {
                        cinema[key] = value;
                    })
                });
                resolve(cinema);
            }).catch(err => {
                resolve('Cinema not found')
            })
        })
    };

    static deleteCinemaById(id) {
        return new Promise(resolve => {
            this.getCinemaById(id).then(cinema => {
                this.realm.write(() => {
                  this.realm.delete(cinema);
                  resolve('Cinema successfully deleted.')
                })
            }).catch(err => {
                resolve('Cinema not found')
            })
        })
    }
};