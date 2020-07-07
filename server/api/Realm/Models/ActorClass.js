const uuidv4 = require('uuid/v4');
const _ = require('lodash');
module.exports = class Actor {

    static setRealm(realm) {
        this.realm = realm
    }

    static newActor(params) {
        params.id = uuidv4();
        //console.log(params);
        return new Promise(resolve => {
            this.realm.write(() => {
                const result = this.realm.create('Actor', params);
                resolve(_.assign({}, result));
            })
        })
    }

    static getActors() {
        return this.realm.objects('Actor');
    }

    static getActorById(id) {
        return new Promise(resolve => {
            const result = this.realm.objects('Actor').filtered(`id = $0`, id);
            resolve(result[0])
        })
    }


    static setValueById(id, params) {
        return new Promise(resolve => {
            this.getActorById(id).then(actor => {
                this.realm.write(() => {
                    _.forEach(params, (value, key) => {
                        actor[key] = value;
                    })
                });
                resolve(actor);
            }).catch(err => {
                resolve('Actor not found')
            })
        })
    };

    static deleteActorById(id) {
        return new Promise(resolve => {
            this.getActorById(id).then(actor => {
                this.realm.write(() => {
                  this.realm.delete(actor);
                  resolve('Actor successfully deleted.')
                })
            }).catch(err => {
                resolve('Actor not found')
            })
        })
    }
};