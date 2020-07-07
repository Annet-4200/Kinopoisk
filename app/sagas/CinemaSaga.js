import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { get, post, update, remove } from '../fetch';
import {fetch_end, fetch_start, update_cinemas} from "../actions/indexActions";

export function* getCinemas() {
    yield put(fetch_start());
    const cinemas = yield call(() => {return get(`/cinemas`)});
    if (cinemas.length > 0) {
        console.log("Cinemas:", cinemas);
        yield put(update_cinemas(cinemas))
    } else {
        console.log('Cinema SAGA: ', 'not works')
    }
    yield put(fetch_end());
    //return cinemas;
}


