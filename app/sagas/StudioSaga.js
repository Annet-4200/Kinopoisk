import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { get, post, update, remove } from '../fetch';
import {fetch_end, fetch_start, update_studios} from "../actions/indexActions";

export function* getStudios() {
    yield put(fetch_start());
    const studios = yield call(() => {return get(`/studios`)});
    if (studios.length > 0) {
        console.log("Studios:", studios);
        yield put(update_studios(studios))
    } else {
        console.log('Studio SAGA: ', 'not works')
    }
    yield put(fetch_end());
    //return studios;
}


