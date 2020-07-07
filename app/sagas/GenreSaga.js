import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { get, post, update, remove } from '../fetch';

import {fetch_end, fetch_start, update_genres} from "../actions/indexActions";

export function* getGenres() {
    yield put(fetch_start());
    const genres = yield call(() => {return get(`/genres`)});
    if (genres.length > 0) {
        console.log("GENRES:", genres);
        yield put(update_genres(genres))
    } else {
        console.log(' Genre SAGA: ', 'not works')
    }
    yield put(fetch_end())
}

