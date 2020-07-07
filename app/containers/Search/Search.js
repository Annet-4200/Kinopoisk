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
import config from '../../../config';
import openSocket from 'socket.io-client';
import {Star, StarBorder } from '@material-ui/icons/';
import "../../components/Home//style.css";
import {Button, Box, InputLabel, Select, MenuItem, TextField} from "@material-ui/core";
import { withCookies, Cookies } from 'react-cookie';
import ListItem from "../../components/ListItem/ListItem";
import Slider from '@material-ui/core/Slider';
import Typography from "@material-ui/core/Typography";

const styles = {
    filmDataContainer: {
        display: 'flex',
        padding: '30px',
        backgroundColor: '#363636',
        borderRadius: '10px',
        boxShadow: '0 0 15px black',
        marginBottom: '60px',
        backgroundImage: 'linear-gradient(0deg, rgba(148,20,221,0.35) 0%, rgba(38,38,38,1) 100%)',
        flexDirection: "column",

    },
    filmDataPart: {
        width: '65%',
        justifyContent:'center',
        paddingLeft: 25,
        paddingTop: 25,
    },
    filmDataInner: {
        width: '50%',
        fontSize: '19px',

    },
    filmDataPartImage: {
        width: '35%',
        transform: "translateX(-15%)",
        display: 'flex',
        alignItems:"flex-end",
        flexDirection: 'column'
    },
    image: {
        width: '100%',
        height: 'auto',
        borderRadius: '10px',
        boxShadow: '0 0 15px black',
        marginBottom: '20px'
    },
    bigContainer: {
        width: '90%',
        maxWidth: '900px',
    },
    filmTitle: {
        fontSize: '40px',
        fontWeight: 'bold',
        marginTop:'20px',
        marginBottom: '25px',
        fontFamily: 'Oswald',
        letterSpacing: '4px',
        opacity: '0.75',
    },
    descriptionTitle: {
        fontSize: '30px',
        fontWeight: 'bold',
        marginBottom:'25px',
        fontFamily: 'Oswald',
        opacity: '0.75',
        letterSpacing: '4px',
    },
    editInputWrapper: {
        margin: '20px',
        width:'200px',
    },
    iconHover: {
        '&:hover': {
            color: 'primary',
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
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
        filmName: null,
        filmYear: null,
        filmCountry: null,
        filmGenre: [],
        filmStudio: null,
        filmRating: [],
        filmProducer: [],
        filmActor: [],
    };
    //FOR PRODUCTION (https) and delete port+1
    this.socket = openSocket(`http://${config.host}:${+config.port+1}`);
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
      this.props.getFilms();
      this.props.getGenres();
      this.props.getCinemas();
      this.props.getStudios();
      this.props.getActors();
      this.props.getProducers();
      this.props.getHalls();
      let params = {};
      if (this.props.name) {
          params.name = this.props.name
      }
      if (this.props.producer) {
          params.producer = this.props.producer
      }
      if (this.props.studio) {
        params.studio = this.props.studio
      }
      if (this.props.actor) {
          params.actor = this.props.actor
      }

      this.props.getFilteredFilms(params);
      console.log("Home: Component did mount")
  }

  handleSubmit(event) {
      let params = {};
      if (this.state.filmGenre) {
          params.genre = this.state.filmGenre
      }
      if (this.state.filmName) {
          params.name = this.state.filmName
      }
      if (this.state.filmProducer) {
          params.producer = this.state.filmProducer
      }
      if (this.state.filmStudio) {
          params.studio = this.state.filmStudio
      }
      if (this.state.filmActor) {
          params.actor = this.state.filmActor
      }
      if (this.state.filmCountry) {
          params.country = this.state.filmCountry
      }
      if (this.state.filmYear) {
          params.year = this.state.filmYear
      }
      if (this.state.filmRating) {
          params.rating = this.state.filmRating
      }
    this.props.getFilteredFilms(params);
  }

  render() {
    return (
        <Box style={styles.bigContainer}>
            <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <p style={styles.filmTitle}>Расширенный поиск по параметрам</p>
            </Box>
            <Box style={styles.filmDataContainer}>
                <Box style={styles.descriptionTitle}>Искать фильм: </Box>
                <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
                    <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                         <TextField style={{width:'300px', margin:'20px'}}  label="Полное или частичное название" type="text" variant="outlined" color = "secondary"
                                  onChange={(event) => {this.setState({filmName: event.target.value}, ()=>{console.log("name", this.state.filmName)})}}/>
                        <Typography id="range-slider" gutterBottom>
                            Рейтинг
                        </Typography>
                        <Slider style={{width:'300px', margin:'20px'}}
                                onChange={(event, value) => {this.setState({filmRating: value}, ()=>{console.log('rating',this.state.filmRating)})}}
                                valueLabelDisplay="auto" defaultValue={[5,8]} aria-labelledby="range-slider"
                                step={1} marks min={0} max={10}/>
                        <TextField style={styles.editInputWrapper} label="Страна" type="text" variant="outlined" color = "secondary"
                                   onChange={(event) => {this.setState({filmCountry: event.target.value})}}/>
                        <Box style={styles.editInputWrapper}>
                            <InputLabel id="genre1-label">Жанры:</InputLabel>
                            <Select
                              style={{width:'200px'}}
                              multiple
                              labelId="genre1-label"
                              id="select"
                              value={this.state.filmGenre}
                              onChange={(event) => {
                                  this.setState({
                                      filmGenre: event.target.value},
                                    () => {console.log("film genre: ",this.state.filmGenre)
                                  });
                              }}>
                                {this.props.genres.map((item, index) => {
                                    return <MenuItem key={`genre-${index}`} value={item.id}>{item.name}</MenuItem>
                                }) }
                            </Select>
                        </Box>

                    </Box>
                    <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                        <TextField style={styles.editInputWrapper} label="Год" type="text" variant="outlined" color = "secondary"
                                    onChange={(event) => {this.setState({filmYear: event.target.value})}}/>
                        <Box style={styles.editInputWrapper}>
                            <InputLabel id="studio-label">Студия:</InputLabel>
                            <Select
                              style={{width:'200px'}}
                              labelId="studio-label"
                              id="select"
                              onChange={(event) => {
                                  this.setState({
                                      filmStudio: event.target.value},
                                    () => {console.log("actor studio: ",this.state.filmStudio)
                                  });
                              }}>
                                {this.props.studios.map((item, index) => {
                                    return <MenuItem key={`studio-${index}`} value={item.id}>{item.name}</MenuItem>
                                }) }
                            </Select>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <InputLabel id="actors-label">Актеры:</InputLabel>
                            <Select
                              style={{width:'200px'}}
                              multiple labelId="actors-label"
                              id="select"
                              value={this.state.filmActor}
                              onChange={(event) => {
                                  this.setState({
                                      filmActor: event.target.value},
                                    () => {console.log("film actor: ",this.state.filmActor)
                                  });
                              }}>
                                {this.props.actors.map((item, index) => {
                                    return <MenuItem key={`actor-${index}`} value={item.id}>{item.name}</MenuItem>
                                }) }
                            </Select>
                        </Box>
                        <Box style={styles.editInputWrapper}>
                            <InputLabel id="producer-label">Режиссеры:</InputLabel>
                            <Select
                              style={{width:'200px'}}
                              multiple
                              labelId="producer-label"
                              id="select"
                              value={this.state.filmProducer}
                              onChange={(event) => {
                                  this.setState({
                                      filmProducer: event.target.value
                                  },
                                    () => {console.log("actor producer: ",this.state.filmProducer)
                                  });
                              }}>
                                {this.props.producers.map((item, index) => {
                                    return <MenuItem key={`producer-${index}`} value={item.id}>{item.name}</MenuItem>
                                }) }
                            </Select>
                        </Box>
                    </Box>
                </Box>
                <Box style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    margin: '0 30px 10px 0'
                }}>
                    <Button
                      style={{fontSize:'18px', width:'200px' }}
                      variant="contained"
                      color="primary"
                      onClick={this.handleSubmit}>
                    Поиск фильмов
                </Button> </Box>
            </Box>
            <Box style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <p style={styles.filmTitle}>Результаты поиска:</p>
                {(this.props.filteredFilms.length > 0) ? (this.props.filteredFilms.map(film => {
                    return(<ListItem  film={film} user={this.props.user}/>)})) : (
                      <p style={{
                          ...styles.filmTitle,
                          display: 'flex',
                          textAlign: 'center',
                          fontStyle:'none',
                          fontSize: '26px'
                      }}>
                          К сожалению, фильмы с такими фильтрами не найдены. Попробуйте ещё раз
                      </p>)}
            </Box>
        </Box>
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
      token: state.app.token
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

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Search));
