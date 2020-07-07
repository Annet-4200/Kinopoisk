const uuidv4 = require('uuid/v4');
const _ = require('lodash');

module.exports = class Award {

    static setRealm(realm) {
        this.realm = realm
    }
    static newAward(params) {
        params.id = uuidv4();
        return new Promise(resolve => {
            this.realm.write(() => {
                const result = this.realm.create('Award', params);
                resolve(_.assign({}, result));
            })
        })
    }
    static getAwards() {
        return this.realm.objects('Award');
    }

    static getAwardById(id) {
        return new Promise(resolve => {
            const result = this.realm.objects('Award').filtered(`id = $0`, id);
            resolve(result[0])
        })
    }

    static setValueById(id, params) {
        return new Promise(resolve => {
            this.getAwardById(id).then(award => {
                this.realm.write(() => {
                    _.forEach(params, (value, key) => {
                        award[key] = value;
                    })
                });
                resolve(award);
            }).catch(err => {
                resolve('Award not found')
            })
        })
    };

    static deleteAwardById(id) {
        return new Promise(resolve => {
            this.getAwardById(id).then(award => {
                this.realm.write(() => {
                  this.realm.delete(award);
                  resolve('Award successfully deleted.')
                })
            }).catch(err => {
                resolve('Award not found')
            })
        })
    }
};