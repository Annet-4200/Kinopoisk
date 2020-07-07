import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { get, post, update, remove } from '../fetch';
import {fetch_end, fetch_start, update_actors} from "../actions/indexActions";

export function* getActors() {
    yield put(fetch_start());
    const actors = yield call(() => {return get(`/actors`)});
    if (actors.length > 0) {
        console.log("Actors:", actors);
        yield put(update_actors(actors))
    } else {
        console.log('Actor SAGA: ', 'not works')
    }
    yield put(fetch_end());
    //return actors;
}


