import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { get, post, update, remove } from '../fetch';
import {fetch_end, fetch_start, update_halls} from "../actions/indexActions";

export function* getHalls() {
    yield put(fetch_start());
    const halls = yield call(() => {return get(`/cinemaHalls`)});
    if (halls.length > 0) {
        console.log("Cinema halls:", halls);
        yield put(update_halls(halls))
    } else {
        console.log('Cinema halls SAGA: ', 'not works')
    }
    yield put(fetch_end());
    //return halls;
}


