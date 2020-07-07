import Express from 'express'
const UserClass = require('../Realm/Models/UserClass');
import _ from "lodash";
const uuidv4 = require('uuid/v4');
const multer  = require('multer');
const secret = 'secret';
const strongPass = /^\S*(?=\S{8,})(?=\S*[a-z])(?=\S*[A-Z])(?=\S*[\d])\S*$/;
const router = Express.Router();
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
/////////////////User
router.get("/api/users", function(req, res){
    res.status(200).send(Array.from(UserClass.getUsers()));
});

router.post("/api/user", async function(req, res) {
    const { id } = req.body;
    let user = await UserClass.getUserById(id);
    console.log('id', id);
    console.log('user', user);
    let jsUser = dodge(user, ['favouriteFilms','filmsToWatch','watchedFilms']);
    jsUser.favouriteFilms = [];
    jsUser.filmsToWatch = [];
    jsUser.watchedFilms = [];
    _.each(user.favouriteFilms, (film) => {
        let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas','genre']);
        jsUserFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsUserFilm.genre = Array.from(film.genre);
        jsUser.favouriteFilms.push(jsUserFilm);
    });
    _.each(user.filmsToWatch, (film) => {
        let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas','genre']);
        jsUserFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsUserFilm.genre = Array.from(film.genre);
        jsUser.filmsToWatch.push(jsUserFilm);
    });
    _.each(user.watchedFilms, (film) => {
        let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas','genre']);
        jsUserFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsUserFilm.genre = Array.from(film.genre);
        jsUser.watchedFilms.push(jsUserFilm);
    });
    res.status(200).send(jsUser);
});

router.post("/api/register", async function(req, res){
    const {
        login,
        password,
    } = req.body;
    if (Array.from(UserClass.getUsers().filtered('login = $0', login)).length === 0) {
        if (strongPass.test(password)){
            let user = await UserClass.newUser( {
              login,
              password,
            });
            if (user) {
              res.status(200).send(_.assign({}, user));
            } else {
              res.status(401).send('failed');
            }
        }
        else {
            res.status(403).send('Слабый пароль. Надеждный пароль должен быть не менее 8 символов,' +
                ' содержать хотя бы одну цифру, заглавную и строчную буквы.');
        }
    } else {
      res.status(403).send('User with this login already created');
    }
});

router.post("/api/user/edit", upload.single('image'),  async function (req, res) {
    const { id, oldPassword, newPassword} = req.body;
    let params = {};
    let user1 = await UserClass.getUserById(id);
    if(oldPassword && newPassword){
        if(UserClass.checkPassword(oldPassword, id, user1.password)){
            if(strongPass.test(newPassword)){
                params['password'] = UserClass.encryptPassword(newPassword,id)
            }
            else {
                res.status(403).send('Слабый пароль. Надеждный пароль должен быть не менее 8 символов, содержать хотя бы одну цифру, заглавную и строчную буквы.');
            }
        }
        else {
            res.status(403).send('Неверно введен старый пароль. Попробуйте снова');
        }
    }
    if (req.file) {
        params['image'] = req.file.filename;
    }
    _.forEach(req.body, (value, key) => {
        switch(key) {
            case'name':
                if (value.length>0){
                    params[key] = value;
                }
                break;
            case'nickname':
                if (value.length>0){
                    params[key] = value;
                }
                break;
            case'birthDate':
                if (value.length>0){
                    params[key] = value;
                }
                break;
            case'email':
                if (value.length>0){
                    params[key] = value;
                }
                break;
            case'gender':
                if (value.length>0){
                    params[key] = value;
                }
                break;
        }
    });
    let user = await UserClass.setValueById(id, params);
    let jsUser = dodge(user, ['favouriteFilms','filmsToWatch','watchedFilms']);
    jsUser.favouriteFilms = [];
    jsUser.filmsToWatch = [];
    jsUser.watchedFilms = [];
    _.each(user.favouriteFilms, (film) => {
        let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas', 'genre']);
        jsUserFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsUserFilm.genre = Array.from(film.genre);
        jsUser.favouriteFilms.push(jsUserFilm);
    });
    _.each(user.filmsToWatch, (film) => {
        let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas', 'genre']);
        jsUserFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsUserFilm.genre = Array.from(film.genre);
        jsUser.filmsToWatch.push(jsUserFilm);
    });
    _.each(user.watchedFilms, (film) => {
        let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas', 'genre']);
        jsUserFilm.actors = [];
        _.each(film.actors, (actor) => {
            jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
        });
        jsUserFilm.genre = Array.from(film.genre);
        jsUser.watchedFilms.push(jsUserFilm);
    });
    res.status(200).send(jsUser);
});

router.delete("/api/user", async function(req, res){
    const { id } = req.body;
    let result = await UserClass.deleteUserById(id);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(401).send('User not found');
    }
});

router.post("/api/auth", async function(req, res){
  const {
    login,
    password,
  } = req.body;
  let user = await UserClass.authUser( {
    login,
    password,
  });
  if (user) {
      let jsUser = dodge(user, ['favouriteFilms','filmsToWatch','watchedFilms']);
      jsUser.favouriteFilms = [];
      jsUser.filmsToWatch = [];
      jsUser.watchedFilms = [];
      _.each(user.favouriteFilms, (film) => {
          let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas','genre']);
          jsUserFilm.actors = [];
          _.each(film.actors, (actor) => {
              jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
          });
          jsUserFilm.genre = Array.from(film.genre);
          jsUser.favouriteFilms.push(jsUserFilm);
      });
      _.each(user.filmsToWatch, (film) => {
          let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas','genre']);
          jsUserFilm.actors = [];
          _.each(film.actors, (actor) => {
              jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
          });
          jsUserFilm.genre = Array.from(film.genre);
          jsUser.filmsToWatch.push(jsUserFilm);
      });
      _.each(user.watchedFilms, (film) => {
          let jsUserFilm = dodge(film, ['studio', 'producer', 'actors','award', 'cinemas', 'genre']);
          jsUserFilm.actors = [];
          _.each(film.actors, (actor) => {
              jsUserFilm.actors = [...jsUserFilm.actors,  dodge(actor, ['films', 'award', 'genre','magnumOpus'])];
          });
          jsUserFilm.genre = Array.from(film.genre);
          jsUser.watchedFilms.push(jsUserFilm);
      });
      res.status(200).send(jsUser);
  } else {
    res.status(401).send('User not found');
  }
});

/////////////////---User---
module.exports = router;
