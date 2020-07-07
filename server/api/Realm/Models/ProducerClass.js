const uuidv4 = require('uuid/v4');
const _ = require('lodash');

module.exports = class Producer {

    static setRealm(realm) {
        this.realm = realm
    }

    static newProducer(params) {
        params.id = uuidv4();
        return new Promise(resolve => {
            this.realm.write(() => {
                const result = this.realm.create('Producer', params);
                resolve(_.assign({},result));
            })
        })
    }

    static getProducers() {
        return this.realm.objects('Producer');
    }

    static getProducerById(id) {
        return new Promise(resolve => {
            const result = this.realm.objects('Producer').filtered(`id = $0`, id);
            resolve(result[0])
        })
    }

    static setValueById(id, params) {
        return new Promise(resolve => {
            this.getProducerById(id).then(producer => {
                this.realm.write(() => {
                    _.forEach(params, (value, key) => {
                        producer[key] = value;
                    })
                });
                resolve(producer);
            }).catch(err => {
                resolve('Producer not found')
            })
        })
    };

    static deleteProducerById(id) {
        return new Promise(resolve => {
            this.getProducerById(id).then(producer => {
                this.realm.write(() => {
                  this.realm.delete(producer);
                  resolve('Producer successfully deleted.')
                })
            }).catch(err => {
                resolve('Producer not found')
            })
        })
    }
};