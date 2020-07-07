const uuidv4 = require('uuid/v4');
const _ = require('lodash');
module.exports = class Studio {

    static setRealm(realm) {
        this.realm = realm
    }

    static newStudio(params) {
        params.id = uuidv4();
        return new Promise(resolve => {
            this.realm.write(() => {
                const result = this.realm.create('Studio', params);
                resolve(_.assign({},result));
            })
        })
    }

    static getStudios() {
        return this.realm.objects('Studio');
    }

    static getStudioById(id) {
        return new Promise(resolve => {
            const result = this.realm.objects('Studio').filtered(`id = $0`, id);
            resolve(result[0])
        })
    }

    static setValueById(id, params) {
        return new Promise(resolve => {
            this.getStudioById(id).then(studio => {
                this.realm.write(() => {
                    _.forEach(params, (value, key) => {
                        studio[key] = value;
                    })
                });
                resolve(studio);
            }).catch(err => {
                resolve('Studio not found')
            })
        })
    };

    static deleteStudioById(id) {
        return new Promise(resolve => {
            this.getStudioById(id).then(studio => {
                this.realm.write(() => {
                  this.realm.delete(studio);
                  resolve('Studio successfully deleted.')
                })
            }).catch(err => {
                resolve('Studio not found')
            })
        })
    }
};