import crypto from "crypto";
import moment from "moment";
const _ = require('lodash');
const uuidv4 = require('uuid/v4');
module.exports = class User {

    static setRealm(realm) {
        this.realm = realm
    }

    static newUser(params) {
        params.id = uuidv4();
        params.password = this.encryptPassword(params.password, params.id);
        params.token = uuidv4();
        params.expiration = `${moment().add(1, 'h').format('x')}`;
        return new Promise(resolve => {
            this.realm.write(() => {
                const result = this.realm.create('User', params);
                resolve(result);
            })
        })
    }

    static getUsers() {
        return this.realm.objects('User');
    }

    static getUserById(id) {
        return new Promise(resolve => {
            const result = this.realm.objects('User').filtered(`id = $0`, id);
            resolve(result[0])
        })
    }

    static setValueById(id, params) {
        return new Promise(resolve => {
            this.getUserById(id).then(user => {
                this.realm.write(() => {
                    _.forEach(params, (value, key) => {
                        user[key] = value;
                    })
                });
                resolve(user);
            }).catch(err => {
                resolve('User not found')
            })
        })
    };

    static deleteUserById(id) {
        return new Promise(resolve => {
            this.getUserById(id).then(user => {
                this.realm.write(() => {
                  this.realm.delete(user);
                  resolve('User successfully deleted.')
                })
            }).catch(err => {
                resolve('User not found')
            })
        })
    }

    static authUser(params) {
        if (Array.from(this.getUsers().filtered('login = $0', params.login)).length > 0) {
            return new Promise(resolve => {
                let user = this.getUsers().filtered('login = $0', params.login)[0];
                if (user && user.password === this.encryptPassword(params.password, user.id)) {
                    this.realm.write(() => {
                        user.token = uuidv4();
                        user.expiration = `${moment().add(1, 'h').format('x')}`;
                        console.log(user.name, 'authorized');
                        resolve(user)
                    })
                } else {
                    resolve({error: 'User not found or password wrong'})
                }
            })
        }
    }

    static encryptPassword(password, id) {
        return crypto.createHmac('sha1', id).update(password).digest('hex');
    };

    static checkPassword(password, id, hash) {
        return this.encryptPassword(password, id) === hash
    };

};