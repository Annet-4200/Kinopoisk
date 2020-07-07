import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { get, post, update, remove } from '../fetch';
import {fetch_end, fetch_start, update_films, update_filtered_films} from "../actions/indexActions";

export function* getFilms() {
    yield put(fetch_start());
    const films = yield call(() => {return post(`/films`)});
    if (films.length > 0) {
        console.log("FILMS:", films);
        yield put(update_films(films))
    } else {
        console.log('Film SAGA: ', 'not works')
    }
    yield put(fetch_end());
    return films;
}

export function* getFilteredFilms(action) {
    console.log("filtered params-action: ", action);
    yield put(fetch_start());
    const films = yield call(() => {return post(`/films`, action.params)});
    console.log("FILTERED FILMS:", films);
    yield put(update_filtered_films(films));
    yield put(fetch_end());
    return films;
}

