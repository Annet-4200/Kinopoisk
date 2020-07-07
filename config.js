module.exports = {
    host: process.env.NODE_ENV === "production" ? "obscure-cove-10928.herokuapp.com" : (process.env.HOST || '127.0.0.1'),
    port:process.env.PORT || 8080,
    dbHost:"localhost",
    dbPort:"27017",
    dbName: "bot-manager",
    app:{
        title:"Kinopoisk",
        description:'Kinopoisk',
        head:{
            titleTemplate:'Kinopoisk',
            meta:[
                {charset:"utf-8"}
            ]
        }
    }
};
