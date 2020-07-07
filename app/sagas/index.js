import {fork, take, takeLatest} from 'redux-saga/effects'
import {getGenres} from './GenreSaga'
import {getFilms} from './FilmSaga'
import {getFilteredFilms} from './FilmSaga'
import {IndexActionTypes} from "../actionTypes";
import {getCinemas} from "./CinemaSaga";
import {getActors} from "./ActorSaga";
import {getStudios} from "./StudioSaga";
import {getProducers} from "./ProducerSaga";
import {getHalls} from "./HallSaga";

export default function* rootSaga() {
    yield takeLatest(IndexActionTypes.GET_GENRES, getGenres);
    yield takeLatest(IndexActionTypes.GET_FILMS, getFilms);
    yield takeLatest(IndexActionTypes.GET_FILTERED_FILMS, getFilteredFilms);
    yield takeLatest(IndexActionTypes.GET_CINEMAS, getCinemas);
    yield takeLatest(IndexActionTypes.GET_ACTORS, getActors);
    yield takeLatest(IndexActionTypes.GET_STUDIOS, getStudios);
    yield takeLatest(IndexActionTypes.GET_PRODUCERS, getProducers);
    yield takeLatest(IndexActionTypes.GET_HALLS, getHalls);
}
