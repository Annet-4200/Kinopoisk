import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { get, post, update, remove } from '../fetch';
import {fetch_end, fetch_start, update_producers} from "../actions/indexActions";

export function* getProducers() {
    yield put(fetch_start());
    const producers = yield call(() => {return get(`/producers`)});
    if (producers.length > 0) {
        console.log("Producer:", producers);
        yield put(update_producers(producers))
    } else {
        console.log('Producer SAGA: ', 'not works')
    }
    yield put(fetch_end());
    //return producers;
}


