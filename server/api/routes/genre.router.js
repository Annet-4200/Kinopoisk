import Express from 'express'
const GenreClass = require('../Realm/Models/GenreClass');
const checkAdmin = require('../middleware/checkAdmin');
import _ from "lodash";

const router = Express.Router();
/////////////////Genre
router.get("/api/genres", function(req, res){  //чтение всех жанров
    setTimeout(() => {
        res.status(200).send(Array.from(GenreClass.getGenres()));
    }, 1000)
});

router.get("/api/genre", async function(req, res){  //чтение жанра
    const { id } = req.body;
    let genre = await GenreClass.getGenreById(id);
    res.status(200).send(genre);
});

router.put("/api/genre", checkAdmin, async function(req, res){ //добавление жанра
    const {
        name,
        ageLimit
    } = req.body;
    let genre = await GenreClass.newGenre( {
        name: name,
        ageLimit: +ageLimit
    });
    if (genre) {
        res.status(200).send(_.assign({}, genre));
    } else {
        res.status(401).send('failed');
    }
});

router.post("/api/genre", async function (req, res) { //изменение записи жанра
    const { id } = req.body;
    let params = {};
    _.forEach(req.body, (value, key) => {
        switch(key) {
            case'name':
                params[key] = value;
                break;
            case'ageLimit':
                params[key] = value;
                break;
        }
    });
    let result = await GenreClass.setValueById(id, params);
    res.status(200).send(result);
});

router.delete("/api/genre", async function(req, res){ //удаление жанров
    const { id } = req.body;
    let result = await GenreClass.deleteGenreById(id);
    if (result) {
        res.status(200).send(result);
    } else {
        res.status(401).send('failed');
    }
});
/////////////////---Genre---
module.exports = router;
