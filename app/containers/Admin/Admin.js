import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    get_genres,
    get_films,
    get_filtered_films,
    get_cinemas,
    get_studios,
    get_actors,
    get_producers,
    get_halls,
    update_token
} from "../../actions/indexActions";
import { get, post, update, remove } from '../../fetch';
import config from '../../../config';
import axios from 'axios';
import openSocket from 'socket.io-client';
import appConfig from '../../../config';
import {Star, StarBorder } from '@material-ui/icons/';
import "../../components/Home//style.css";
import {Button, InputLabel, Select, MenuItem, Box, TextField} from "@material-ui/core";
import { withCookies, Cookies } from 'react-cookie';
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from 'prop-types';
const requestUrl = `${appConfig.host}`;
const requestPort = `${appConfig.port}`;
const port = +config.port + 1;

const styles = {
    filmDataContainer: {
        display: 'flex',
        padding: '30px',
        backgroundColor: '#363636',
        borderRadius: '10px',
        boxShadow: '0 0 15px black',
        marginLeft: '30px',
        backgroundImage: 'linear-gradient(0deg, rgba(148,20,221,0.35) 0%, rgba(38,38,38,1) 100%)',
    },
    filmDataPart: {
        width: '60%',
        justifyContent:'center',
        padding: '25px',
        paddingLeft: 0
    },
    filmDataInner: {
        width: '50%',
        fontSize: '19px',
    },
    filmDataPartImage: {
        width: '40%',
        transform: "translateX(-15%)",
        display: 'flex',
        alignItems:"flex-end",
        flexDirection: 'column'
    },
    image: {
        width: '100%',
        height: 'auto',
        borderRadius: '10px',
        boxShadow: '0 0 15px black'
    },
    bigContainer: {
        width: '90%',
        maxWidth: '1000px',
        //backgroundImage: 'linear-gradient(0deg, rgba(148,20,221,0.35) 0%, rgba(38,38,38,1) 100%)',
    },
    filmTitle: {
        fontSize: '40px',
        fontWeight: 'bold',
        marginTop:'20px',
        marginBottom: '20px',
        fontFamily: 'Oswald',
        letterSpacing: '4px'
    },
    descriptionTitle: {
        fontSize: '25px',
        fontWeight: 'bold',
        marginBottom:'40px',
        fontStyle: 'italic',
    },
    editInputWrapper: {
        margin: '15px',
        width:'300px',
    },
    iconHover: {
        '&:hover': {
            color: '#252525',
        },
    },
    MuiButtonAddToWatch: {
        backgroundImage: "linear-gradient(147deg, #fe8a39 0%, #fd3838 74%)",
        boxShadow: "0px 4px 32px rgba(252, 56, 56, 0.4)",
        borderRadius: 100,
        color: "#ffffff",
        margin: '15px 0 0 0',
        maxWidth: '80%',
    },
};


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            <Box p={3}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {

        genreName: '',
        genreAgeLimit: 0,

        cinemaCity: '',
        cinemaName: '',
        cinemaAddress: '',
        cinemaFilms: [],

        hallNumber: 0,
        hallCinema: '',
        hallSpots: 0,

        producerName: '',
        producerBirthDate: '',
        producerCountry: '',
        producerGenre: [],
        producerImage: null,
        producerNFilms: 0,

        studioName: '',
        studioYear: '',
        studioCountry: '',
        studioImage: '',

        actorName: '',
        actorBirthDate: '',
        actorCountry: '',
        actorGenre: [],
        actorImage: null,
        actorFilm: '',

        filmName: '',
        filmYear: '',
        filmCountry: '',
        filmGenre: [],
        filmImage: null,
        filmDuration: 0,
        filmStudio: '',
        filmRating: 0,
        filmRatesAmount: 0,
        filmBudget: 0,
        filmProducer: [],
        filmActor: [],
        filmDescription: '',

        awardName: '',
        awardNomination: '',
        awardActor: '',
        awardProducer: '',
        awardFilm: '',

        sessionFilm: '',
        sessionDate: '',
        sessionTime: '',
        sessionCinema: '',
        sessionPrice: 0,
        sessionHall: '',

        login: '',
        password: '',
        registrationLogin: '',
        registrationPassword: '',
        isAdmin: false,
        tab: 0,
        deleteid: ""
    };
    //FOR PRODUCTION (https) and delete port+1
    this.socket = openSocket(`http://${config.host}:${+config.port+1}`);
  }

  componentDidMount() {
      console.log(process.env.NODE_ENV);
      console.log(process.env.PORT);
      this.props.getFilms();
      this.props.getGenres();
      this.props.getCinemas();
      this.props.getStudios();
      this.props.getActors();
      this.props.getProducers();
      this.props.getHalls();
      if (this.props.user === "5aaccb7c-1b05-4283-a50e-5b74437417ea") {
          this.setState({isAdmin: true});
      }
      console.log("Admin: Component did mount");
  }

  render() {
    return (
        <div style={styles.bigContainer}>
            {this.state.isAdmin &&
        <Box>
            <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <p style={styles.filmTitle}>Панель администратора</p>
            </Box>
            <Box
              style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}
            >
                <Tabs style={{width: '200px'}}
                      width='100%'
                      orientation="vertical"
                      variant="scrollable"
                      value={this.state.tab}
                      onChange={(event, newValue) => {this.setState({tab: newValue})}}>
                    <Tab label="Жанр" value={0} />
                    <Tab label="Кинотеатр" value={1} />
                    <Tab label="Кинозал" value={2} />
                    <Tab label="Режиссер" value={3} />
                    <Tab label="Студия" value={4} />
                    <Tab label="Актер" value={5} />
                    <Tab label="Фильм" value={6} />
                    <Tab label="Награда" value={7} />
                    <Tab label="Сеанс" value={8} />
                    <Tab label="Пользователи" value={9} />
                </Tabs>
                <Box
                  style={{
                      ...styles.filmDataContainer,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                      width:'100%'}}
                >
                    <TabPanel value={this.state.tab} index={0}>
                        <Box
                          style={{
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-around'
                          }}
                        >
                            <Box>
                                <h3>Добавление жанра:</h3>
                                <Box style={styles.editInputWrapper}>
                                <TextField label="Название" type="text" variant="outlined" color = "secondary"
                                   defaultValue={this.state.genreName} onChange={(event) => {
                                       this.setState({genreName: event.target.value})
                                   }}
                                />
                                </Box>
                                <Box style={styles.editInputWrapper}>
                                <TextField label="Ограничение" type="number" variant="outlined" color = "secondary"
                                   defaultValue={this.state.genreAgeLimit} onChange={(event) => {
                                       this.setState({genreAgeLimit: event.target.value})
                                   }}
                                />
                                </Box>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                    update('/genre', {name: this.state.genreName, ageLimit: this.state.genreAgeLimit})
                                }}
                                >
                                    Cоздать жанр
                                </Button>
                            </Box>
                            <Box>
                                <h3>Удаление жанра:</h3>
                                <Box style={styles.editInputWrapper}>
                                    <TextField label="id" type="text" variant="outlined" color = "secondary"
                                        onChange={(event) => {this.setState({deleteid: event.target.value})}}
                                    />
                                </Box>
                                <Button variant="contained" color="secondary"
                                    onClick={() => {remove('/genre', {id: this.state.deleteid})}}
                                >
                                    Удалить жанр
                                </Button>
                            </Box>
                        </Box>
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={1}>
                        <Box style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }}>
                            <Box>
                        <h3>Добавление кинотеатра:</h3>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Название" type="text" variant="outlined" color = "secondary"
                               defaultValue={this.state.cinemaName} onChange={(event) => {
                                   this.setState({cinemaName: event.target.value})
                               }}
                            />
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Город" type="text" variant="outlined" color = "secondary"
                               defaultValue={this.state.cinemaCity} onChange={(event) => {
                                   this.setState({cinemaCity: event.target.value})
                               }}
                            />
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Адрес" type="text" variant="outlined" color = "secondary"
                               defaultValue={this.state.cinemaAddress} onChange={(event) => {
                                   this.setState({cinemaAddress: event.target.value})
                               }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <InputLabel id="film-label">Фильмы в прокате:</InputLabel>
                            <Select multiple labelId="film-label" id="select" value={this.state.cinemaFilms}
                                onChange={(event) => {
                                    this.setState(
                                      {cinemaFilms: event.target.value},
                                      () => {console.log("cinema Films: ",this.state.cinemaFilms)});
                                }}
                            >
                                {this.props.films.map((item, index) => {
                                    return <MenuItem key={`film-${index}`} value={item.id}>{item.name}</MenuItem>
                                }) }
                            </Select>
                        </Box>
                        <Button
                            variant="contained"
                             color="secondary"
                             onClick={() => {
                                 update('/cinema', {
                                     name:this.state.cinemaName,
                                     city: this.state.cinemaCity,
                                     address: this.state.cinemaAddress,
                                     shownFilmsid: this.state.cinemaFilms
                                 })}}
                        >
                            Cоздать кинотеатр
                        </Button>
                            </Box>
                        <Box>
                        <h3>Удаление кинотеатра:</h3>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="id" type="text" variant="outlined" color = "secondary"
                               onChange={(event) => {
                                   this.setState({
                                        deleteid: event.target.value
                                    })
                                }}
                            />
                        </Box>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={
                                () => {remove('/cinema', {id: this.state.deleteid})}
                            }
                        >
                            Удалить кинотеатр
                        </Button>
                        </Box>
                        </Box>
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={2}>
                        <Box
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-around'
                            }}
                        >
                            <Box>
                        <h3>Добавление кинозала:</h3>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Номер зала" type="number" variant="outlined" color = "secondary"
                                       defaultValue={this.state.hallNumber}
                                       onChange={(event) => {this.setState({hallNumber: event.target.value})}}
                            />
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <InputLabel id="hall-label">Кинотеатр:</InputLabel>
                            <Select labelId="hall-label" id="select"
                                    value={this.state.hallCinema} onChange={(event) => {
                                        this.setState(
                                          {hallCinema: event.target.value},
                                          () => {console.log("hall cinema: ",this.state.hallCinema)});
                                    }}>
                                {this.props.cinemas.map((item, index) => {
                                    return <MenuItem key={`cinema-${index}`} value={item.id}>{item.name}</MenuItem>
                                }) }
                            </Select>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Количество мест" type="number" variant="outlined" color = "secondary"
                                       defaultValue={this.state.hallSpots} onChange={(event) => {
                                           this.setState({hallSpots: event.target.value})
                                       }}
                            />
                        </Box>
                    <Button  variant="contained" color="secondary"
                             onClick={() => {
                                 update('/cinemaHall', {
                                     number:this.state.hallNumber,
                                     cinemaid: this.state.hallCinema,
                                     spots: this.state.hallSpots
                                 })
                             }}>
                        Cоздать кинозал
                    </Button>
                            </Box>
                            <Box>
                        <h3>Удаление кинозала:</h3>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="id" type="text" variant="outlined" color = "secondary"
                                       onChange={(event) => {this.setState({deleteid: event.target.value})}}/>
                        </Box>
                        <Button variant="contained" color="secondary" onClick={() => {
                            remove('/cinemaHall', {id: this.state.deleteid})
                        }}>
                            Удалить кинозал
                        </Button>
                            </Box>
                        </Box>
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={3}>
                        <Box style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }}>
                            <Box>
                        <h3>Добавление режиссера:</h3>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Имя" type="text" variant="outlined" color = "secondary"
                                       defaultValue={this.state.producerName} onChange={(event) => {
                                           this.setState({producerName: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Дата рождения" type="text" variant="outlined" color = "secondary"
                                       defaultValue={this.state.producerBirthDate} onChange={(event) => {
                                           this.setState({producerBirthDate: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Страна" type="text" variant="outlined" color = "secondary"
                                       defaultValue={this.state.producerCountry} onChange={(event) => {
                                           this.setState({producerCountry: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                                <InputLabel id="genre-label">Жанры:</InputLabel>
                                <Select multiple labelId="genre-label" id="select" value={this.state.producerGenre}
                                        onChange={(event) => {
                                            this.setState({producerGenre: event.target.value},
                                              () => {console.log("producer genre: ",this.state.producerGenre)}
                                              );
                                        }}>
                                    {this.props.genres.map((item, index) => {
                                        return <MenuItem key={`genre-${index}`} value={item.id}>{item.name}</MenuItem>
                                    }) }
                                </Select>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Количество фильмов" type="number" variant="outlined" color = "secondary"
                                       defaultValue={this.state.producerNFilms} onChange={(event) => {
                                           this.setState({producerNFilms: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <p> Картинка:
                                <input type="file" onChange={(event) => {
                                    this.setState({producerImage: event.target.files[0]})
                                }} />
                            </p>
                        </Box>
                        <Button  variant="contained" color="secondary" onClick={() => {
                            let data = new FormData();
                            data.append('name', this.state.producerName);
                            data.append('image', this.state.producerImage);
                            data.append('numberOfFilms', this.state.producerNFilms);
                            data.append('genreid', this.state.producerGenre);
                            data.append('country', this.state.producerCountry);
                            data.append('birthDate', this.state.producerBirthDate);
                            const config = {
                                headers: { 'content-type': 'multipart/form-data' }
                            };
                            axios.put(`http://${appConfig.host}:${+appConfig.port+1}/api/producer`, data,
                                config)
                        }}>
                            Cоздать режиссера
                        </Button>
                            </Box>
                            <Box>
                        <h3>Удаление режиссера:</h3>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="id" type="text" variant="outlined" color = "secondary"
                                       onChange={(event) => {this.setState({deleteid: event.target.value})}}/>
                        </Box>
                        <Button variant="contained" color="secondary"
                                onClick={() => {remove('/producer', {id: this.state.deleteid})}}>
                            Удалить режиссера
                        </Button>
                            </Box>
                        </Box>
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={4}>
                        <Box style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }}>
                            <Box>
                        <h3>Добавление студии:</h3>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Название" type="text" variant="outlined" color = "secondary"
                                       defaultValue={this.state.studioName} onChange={(event) => {
                                           this.setState({studioName: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Дата создания" type="text" variant="outlined" color = "secondary"
                                       defaultValue={this.state.studioYear} onChange={(event) => {
                                           this.setState({studioYear: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Страна" type="text" variant="outlined" color = "secondary"
                                       defaultValue={this.state.studioCountry} onChange={(event) => {
                                           this.setState({studioCountry: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <p> Картинка:
                                <input type="file" onChange={(event) => {
                                    this.setState({studioImage: event.target.files[0]})
                                }} />
                            </p>
                        </Box>
                        <Button  variant="contained" color="secondary" onClick={() => {
                            let data = new FormData();
                            data.append('name', this.state.studioName);
                            data.append('image', this.state.studioImage);
                            data.append('yearFoundation', this.state.studioYear);
                            data.append('country', this.state.studioCountry);
                            const config = {
                                headers: { 'content-type': 'multipart/form-data' }
                            };
                            axios.put(`http://${appConfig.host}:${+appConfig.port+1}/api/studio`, data, config)
                        }}>
                            Cоздать студию
                        </Button>
                            </Box>
                            <Box>
                        <h3>Удаление студии:</h3>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="id" type="text" variant="outlined" color = "secondary"
                                       onChange={(event) => {this.setState({deleteid: event.target.value})}}/>
                        </Box>
                        <Button variant="contained" color="secondary"
                                onClick={() => {remove('/studio', {id: this.state.deleteid})}}>
                            Удалить студию
                        </Button>
                            </Box>
                        </Box>
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={5}>
                        <Box style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }}>
                            <Box>
                        <h3>Добавление актера:</h3>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Имя" type="text" variant="outlined" color = "secondary"
                                       defaultValue={this.state.actorName} onChange={(event) => {
                                           this.setState({actorName: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Дата рождения" type="text" variant="outlined" color = "secondary"
                                       defaultValue={this.state.actorBirthDate} onChange={(event) => {
                                           this.setState({actorBirthDate: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Страна" type="text" variant="outlined" color = "secondary"
                                       defaultValue={this.state.actorCountry} onChange={(event) => {
                                           this.setState({actorCountry: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                                <InputLabel id="genre-label">Жанры:</InputLabel>
                                <Select multiple labelId="genre-label" id="select"
                                        value={this.state.actorGenre} onChange={(event) => {
                                            this.setState({actorGenre: event.target.value},
                                              () => {console.log("actor genre: ",this.state.actorGenre)});
                                        }}>
                                    {this.props.genres.map((item, index) => {
                                        return <MenuItem key={`genre-${index}`} value={item.id}>{item.name}</MenuItem>
                                    }) }
                                </Select>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                                <InputLabel id="film-label">Лучший фильм:</InputLabel>
                                <Select  labelId="film-label" id="select" value={this.state.actorFilm}
                                         onChange={(event) => {
                                             this.setState(
                                               {actorFilm: event.target.value},
                                               () => {console.log("actorFilm: ",this.state.actorFilm)}
                                               );
                                         }}>
                                    {this.props.films.map((item, index) => {
                                        return <MenuItem key={`film-${index}`} value={item.id}>{item.name}</MenuItem>
                                    }) }
                                </Select>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <p> Картинка:
                                <input type="file" onChange={(event) => {
                                    this.setState({actorImage: event.target.files[0]})
                                }} />
                            </p>
                        </Box>
                        <Button  variant="contained" color="secondary" onClick={() => {
                            let data = new FormData();
                            data.append('name', this.state.actorName);
                            data.append('image', this.state.actorImage);
                            data.append('birthDate', this.state.actorBirthDate);
                            data.append('country', this.state.actorCountry);
                            data.append('genreid', this.state.actorGenre);
                            data.append('magnumopusid', this.state.actorFilm);
                            const config = {
                                headers: { 'content-type': 'multipart/form-data' }
                            };
                            axios.put(`http://${appConfig.host}:${+appConfig.port+1}/api/actor`, data, config)
                        }}>
                            Cоздать актера
                        </Button>
                            </Box>
                            <Box>
                        <h3>Удаление актера:</h3>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="id" type="text" variant="outlined" color = "secondary"
                                       onChange={(event) => {this.setState({deleteid: event.target.value})}}/>
                        </Box>
                        <Button variant="contained" color="secondary" onClick={() => {
                            remove('/actor', {id: this.state.deleteid})
                        }}>
                            Удалить актера
                        </Button>
                            </Box>
                        </Box>
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={6}>
                        <Box style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }}>
                            <Box>
                        <h3>Cоздать фильм:</h3>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Название" type="text" variant="outlined" color = "secondary"
                                       defaultValue={this.state.filmName} onChange={(event) => {
                                           this.setState({filmName: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Год" type="text" variant="outlined" color = "secondary"
                                       defaultValue={this.state.filmYear} onChange={(event) => {
                                           this.setState({filmYear: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Страна" type="text" variant="outlined" color = "secondary"
                                       defaultValue={this.state.filmCountry} onChange={(event) => {
                                           this.setState({filmCountry: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <InputLabel id="genre1-label">Жанры:</InputLabel>
                            <Select multiple labelId="genre1-label" id="select" value={this.state.filmGenre}
                                    onChange={(event) => {
                                        this.setState({filmGenre: event.target.value}, () => {
                                        console.log("film genre: ",this.state.filmGenre)
                                    });
                            }}>
                                {this.props.genres.map((item, index) => {
                                    return <MenuItem key={`genre-${index}`} value={item.id}>{item.name}</MenuItem>
                                }) }
                            </Select>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <InputLabel id="actors-label">Актеры:</InputLabel>
                            <Select multiple labelId="actors-label" id="select" value={this.state.filmActor}
                                    onChange={(event) => {
                                        this.setState(
                                          {filmActor: event.target.value},
                                          () => {console.log("film actor: ",this.state.filmActor)}
                                          );
                                    }}>
                                {
                                    this.props.actors.map((item, index) => {
                                        return <MenuItem key={`actor-${index}`} value={item.id}>{item.name}</MenuItem>
                                    })
                                }
                            </Select>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <InputLabel id="producer-label">Режиссеры:</InputLabel>
                            <Select multiple labelId="producer-label" id="select" value={this.state.filmProducer}
                                    onChange={(event) => {
                                        this.setState(
                                          {filmProducer: event.target.value},
                                          () => {console.log("actor producer: ",this.state.filmProducer)}
                                          );
                                    }}>
                                {this.props.producers.map((item, index) => {
                                    return <MenuItem key={`producer-${index}`} value={item.id}>{item.name}</MenuItem>
                                }) }
                            </Select>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <InputLabel id="studio-label">Студия:</InputLabel>
                            <Select labelId="studio-label" id="select" value={this.state.filmStudio}
                                    onChange={(event) => {
                                        this.setState(
                                          {filmStudio: event.target.value},
                                      () => {console.log("actor studio: ",this.state.filmStudio)}
                                      );
                                    }}>
                                {this.props.studios.map((item, index) => {
                                    return <MenuItem key={`studio-${index}`} value={item.id}>{item.name}</MenuItem>
                                }) }
                            </Select>
                        </Box>
                            </Box>
                        <Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Длительность" type="number" variant="outlined" color = "secondary"
                                        defaultValue={this.state.filmDuration} onChange={(event) => {
                                            this.setState({filmDuration: event.target.value})
                                        }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Рейтинг" type="number" variant="outlined" color = "secondary"
                                       defaultValue={this.state.filmRating} onChange={(event) => {
                                           this.setState({filmRating: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Количество оценок" type="number" variant="outlined" color = "secondary"
                                       defaultValue={this.state.filmRatesAmount} onChange={(event) => {
                                           this.setState({filmRatesAmount: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Бюджет" type="number" variant="outlined" color = "secondary"
                                        defaultValue={this.state.filmBudget} onChange={(event) => {
                                            this.setState({filmBudget: event.target.value})
                                        }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Описание" type="text" multiline rowsMax="8" variant="outlined" color = "secondary"
                                       defaultValue={this.state.filmDescription} onChange={(event) => {
                                           this.setState({filmDescription: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <p>Картинка:</p>
                            <input type="file" onChange={(event) => {
                                this.setState({filmImage: event.target.files[0]})
                            }}/>
                        </Box>

                        <Button  variant="contained" color="secondary" onClick={() => {
                            let data = new FormData();
                            data.append('name', this.state.filmName);
                            data.append('image', this.state.filmImage);
                            data.append('year', this.state.filmYear);
                            data.append('country', this.state.filmCountry);
                            data.append('genreid', this.state.filmGenre);
                            data.append('duration', this.state.filmDuration);
                            data.append('studioid', this.state.filmStudio);
                            data.append('rating', this.state.filmRating);
                            data.append('budget', this.state.filmBudget);
                            data.append('producerid', this.state.filmProducer);
                            data.append('actorid', this.state.filmActor);
                            data.append('description', this.state.filmDescription);
                            data.append('ratesAmount', this.state.filmRatesAmount);
                            const config = {
                                headers: { 'content-type': 'multipart/form-data' }
                            };
                            axios.put(`http://${appConfig.host}:${+appConfig.port+1}/api/film`, data, config)
                        }}>
                            Cоздать фильм
                        </Button>
                        </Box>
                    </Box>
                        <h3>Удаление фильма:</h3>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="id" type="text" variant="outlined" color = "secondary"
                                       onChange={(event) => {this.setState({deleteid: event.target.value})}}/>
                        </Box>
                        <Button variant="contained" color="secondary" onClick={() => {
                            remove('/film', {id: this.state.deleteid})
                        }}>
                            Удалить фильм
                        </Button>
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={7}>
                        <Box style={{
                            display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'
                        }}>
                            <Box>
                        <h3>Добавление награды:</h3>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Название" type="text" variant="outlined" color = "secondary"
                                       defaultValue={this.state.awardName} onChange={(event) => {
                                           this.setState({awardName: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Номинация" type="text" variant="outlined" color = "secondary"
                                       defaultValue={this.state.awardNomination} onChange={(event) => {
                                           this.setState({awardNomination: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <InputLabel id="actor-label">Актер:</InputLabel>
                            <Select labelId="actor-label" id="select" value={this.state.awardActor}
                                    onChange={(event) => {
                                        this.setState(
                                          {awardActor: event.target.value},
                                          () => {console.log("award actor: ",this.state.awardActor)}
                                          );
                                    }}>
                                {this.props.actors.map((item, index) => {
                                    return <MenuItem key={`actor-${index}`} value={item.id}>{item.name}</MenuItem>
                                }) }
                            </Select>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <InputLabel id="producer-label">Режиссер:</InputLabel>
                            <Select labelId="producer-label" id="select" value={this.state.awardProducer}
                                onChange={(event) => {
                                    this.setState(
                                      {awardProducer: event.target.value},
                                      () => {console.log("award producer: ",this.state.awardProducer)}
                                      );
                                }}>
                                {this.props.producers.map((item, index) => {
                                    return <MenuItem key={`producer-${index}`} value={item.id}>{item.name}</MenuItem>
                                }) }
                            </Select>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                                <InputLabel id="film-label">Фильм:</InputLabel>
                                <Select labelId="film-label" id="select" value={this.state.awardFilm}
                                        onChange={(event) => {
                                            this.setState(
                                              {awardFilm: event.target.value},
                                              () => {console.log("award film: ",this.state.awardFilm)}
                                              );
                                        }}>
                                    {this.props.films.map((item, index) => {
                                        return <MenuItem key={`film-${index}`} value={item.id}>{item.name}</MenuItem>
                                    }) }
                                </Select>
                        </Box>
                        <Button  variant="contained" color="secondary" onClick={() => {
                            update('/award', {
                                name:this.state.awardName,
                                nomination: this.state.awardNomination,
                                actorid: this.state.awardActor,
                                producerid: this.state.awardProducer,
                                filmid: this.state.awardFilm
                            })}}>
                            Cоздать награду
                        </Button>
                            </Box>
                            <Box>
                        <h3>Удаление награды:</h3>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="id" type="text" variant="outlined" color = "secondary"
                                       onChange={(event) => {this.setState({deleteid: event.target.value})}}/>
                        </Box>
                        <Button variant="contained" color="secondary" onClick={() => {
                            remove('/award', {id: this.state.deleteid})
                        }}>
                            Удалить награду
                        </Button>
                            </Box>
                        </Box>
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={8}>
                        <Box style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }}>
                            <Box>
                            <h3>Добавление сеанса:</h3>
                        <Box style={styles.editInputWrapper}>
                                <InputLabel id="film-label">Фильм:</InputLabel>
                                <Select labelId="film-label" id="select" value={this.state.sessionFilm}
                                        onChange={(event) => {
                                            this.setState(
                                              {sessionFilm: event.target.value},
                                              () => {console.log("session film: ",this.state.sessionFilm)}
                                              );
                                        }}>
                                    {this.props.films.map((item, index) => {
                                        return <MenuItem key={`film-${index}`} value={item.id}>{item.name}</MenuItem>
                                    }) }
                                </Select>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Дата" type="text" variant="outlined" color = "secondary"
                                       defaultValue={this.state.sessionDate} onChange={(event) => {
                                           this.setState({sessionDate: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Время" type="text" variant="outlined" color = "secondary"
                                       defaultValue={this.state.sessionTime} onChange={(event) => {
                                           this.setState({sessionTime: event.target.value})
                                       }}/>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                                <InputLabel id="cinema-label">Кинотеатр:</InputLabel>
                                <Select labelId="cinema-label" id="select" value={this.state.sessionCinema}
                                        onChange={(event) => {
                                            this.setState(
                                              {sessionCinema: event.target.value},
                                              () => {console.log("session cinema: ",this.state.sessionCinema)}
                                              );
                                        }}>
                                    {this.props.cinemas.map((item, index) => {
                                        return <MenuItem key={`cinema-${index}`} value={item.id}>{item.name}</MenuItem>
                                    }) }
                                </Select>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                                <InputLabel id="hall-label">Зал:</InputLabel>
                                <Select labelId="hall-label" id="select" value={this.state.sessionHall}
                                        onChange={(event) => {
                                            this.setState(
                                              {sessionHall: event.target.value},
                                              () => {console.log("session hall: ",this.state.sessionHall)}
                                              );
                                        }}>
                                    {this.props.halls.map((item, index) => {
                                        return <MenuItem key={`hall-${index}`} value={item.id}>
                                            {item.number} зал, {item.cinema.name}
                                        </MenuItem>
                                    }) }
                                </Select>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="Цена билета" type="number" variant="outlined" color = "secondary"
                                       defaultValue={this.state.sessionPrice}
                                       onChange={(event) => {
                                           this.setState({sessionPrice: event.target.value})
                                       }}/>
                        </Box>
                        <Button  variant="contained" color="secondary" onClick={() => {
                            update('/session', {
                                filmid:this.state.sessionFilm,
                                date: this.state.sessionDate,
                                time: this.state.sessionTime,
                                cinemaid: this.state.sessionCinema,
                                price: this.state.sessionPrice,
                                cinemaHallid: this.state.sessionHall
                            })}}>
                            Cоздать сеанс
                        </Button>
                            </Box>
                            <Box>
                        <h3>Удаление сеанса:</h3>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="id" type="text" variant="outlined" color = "secondary"
                                       onChange={(event) => {this.setState({deleteid: event.target.value})}}/>
                        </Box>
                        <Button variant="contained" color="secondary" onClick={() => {
                            remove('/session', {id: this.state.deleteid})
                        }}>
                            Удалить сеанс
                        </Button>
                            </Box>
                        </Box>
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={9}>
                        <h3>Удаление пользователя:</h3>
                        <Box style={styles.editInputWrapper}>
                            <TextField label="id" type="text" variant="outlined" color = "secondary"
                                       onChange={(event) => {this.setState({deleteid: event.target.value})}}/>
                        </Box>
                        <Button variant="contained" color="secondary" onClick={() => {
                            remove('/user', {id: this.state.deleteid})
                        }}>
                            Удалить пользователя
                        </Button>
                    </TabPanel>
                </Box>
            </Box>
        </Box>}
            { !this.state.isAdmin && <p style={styles.filmTitle}>
                Вы должны обладать правами администратора, чтобы попасть на эту страницу
            </p>}
        </div>
    )
  }
}

function mapStateToProps(state) {
  return {
      isFetching: state.app.isFetching,
      genres: state.app.genres,
      films: state.app.films,
      filteredFilms: state.app.filteredFilms,
      cinemas: state.app.cinemas,
      studios: state.app.studios,
      actors: state.app.actors,
      producers: state.app.producers,
      halls: state.app.halls,
      token: state.app.token,
      user: state.app.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
      getGenres: get_genres,
      getFilms: get_films,
      getFilteredFilms: get_filtered_films,
      getCinemas: get_cinemas,
      getStudios: get_studios,
      getActors: get_actors,
      getProducers: get_producers,
      getHalls: get_halls,
      updateToken: update_token
  }, dispatch);
};

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Admin));
