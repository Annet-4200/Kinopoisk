import * as actionTypes from '../actionTypes/indexActionTypes';

export const fetch_start = () => {
    return {
        type: actionTypes.FETCH_START,
        isFetching: true
    }
};
export const fetch_end = () => {
    return {
        type: actionTypes.FETCH_END,
        isFetching: false
    }
};
export const update_genres = (genres) => {
    return {
        type: actionTypes.UPDATE_GENRES,
        genres: genres
    }
};
export const update_films = (films) => {
    return {
        type: actionTypes.UPDATE_FILMS,
        films: films
    }
};
export const update_filtered_films = (filteredFilms) => {
    return {
        type: actionTypes.UPDATE_FILTERED_FILMS,
        filteredFilms: filteredFilms
    }
};
export const get_filtered_films = (params) => {
    return {
        type: actionTypes.GET_FILTERED_FILMS,
        params: params
    }
};
export const get_films = () => {
    return {
        type: actionTypes.GET_FILMS,
    }
};
export const get_genres = () => {
    return {
        type: actionTypes.GET_GENRES,
    }
};
export const get_cinemas = () => {
    return {
        type: actionTypes.GET_CINEMAS,
    }
};
export const update_cinemas = (cinemas) => {
    return {
        type: actionTypes.UPDATE_CINEMAS,
        cinemas: cinemas
    }
};

export const get_studios = () => {
    return {
        type: actionTypes.GET_STUDIOS,
    }
};
export const update_studios = (studios) => {
    return {
        type: actionTypes.UPDATE_STUDIOS,
        studios: studios
    }
};
export const get_actors = () => {
    return {
        type: actionTypes.GET_ACTORS,
    }
};

export const update_actors = (actors) => {
    return {
        type: actionTypes.UPDATE_ACTORS,
        actors: actors
    }
};
export const get_producers = () => {
    return {
        type: actionTypes.GET_PRODUCERS,
    }
};

export const update_producers = (producers) => {
    return {
        type: actionTypes.UPDATE_PRODUCERS,
        producers: producers
    }
};
export const get_halls = () => {
    return {
        type: actionTypes.GET_HALLS,
    }
};

export const update_halls = (halls) => {
    return {
        type: actionTypes.UPDATE_HALLS,
        halls: halls
    }
};

export const update_token = (token, id) => {
    return {
        type: actionTypes.UPDATE_TOKEN,
        token: token,
        user: id
    }
};