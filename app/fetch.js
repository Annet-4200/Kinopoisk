import axios from 'axios'
import appConfig from '../config';
import { store } from '../app'

const requestUrl = `${appConfig.host}`;
const requestPort = `${+appConfig.port+1}`;

let config = {
    //FOR PRODUCTION (https) and delete PORT and /api
    baseURL: `http://${requestUrl}:${requestPort}/api`,
    transformRequest: [
      (data) => {
        //console.log(store.getState().app.token);
        data = data ? data : {};
        data.token = store.getState().app.token;
        let ret = '';
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret;
      }
    ],
    transformResponse: [
        (data) => {
            return data
        }
    ],
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    timeout: 10000,
    responseType: 'json'
};

axios.interceptors.response.use((res) => {
    return res.data;
});

export const get = (url) => {
    return axios.get(url, Object.assign({url: url}, config))
};

export const post = (url, data) => {
    return axios.post(url, data, Object.assign({url: url}, config))
};

export const update = (url, data) => {
    return axios.put(url, data, Object.assign({url: url}, config))
};
export const remove = (url) => {
    return axios.delete(url, Object.assign({url: url}, config))
};
