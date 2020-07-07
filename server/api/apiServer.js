import Express from 'express';
import config from '../../config';
import bodyParser from 'body-parser';
import https from 'https';
import http from 'http';
import _ from 'lodash'
import moment from "moment";
import cors from 'cors';
const Realm = require('realm');
const axios = require('axios');
const uuidv4 = require('uuid/v4');
const formidable = require('formidable');
const createError = require('http-errors');
const ActorScheme = require('./Realm/Schemes/ActorScheme');
const AwardScheme = require('./Realm/Schemes/AwardScheme');
const CinemaHallScheme = require('./Realm/Schemes/CinemaHallScheme');
const CinemaScheme = require('./Realm/Schemes/CinemaScheme');
const FilmScheme = require('./Realm/Schemes/FilmScheme');
const GenreScheme = require('./Realm/Schemes/GenreScheme');
const ProducerScheme = require('./Realm/Schemes/ProducerScheme');
const SessionScheme = require('./Realm/Schemes/SessionScheme');
const StudioScheme = require('./Realm/Schemes/StudioScheme');
const UserScheme = require('./Realm/Schemes/UserScheme');
const ActorClass = require('./Realm/Models/ActorClass');
const AwardClass = require('./Realm/Models/AwardClass');
const CinemaClass = require('./Realm/Models/CinemaClass');
const CinemaHallClass = require('./Realm/Models/CinemaHallClass');
const FilmClass = require('./Realm/Models/FilmClass');
const GenreClass = require('./Realm/Models/GenreClass');
const ProducerClass = require('./Realm/Models/ProducerClass');
const SessionClass = require('./Realm/Models/SessionClass');
const StudioClass = require('./Realm/Models/StudioClass');
const UserClass = require('./Realm/Models/UserClass');
const checkAuth = require('./middleware/checkAuth');
const multer  = require('multer');
let nodemailer = require('nodemailer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'server/api/uploads/')
    },
    filename: function (req, file, cb) {
        let split = file.originalname.split('.');
        cb(null, uuidv4() + '.' + split[split.length - 1])
    }
});
let upload = multer({ storage: storage });

let dodge = (realmObject, exceptions) => {
    let jsObject = {};
    _.keys(realmObject).map((key) => {
        if (exceptions.includes(key)) {
            return
        }
        return jsObject[key] = realmObject[key]
    });
    return jsObject
};

// FOR PRODUCTION REMOVE + 1
const port = +config.port + 1;

const app = new Express();

app.set("view options", {layout: false});
app.use(Express.static(__dirname));
console.log(__dirname);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({ type: 'application/*+json' }));

app.use(require('express-session')({ resave: false, saveUninitialized: false, secret: 'a secret' }));

let server = http.createServer(app);
let io = require('socket.io').listen(server);


io.on('connection', socket => {
    console.log('connected');
    socket.on('disconnect', () => { /* … */ });
});

app.use(cors());

app.use(Express.json());

app.use('/', require('./routes/genre.router'));
app.use('/', require('./routes/user.router'));

let realm = null;
let createConnection = async () => {
    realm = await Realm.open({schema: [ActorScheme, AwardScheme, CinemaHallScheme,
            CinemaScheme, FilmScheme, GenreScheme, ProducerScheme, SessionScheme, StudioScheme, UserScheme], deleteRealmIfMigrationNeeded: true});
    if(realm){
        ActorClass.setRealm(realm);
        AwardClass.setRealm(realm);
        CinemaClass.setRealm(realm);
        CinemaHallClass.setRealm(realm);
        FilmClass.setRealm(realm);
        GenreClass.setRealm(realm);
        ProducerClass.setRealm(realm);
        SessionClass.setRealm(realm);
        StudioClass.setRealm(realm);
        UserClass.setRealm(realm);
    }
    /*realm.write(() => {
    let allcinema = realm.objects('CinemaHall');
    realm.delete(allcinema);
    });*/
};

createConnection();


// FOR PRODUCTION UNCOMMENT
/*
app.get('/', function(req, res){
    res.render('/build/index.html');
});

*/

// FOR PRODUCTION COMMENT
/*
app.get('/', function(req, res){
    res.redirect(`http://${config.host}:${+config.port}`);
});
*/

/////////////////Actor
app.get("/api/actors", function(req, res){  //чтение всех актеров
    let result = ActorClass.getActors();
    let jsResult = [];
    _.each(result, (actor) => {
        let jsActor = dodge(actor, ['magnumOpus', 'films', 'award']);
        jsResult.push(jsActor);
    });
    res.status(200).send(jsResult);

});

app.post("/api/actor", async function(req, res){  //чтение актера
    const { id } = req.body;
    let actor = await ActorClass.getActorById(id);
    let jsactor = dodge(actor, ['magnumOpus', 'films', 'award']);
    jsactor.magnumOpus = dodge(actor.magnumOpus, ['studio', 'producer', 'actors','award', 'cinemas']);
    if (actor.magnumOpus && actor.magnumOpus.genre) {
        jsactor.magnumOpus.genre = Array.from(actor.magnumOpus.genre);
    }
    jsactor.films = [];
    _.each(actor.films, (film => {
        jsactor.films = [...jsactor.films, dodge(film, ['studio', 'producer', 'actors','award', 'cinemas'])];
    }));
    jsactor.award = [];
    _.each(actor.award, (award => {
        jsactor.award = [...jsactor.award, dodge(award, ['film', 'actor', 'producer'])];
        jsactor.award.film = dodge(award.film, ['studio', 'producer', 'actors','award', 'cinemas']);
    }));
    jsactor.genre = Array.from(actor.genre);
    res.status(200).send(jsactor);
});

app.put("/api/actor", upload.single('image'), async function(req, res){ //добавление актера
    const {
        name,
        birthDate,
        country,
        genreid,
        magnumopusid
    } = req.body;
    let g_promises = genreid.split(',').map((item) => {return GenreClass.getGenreById(item);});
    let genre = await Promise.all(g_promises);
    let magnumOpus = await FilmClass.getFilmById(magnumopusid);
    let image = null;
    if (req.file) {
        image = req.file.filename;
    }
    let actor = await ActorClass.newActor( {
        name: name,
        birthDate: birthDate,
        country: country,
        genre: genre,
        image: image,
        magnumOpus: magnumOpus
    });
    let jsactor = dodge(actor, ['magnumOpus']);
    jsactor.magnumOpus = dodge(actor.magnumOpus, ['studio', 'producer', 'actors','award', 'cinemas']);
    if (jsactor) {
        res.status(200).send(jsactor);
    } else {
        res.status(401).send('failed');
    }
});

app.post("/api/actor/edit", upload.single('image'),  async function (req, res) { //изменение записи актера
    const { id } = req.body;
    let params = {};
    if (req.file) {
        params['image'] = req.file.filename;
    }
    if (req.body.magnumopusid.length > 0){
        params['magnumOpus'] = await FilmClass.getFilmById(req.body.magnumopusid);
    }
    if (req.body.genreid.length > 0){
        let g_promises = req.body.genreid.split(',').map((item) => {return GenreClass.getGenreById(item);});
        params['genre'] = await Promise.all(g_promises);
    }
    _.forEach(req.body, (value, key) => {
        switch(key) {
            case'name':
                if (value.length > 0) {
                    params[key] = value;
                }
                break;
            case'country':
                if (value.length > 0) {
                    params[key] = value;
                }
                break;
            case'birthDate':
                if (value.length > 0) {
                    params[key] = value;
                }
                break;
        }
    });
    let actor = await ActorClass.setValueById(id, params);
    let jsactor = dodge(actor, ['magnumOpus', 'films', 'award']);
    jsactor.magnumOpus = dodge(actor.magnumOpus, ['studio', 'producer', 'actors','award', 'cinemas']);
    jsactor.films= [];
    _.each(actor.films, (film => {
        jsactor.films = [...jsactor.films, dodge(film, ['studio', 'producer', 'actors','award', 'cinemas'])];
    }));
    jsactor.award = [];
    _.each(actor.award, (award => {
        jsactor.award = [...jsactor.award, dodge(award, ['film', 'actor', 'producer'])];
        jsactor.award.film = dodge(award.film, ['studio', 'producer', 'actors','award', 'cinemas']);
    }));
    res.status(200).send(jsactor);
});

app.delete("/api/actor", async function(req, res){ //удаление актеров
    const { id } = req.body;
    let result = await ActorClass.deleteActorById(id);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(401).send('failed');
    }
});
/////////////////---Actor---

/////////////////Cinema
app.get("/api/cinemas", function(req, res){  //чтение всех кинотеатров
    let result = CinemaClass.getCinemas();
    let jsResult = [];
    _.each(result, (cinema) => {
        let jsCinema = dodge(cinema, ['shownFilms','session']);
        jsResult.push(jsCinema);
    });
    res.status(200).send(jsResult);
});

app.get("/api/cinema", async function(req, res){  //чтение кинотеатра
    const { id } = req.body;
    let cinema = await CinemaClass.getCinemaById(id);
    res.status(200).send(cinema);
});

app.put("/api/cinema", async function(req, res){ //добавление кинотеатра
    const {
        name,
        city,
        address,
        shownFilmsid
    } = req.body;
    let f_promises = shownFilmsid.split(',').map((item) => {return FilmClass.getFilmById(item);});
    let shownFilms = await Promise.all(f_promises);
    let cinema = await CinemaClass.newCinema( {
        name: name,
        city: city,
        address: address,
        shownFilms: shownFilms
    });

    let jscinema = dodge(cinema, ['shownFilms','session']);
    jscinema.shownFilms = [];
    _.each(cinema.shownFilms, (film => {
        jscinema.shownFilms = [...jscinema.shownFilms, dodge(film, ['studio', 'producer', 'actors','award', 'cinemas'])];
    }));
    if (jscinema) {
        res.status(200).send(jscinema);
    } else {
        res.status(401).send('failed');
    }
});

app.post("/api/cinema",   async function (req, res) { //изменение записи кинотеатра
    const { id } = req.body;
    let params = {};
    _.forEach(req.body, (value, key) => {
        switch(key) {
            case'name':
                params[key] = value;
                break;
            case'city':
                params[key] = value;
                break;
            case'address':
                params[key] = value;
                break;
        }   //TODO: shownFilms AND sessions to edit
    });
    let result = await CinemaClass.setValueById(id, params);
    res.status(200).send(result);
});

app.delete("/api/cinema", async function(req, res){ //удаление кинотеатра
    const { id } = req.body;
    let result = await CinemaClass.deleteCinemaById(id);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(401).send('failed');
    }
});
/////////////////---Cinema---

/////////////////CinemaHall
app.get("/api/cinemaHalls", function(req, res){  //чтение всех кинозалов
    let result = CinemaHallClass.getCinemaHalls();
    let jsResult = [];
    _.each(result, (hall) => {
        let jsHall = dodge(hall, ['cinema', 'sessions']);
        jsHall.cinema = dodge(hall.cinema, ['shownFilms', 'session']);
        jsResult.push(jsHall);
    });
    res.status(200).send(jsResult);
});

app.get("/api/cinemaHall", async function(req, res){  //чтение кинозала
    const { id } = req.body;
    let cinemaHall = await CinemaHallClass.getCinemaHallById(id);
    res.status(200).send(cinemaHall);
});

app.put("/api/cinemaHall", async function(req, res){ //добавление кинозала
    const {
        number,
        cinemaid,
        spots
    } = req.body;
    console.log(req.body);
    let cinema = await CinemaClass.getCinemaById(cinemaid);
    if (cinema) {
        let cinemaHall = await CinemaHallClass.newCinemaHall( {
            number: +number,
            cinema: cinema,
            spots: +spots
        });
        if (cinemaHall) {
            res.status(200).send(cinemaHall);
        } else {
            res.status(401).send('failed');
        }
    } else {
        res.status(404).send('failed - no cinema');
    }

});

app.post("/api/cinemaHall",   async function (req, res) { //изменение записи кинозала
    const { id } = req.body;
    let params = {};
    _.forEach(req.body, (value, key) => {
        switch(key) {
            case'number':
                params[key] = value;
                break;
            case'cinema':
                params[key] = value;
                break;
            case'spots':
                params[key] = value;
                break;
        }
    });
    let result = await CinemaHallClass.setValueById(id, params);
    res.status(200).send(result);
});

app.delete("/api/cinemaHall", async function(req, res){ //удаление кинозала
    const { id } = req.body;
    let result = await CinemaHallClass.deleteCinemaHallById(id);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(401).send('failed');
    }
});
/////////////////---CinemaHall---

/////////////////Producer
app.get("/api/producers", function(req, res){  //чтение всех режиссеров
    res.status(200).send(Array.from(ProducerClass.getProducers()));
});

app.post("/api/producer", async function(req, res){  //чтение режиссера
    const { id } = req.body;
    let producer = await ProducerClass.getProducerById(id);
    let jsproducer = dodge(producer,['genre']);
    if (jsproducer){
        jsproducer.genre = Array.from(producer.genre);
        res.status(200).send(jsproducer);
    }
    res.status(403).send('Failed');
});

app.put("/api/producer", upload.single('image'), async function(req, res){ //добавление режиссера
    const {
        name,
        birthDate,
        country,
        genreid,
        numberOfFilms
    } = req.body;
    let promises = genreid.split(',').map((item) => {return GenreClass.getGenreById(item);});
    let genre = await Promise.all(promises);
    let image = null;
    if (req.file) {
        image = req.file.filename;
    }
    let producer = await ProducerClass.newProducer( {
        name: name,
        birthDate: birthDate,
        country: country,
        genre: genre,
        image: image,
        numberOfFilms: +numberOfFilms
    });
    let jsproducer = dodge(producer,['genre']);
    jsproducer.genre = Array.from(producer.genre);
    if (jsproducer) {
        res.status(200).send(jsproducer);
    } else {
        res.status(401).send('failed');
    }
});

app.post("/api/producer/edit", upload.single('image'),  async function (req, res) { //изменение записи режиссера
    const { id } = req.body;
    let params = {};
    if (req.file) {
        params['image'] = req.file.filename;
    }
    if (req.body.genreid.length > 0){
        let g_promises = req.body.genreid.split(',').map((item) => {return GenreClass.getGenreById(item);});
        params['genre'] = await Promise.all(g_promises);
    }
    _.forEach(req.body, (value, key) => {
        switch(key) {
            case'name':
                if (value.length > 0) {
                    params[key] = value;
                }
                break;
            case'birthDate':
                if (value.length > 0) {
                    params[key] = value;
                }
                break;
            case'country':
                if (value.length > 0) {
                    params[key] = value;
                }
                break;
            case'numberOfFilms':
                if (+value !== 0) {
                    params[key] = +value;
                }
                break;
        }
    });
    let result = await ProducerClass.setValueById(id, params);
    res.status(200).send(result);
});

app.delete("/api/producer", async function(req, res){ //удаление режиссера
    const { id } = req.body;
    let result = await ProducerClass.deleteProducerById(id);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(401).send('failed');
    }
});
/////////////////---Producer---

/////////////////Studio
app.get("/api/studios", function(req, res){  //чтение всех студий
    let result = StudioClass.getStudios();
    let jsResult = [];
    _.each(result, (studio) => {
        let jsStudio = dodge(studio, ['films']);
        jsResult.push(jsStudio);
    });
    res.status(200).send(jsResult);
});

app.post("/api/studio", async function(req, res){  //чтение студии
    const { id } = req.body;
    let studio = await StudioClass.getStudioById(id);
    let jsStudio = dodge(studio, ['films']);
    jsStudio.films = [];
    _.each(studio.films, (film) => {
        let jsStudioFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas','genre']);
        jsStudioFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsStudioFilm.actors = [...jsStudioFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsStudioFilm.genre = Array.from(film.genre);
        jsStudio.films.push(jsStudioFilm);
    });
    res.status(200).send(jsStudio);
});

app.put("/api/studio", upload.single('image'), async function(req, res){ //добавление студии
    const {
        name,
        yearFoundation,
        country
    } = req.body;
    let image = null;
    if (req.file) {
        image = req.file.filename;
    }
    let studio = await StudioClass.newStudio( {
        name: name,
        yearFoundation: yearFoundation,
        country: country,
        image: image
    });
    if (studio) {
        res.status(200).send(studio);
    } else {
        res.status(401).send('failed');
    }
});

app.post("/api/studio/edit", upload.single('image'),  async function (req, res) { //изменение записи студии
    const { id } = req.body;
    let params = {};
    if (req.file) {
        params['image'] = req.file.filename;
    }
    _.forEach(req.body, (value, key) => {
        switch(key) {
            case'name':
                if (value.length > 0) {
                    params[key] = value;
                }
                break;
            case'yearFoundation':
                if (value.length > 0) {
                    params[key] = value;
                }
                break;
            case'country':
                if (value.length > 0) {
                    params[key] = value;
                }
                break;
        }
    });
    let studio = await StudioClass.setValueById(id, params);
    let jsStudio = dodge(studio, ['films']);
    jsStudio.films = [];
    _.each(studio.films, (film) => {
        let jsStudioFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas']);
        jsStudioFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsStudioFilm.actors = [...jsStudioFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsStudio.films.push(jsStudioFilm);
    });
    res.status(200).send(jsStudio);
});

app.delete("/api/studio", async function(req, res){ //удаление студии
    const { id } = req.body;
    let result = await StudioClass.deleteStudioById(id);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(401).send('failed');
    }
});
/////////////////---Studio---

/////////////////Film
app.post("/api/films", async function(req, res){
    const { name, id, genre, actor, producer, cinema,
        studio, year, country, rating } = req.body;
    console.log('body', req.body);
    let result = FilmClass.getFilms();
    if (name) {
        result = result.filtered(`name CONTAINS[c] "${name}"`)
    }
    if (genre) {
        let genres = genre.split(',');
        let temp = [];
        result.map((film) => {
            let genreidArr = [];
           film.genre.map(filmGenre => {
               genreidArr.push(filmGenre.id);
           });
            let check = true;
           genres.map((genre) => {
               if(check){
               check = genreidArr.includes(genre);}
           });
            if(check){
                temp.push(film);
            }
         });
        result = Array.from(temp);
        console.log('genre res', result)
    }
    if (actor) {
        let actors = actor.split(',');
        let temp = [];
        result.map((film) => {
            let actoridArr = [];
            film.actors.map(filmActor => {
                actoridArr.push(filmActor.id);
            });
            let check = true;
            actors.map((actor) => {
                if(check){
                    check = actoridArr.includes(actor);}
            });
            if(check){
                temp.push(film);
            }
        });
        result = temp;
    }
    if (producer) {
        let producers = producer.split(',');
        let temp = [];
        result.map((film) => {
            let produceridArr = [];
            film.producer.map(filmProducer => {
                produceridArr.push(filmProducer.id);
            });
            let check = true;
            producers.map((producer) => {
                if(check){
                    check = produceridArr.includes(producer);}
            });
            if(check){
                temp.push(film);
            }
        });
        result = temp;
    }
    if (cinema) {
        let cinemas = cinema.split(',');
        let temp = [];
        result.map((film) => {
            let cinemaidArr = [];
            film.cinema.map(filmCinema => {
                cinemaidArr.push(filmCinema.id);
            });
            let check = true;
            cinemas.map((cinema) => {
                if(check){
                    check = cinemaidArr.includes(cinema);}
            });
            if(check){
                temp.push(film);
            }
        });
        result = temp;
    }
    if (studio) {
        result = result.filtered(`studio.id = "${studio}"`)
    }
    if (id) {
        result = result.filtered(`id = "${id}"`)
    }
    if (year) {
        result = result.filtered(`year = "${year}"`)
    }
    if (country) {
        console.log('country before res', result);
        result = result.filtered(`country CONTAINS[c] "${country}"`)
    }
    if (rating) {
        let rating1 = rating.split(',');
        result = result.filtered(`rating>= "${rating1[0]}" AND rating<="${rating1[1]}"`)
    }
    let jsResult = [];
    _.each(result, (film) => {
        let jsFilm = dodge(film, ['studio', 'actors', 'award', 'cinemas']);
        jsFilm.studio = dodge(film.studio, ['films', 'actors']);
        jsFilm.actors = [];
        _.each(film.actors, (actor => {
            jsFilm.actors = [...jsFilm.actors, dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        }));
        jsFilm.award = [];
        _.each(film.award, (award => {
            jsFilm.award = [...jsFilm.award, dodge(award, ['film', 'actor', 'producer'])];
        }));
        jsFilm.cinemas = [];
        _.each(film.cinemas, (cinema => {
            jsFilm.cinemas = [...jsFilm.cinemas, dodge(cinema, ['shownFilms', 'session'])];
        }));
        jsFilm.genre = Array.from(film.genre);
        jsFilm.producer = Array.from(film.producer);
        jsResult.push(jsFilm);
    });
    res.status(200).send(jsResult);
});

app.get("/api/film", async function(req, res){  //чтение фильма
    const { id } = req.body;
    let film = await FilmClass.getFilmById(id);
    res.status(200).send(film);
});

app.put("/api/film",  upload.single('image'), async function(req, res){ //добавление фильма
    const {
        name,
        year,
        country, //can be empty
        genreid, //can be empty []
        duration,  //can be empty
        studioid, //can be empty
        rating,
        ratesAmount,
        budget,//can be empty
        producerid,//can be empty []
        description,
        actorid
    } = req.body;

    let g_promises = genreid.split(',').map((item) => {return GenreClass.getGenreById(item);});
    let genre = await Promise.all(g_promises);
    let studio = await StudioClass.getStudioById(studioid);
    let p_promises = producerid.split(',').map((item) => {return ProducerClass.getProducerById(item);});
    let producer = await Promise.all(p_promises);
    let a_promises = actorid.split(',').map((item) => {return ActorClass.getActorById(item);});
    let actors = await Promise.all(a_promises);
    let image = null;
    if (req.file) {
        image = req.file.filename;
    }
    let film = await FilmClass.newFilm( {
        name: name,
        year: year,
        country: country,
        genre: genre,
        duration: +duration,
        studio: studio,
        rating: +rating,
        ratesAmount: +ratesAmount,
        budget: +budget,
        producer: producer,
        description: description,
        image: image,
        actors: actors
    });
    if (film) {
        let jsFilm = dodge(film, ['studio', 'actors', 'award', 'cinemas']);
        jsFilm.studio = dodge(film.studio, ['films']);
        jsFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsFilm.actors = [...jsFilm.actors, dodge(actor, ['films', 'award', 'magnumOpus'])]
        });
        res.status(200).send(jsFilm);
    } else {
        res.status(401).send('failed');
    }
});

app.post("/api/film/edit", upload.single('image'),  async function (req, res) { //изменение записи фильма
    const { id } = req.body;
    console.log("body", req.body);
    let params = {};
    if (req.file) {
        params['image'] = req.file.filename;
    }
    if (req.body.actorid.length > 0){
        let a_promises = req.body.actorid.split(',').map((item) => {return ActorClass.getActorById(item);});
        params['actors']= await Promise.all(a_promises);
    }
    if (req.body.genreid.length > 0){
        let g_promises = req.body.genreid.split(',').map((item) => {return GenreClass.getGenreById(item);});
        params['genre'] = await Promise.all(g_promises);
    }
    if (req.body.producerid.length > 0){
        let p_promises = req.body.producerid.split(',').map((item) => {return ProducerClass.getProducerById(item);});
        params['producer'] = await Promise.all(p_promises);
    }
    if (req.body.studioid.length > 0){

        params['studio'] = await StudioClass.getStudioById(req.body.studioid);
        console.log("studio in params", params['studio']);
    }
    _.forEach(req.body, (value, key) => {
        switch(key) {
            case'name':
                if (value.length > 0) {
                    params[key] = value;
                }
                break;
            case'country':
                if (value.length > 0) {
                    params[key] = value;
                }
                break;
            case'year':
                if (value.length > 0) {
                    params[key] = value;
                }
                break;
            case'duration':
                if (+value !== 0) {
                    params[key] = +value;
                }
                break;
            case'rating':
                if (+value !== 0) {
                    params[key] = +value;
                }
                break;
            case'ratesAmount':
                if (+value !== 0) {
                    params[key] = +value;
                }
                break;
            case'budget':
                if (+value !== 0) {
                    params[key] = +value;
                }
                break;
            case'description':
                if (value.length > 0) {
                    params[key] = value;
                }
                break;

        }
    });
    let film = await FilmClass.setValueById(id, params);
    console.log("film", film);
    let jsFilm = dodge(film, ['studio', 'actors', 'award', 'cinemas']);
    jsFilm.studio = dodge(film.studio, ['films', 'actors']);
    jsFilm.actors = [];
    _.each(film.actors, (actor => {
        jsFilm.actors = [...jsFilm.actors, dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
    }));
    jsFilm.award = [];
    _.each(film.award, (award => {
        jsFilm.award = [...jsFilm.award, dodge(award, ['film', 'actor', 'producer'])];
    }));
    jsFilm.cinemas = [];
    _.each(film.cinemas, (cinema => {
        jsFilm.cinemas = [...jsFilm.cinemas, dodge(cinema, ['shownFilms', 'session'])];
    }));
    jsFilm.genre = Array.from(film.genre);
    jsFilm.producer = Array.from(film.producer);
    console.log("jsfilm", jsFilm);
    res.status(200).send(jsFilm);
});

app.delete("/api/film", async function(req, res){ //удаление фильмов
    const { id } = req.body;
    let result = await FilmClass.deleteFilmById(id);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(401).send('failed');
    }
});
/////////////////---Film---

/////////////////Session
app.get("/api/sessions", function(req, res){  //чтение всех сеансов

    let result = SessionClass.getSessions();
    let jsResult = [];
    _.each(result, (session) => {
        let jsSession = dodge(session, ['film', 'cinema', 'cinemaHall']);
        jsSession.film = dodge(session.film, ['genre', 'studio', 'actors', 'producer', 'award']);
        jsSession.cinema = dodge(session.cinema, ['shownFilms', 'session']);
        jsSession.cinemaHall = dodge(session.cinemaHall, ['cinema', 'sessions']);
        jsResult.push(jsSession);
    });
    res.status(200).send(jsResult);
});

app.get("/api/session", async function(req, res){  //чтение сеанса
    const { id } = req.body;
    let session = await SessionClass.getSessionById(id);
    res.status(200).send(session);
});

app.put("/api/session", async function(req, res){ //добавление сеанса
    const {
        filmid,
        date,
        time,
        cinemaid,
        price,
        cinemaHallid
    } = req.body;
    let film = await FilmClass.getFilmById(filmid);
    let cinema = await CinemaClass.getCinemaById(cinemaid);
    let cinemaHall = await CinemaHallClass.getCinemaHallById(cinemaHallid);
    let session = await SessionClass.newSession( {
        film: film,
        date: date,
        time: time,
        cinema: cinema,
        Price: +price,
        cinemaHall: cinemaHall
    });
    if (session) {
        let jsSession = dodge(session, ['film', 'cinema','cinemaHall']);
        jsSession.film = dodge(session.film, ['genre', 'studio','actors','producer','award']);
        jsSession.cinema = dodge(session.cinema, ['shownFilms', 'session']);
        jsSession.cinemaHall = dodge(session.cinemaHall, ['cinema', 'sessions']);

        res.status(200).send(jsSession);
    } else {
        res.status(401).send('failed');
    }
});

app.post("/api/session",   async function (req, res) { //изменение записи сеанса
    const { id } = req.body;
    let params = {};
    _.forEach(req.body, (value, key) => {
        switch(key) {
            case'film':
                params[key] = value;
                break;
            case'date':
                params[key] = value;
                break;
            case'time':
                params[key] = value;
                break;
            case'cinema':
                params[key] = value;
                break;
            case'price':
                params[key] = value;
                break;
            case'cinemaHall':
                params[key] = value;
                break;
        }
    });
    let result = await SessionClass.setValueById(id, params);
    res.status(200).send(result);
});

app.delete("/api/session", async function(req, res){ //удаление сеанса
    const { id } = req.body;
    let result = await SessionClass.deleteSessionById(id);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(401).send('failed');
    }
});
/////////////////---Session---

/////////////////Award
app.get("/api/awards", function(req, res){  //чтение всех наград
    res.status(200).send(Array.from(AwardClass.getAwards()));
});

app.get("/api/award", async function(req, res){  //чтение награды
    const { id } = req.body;
    let award = await AwardClass.getAwardById(id);
    res.status(200).send(award);
});

app.put("/api/award", async function(req, res){ //добавление награды
    const {
        name,
        nomination,
        actorid,
        producerid,
        filmid
    } = req.body;

    let actor = '';
    let producer = '';

    if (actorid.length > 0){
        actor = await ActorClass.getActorById(actorid);
    }
    if (producerid.length > 0){
        producer = await ProducerClass.getProducerById(producerid);
    }
    let film = await FilmClass.getFilmById(filmid);

    let award = await AwardClass.newAward( {
        name: name,
        nomination: nomination,
        actor: actor,
        producer: producer,
        film: film
    });

    let jsAward = dodge(award, ['film', 'actor']);
    jsAward.actor = dodge(actor, ['films', 'award', 'genre', 'magnumOpus']);
    jsAward.films = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas']);

    if (jsAward) {
        res.status(200).send(jsAward);
    } else {
        res.status(401).send('failed');
    }
});

app.post("/api/award",   async function (req, res) { //изменение записи награды
    const { id } = req.body;
    let params = {};
    _.forEach(req.body, (value, key) => {
        switch(key) {
            case'name':
                params[key] = value;
                break;
            case'nomination':
                params[key] = value;
                break;
            case'actor':
                params[key] = value;
                break;
            case'producer':
                params[key] = value;
                break;
            case'film':
                params[key] = value;
                break;
        }
    });
    let result = await AwardClass.setValueById(id, params);
    res.status(200).send(result);
});

app.delete("/api/award", async function(req, res){ //удаление награды
    const { id } = req.body;
    let result = await AwardClass.deleteAwardById(id);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(401).send('failed');
    }
});
/////////////////---Award---

app.post("/api/addFavourite", checkAuth, async function (req, res) {
    const { filmid, userid } = req.body;
    let params = {};
    let film = await FilmClass.getFilmById(filmid);
    let user1 = await UserClass.getUserById(userid);
    params['favouriteFilms'] = _.xorBy(Array.from(user1.favouriteFilms), [film], 'id');

    let user = await UserClass.setValueById(userid, params);

    let jsUser = dodge(user, ['favouriteFilms','filmsToWatch','watchedFilms']);
    jsUser.favouriteFilms = [];
    jsUser.filmsToWatch = [];
    jsUser.watchedFilms = [];
    _.each(user.favouriteFilms, (film) => {
        let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas']);
        jsUserFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsUser.favouriteFilms.push(jsUserFilm);
    });
    _.each(user.filmsToWatch, (film) => {
        let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas']);
        jsUserFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsUser.filmsToWatch.push(jsUserFilm);
    });
    _.each(user.watchedFilms, (film) => {
        let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas']);
        jsUserFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsUser.watchedFilms.push(jsUserFilm);
    });
    res.status(200).send(jsUser);
});

app.post("/api/addToWatch", checkAuth,  async function (req, res) {
    const { filmid, userid } = req.body;
    let params = {};
    let film = await FilmClass.getFilmById(filmid);
    let user1 = await UserClass.getUserById(userid);

    params['filmsToWatch'] = _.xorBy(Array.from(user1.filmsToWatch), [film], 'id');

    let user = await UserClass.setValueById(userid, params);

    let jsUser = dodge(user, ['favouriteFilms','filmsToWatch','watchedFilms']);
    jsUser.favouriteFilms = [];
    jsUser.filmsToWatch = [];
    jsUser.watchedFilms = [];
    _.each(user.favouriteFilms, (film) => {
        let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas']);
        jsUserFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsUser.favouriteFilms.push(jsUserFilm);
    });
    _.each(user.filmsToWatch, (film) => {
        let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas']);
        jsUserFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsUser.filmsToWatch.push(jsUserFilm);
    });
    _.each(user.watchedFilms, (film) => {
        let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas']);
        jsUserFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsUser.watchedFilms.push(jsUserFilm);
    });
    res.status(200).send(jsUser);
});

app.post("/api/addWatched", checkAuth,  async function (req, res) {
    const { filmid, userid } = req.body;
    let params = {};
    let film = await FilmClass.getFilmById(filmid);
    let user1 = await UserClass.getUserById(userid);

    params['watchedFilms'] = _.xorBy(Array.from(user1.watchedFilms), [film], 'id');

    let user = await UserClass.setValueById(userid, params);
    let jsUser = dodge(user, ['favouriteFilms','filmsToWatch','watchedFilms']);
    jsUser.favouriteFilms = [];
    jsUser.filmsToWatch = [];
    jsUser.watchedFilms = [];
    _.each(user.favouriteFilms, (film) => {
        let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas']);
        jsUserFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsUser.favouriteFilms.push(jsUserFilm);
    });
    _.each(user.filmsToWatch, (film) => {
        let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas']);
        jsUserFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsUser.filmsToWatch.push(jsUserFilm);
    });
    _.each(user.watchedFilms, (film) => {
        let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas']);
        jsUserFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsUser.watchedFilms.push(jsUserFilm);
    });
    res.status(200).send(jsUser);
});

app.post("/api/send", async (req, res) => {
    const output = `
    <p>You have a new question from Кинопоиск</p>
    <h3>New Message</h3>
    <ul>  
      <li>User: ${req.body.user}</li>
      <li>Topic: ${req.body.topic}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.text}</p>`;
 console.log('send', req.body);
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
            user: 'anya10299@gmail.com',
            pass: 'Nopainnogain4'
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    let mailOptions = {
        from: 'anya10299@gmail.com',
        to: 'anya10299@gmail.com',
        subject: req.body.topic,
        text: req.body.text,
        html: output
    };

    let result = await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        res.status(200).send('Email has been sent');
    });
    res.status(200).send(result);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send(err.message);
});

setTimeout(() => {
    //---/Тип/-------///Путь///-------------
    axios.get(`http://127.0.0.1:${port}/api/genres`, {
        name: 'film',
        rating: 8.9,
        description: "good film"
})
    /* .then((response) => {console.log(response.data)} ) */
 }, 2000);


server.listen(port, function(){
    console.log("Сервер подключен");
});
axios.defaults.port = port;

setInterval(() => {io.emit('tick', {tick: 'tick'})}, 2000);

module.exports = app;



