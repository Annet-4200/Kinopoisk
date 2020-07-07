import {combineReducers} from 'redux';
import { IndexActionTypes } from '../actionTypes';

const initialState = {
    isFetching: true,
    genres: [],
    films: [],
    filteredFilms: [],
    cinemas: [],
    studios: [],
    actors: [],
    producers:[],
    halls: [],
    user: '',
    token: ''
};

export function app(state = initialState, action) {
    switch (action.type) {
        case IndexActionTypes.FETCH_START:
            return {
                ...state, isFetching: true
            };
        case IndexActionTypes.FETCH_END:
            return {
                ...state, isFetching: false
            };
        case IndexActionTypes.UPDATE_GENRES:
            return {
                ...state, genres: action.genres
            };
        case IndexActionTypes.UPDATE_FILMS:
            return {
                ...state, films: action.films
            };
        case IndexActionTypes.UPDATE_FILTERED_FILMS:
            return {
                ...state, filteredFilms: action.filteredFilms
            };
        case IndexActionTypes.UPDATE_CINEMAS:
            return {
                ...state, cinemas: action.cinemas
            };
        case IndexActionTypes.UPDATE_STUDIOS:
            return {
                ...state, studios: action.studios
            };
        case IndexActionTypes.UPDATE_ACTORS:
            return {
                ...state, actors: action.actors
            };
        case IndexActionTypes.UPDATE_PRODUCERS:
            return {
                ...state, producers: action.producers
            };
        case IndexActionTypes.UPDATE_HALLS:
            return {
                ...state, halls: action.halls
            };
        case IndexActionTypes.UPDATE_TOKEN:
            return {
                ...state, token: action.token, user: action.user
            };
        default:
            return state
    }
}

export default combineReducers({app})
