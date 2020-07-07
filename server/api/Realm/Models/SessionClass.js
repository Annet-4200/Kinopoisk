const uuidv4 = require('uuid/v4');
const _ = require('lodash');

module.exports = class Session {

    static setRealm(realm) {
        this.realm = realm
    }

    static newSession(params) {
        params.id = uuidv4();
        return new Promise(resolve => {
            this.realm.write(() => {
                const result = this.realm.create('Session', params);
                resolve(_.assign({}, result));
            })
        })
    }

    static getSessions() {
        return this.realm.objects('Session');
    }

    static getSessionById(id) {
        return new Promise(resolve => {
            const result = this.realm.objects('Session').filtered(`id = $0`, id);
            resolve(result[0])
        })
    }

    static setValueById(id, params) {
        return new Promise(resolve => {
            this.getSessionById(id).then(session => {
                this.realm.write(() => {
                    _.forEach(params, (value, key) => {
                        session[key] = value;
                    })
                });
                resolve(session);
            }).catch(err => {
                resolve('Session not found')
            })
        })
    };

    static deleteSessionById(id) {
        return new Promise(resolve => {
            this.getSessionById(id).then(session => {
                this.realm.write(() => {
                  this.realm.delete(session);
                  resolve('Session successfully deleted.')
                })
            }).catch(err => {
                resolve('Session not found')
            })
        })
    }
};