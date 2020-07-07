import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
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
import FilmCard from "../../components/Home/FilmCard";
import {Carousel} from "../../components/Carousel";
import "../../components/Home//style.css";
import {Button, InputLabel, Select, MenuItem, Box} from "@material-ui/core";
import { withCookies, Cookies } from 'react-cookie';
import {makeStyles} from "@material-ui/styles";

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
        marginBottom: '50px',
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
        maxWidth: '1200px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
    },
    filmTitle: {
        fontSize: '36px',
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginBottom:'40px',
        marginTop:'20px'
    },
    descriptionTitle: {
        fontSize: '46px',
        fontWeight: 'bold',
        marginBottom:'15px',
        fontFamily: 'Oswald',
        opacity: '0.25',
        letterSpacing: '4px'
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
    rating: {
        color: "#fd3838",
        fontSize:'40px',
        fontWeight: 'bold'
    }
};
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
        dayFilm: null,
        serial: null,
        popular1: null,
        popular2: null,
        popular3: null,
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

      console.log("Home: Component did mount");
      post(`/films`, {id:'2990b9da-c8ff-4123-af99-787074c490b7'}).then(res => {
          this.setState({dayFilm: res});
          console.log(res);
      });
      post(`/films`, {genre: 'e5165d5e-b80b-44ba-83b2-f0284f5692b9'}).then(res => {
          this.setState({serial: res});
          console.log(res);
      });
      post(`/films`, {id:'2990b9da-c8ff-4123-af99-787074c490b7'}).then(res => {
          this.setState({popular1: res});
          console.log(res);
      });
      post(`/films`, {id:'1dcf6ead-0e2a-4846-97c6-b8b2ea54308f'}).then(res => {
          this.setState({popular2: res});
          console.log(res);
      });
      post(`/films`, {id:'f5e13b4d-0e52-4765-98f6-d50a7edbb36c'}).then(res => {
          this.setState({popular3: res});
          console.log(res);
      });
  }

  render() {
    return (
        <Box style = {styles.bigContainer}>
            {this.state.dayFilm && <Box style={styles.bigContainer}>
            <Box style={{...styles.filmDataContainer, width: '100%'}}>
                {this.props.films && <Carousel films={this.props.films}/>}
            </Box>
                <Box style={{display: 'flex',
                justifyContent :"space-between",
                alignItems: 'flex-start',
                flexDirection: 'row'}}>
                <Box style={{ width:'57%', flexDirection: 'column'}}>
                    <Box style={styles.descriptionTitle}><h3>Фильм дня:</h3></Box>
                    <Box><FilmCard film={this.state.dayFilm[0]} user={this.props.user}/></Box>
                </Box>
                <Box style={{ width:'37%',flexDirection: 'column'}}>
                    <Box style={styles.descriptionTitle}> <h3>B кинотеатрах: </h3> </Box>
                    <Box style={{...styles.filmDataContainer, fontSize: '20px', fontWeight:'bold'}}>
                        <ul style={{paddingInlineStart:'20px'}}>
                            {
                                this.state.dayFilm[0]
                                && this.state.dayFilm[0].cinemas
                                && this.state.dayFilm[0].cinemas.map((item) => {
                                    return (<li key={item.name}>{item.city} - {item.name}</li>)
                                })}
                        </ul>
                    </Box>
                </Box>
                </Box>
                <Box style={{
                    display: 'flex',
                    justifyContent :"space-between",
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                    marginTop: 50
                }}>
                    <Box style={{ width:'47%', flexDirection: 'column'}}>
                        <Box style={styles.descriptionTitle}><h3>Лучшее из сериалов:</h3></Box>
                        <Box style={{...styles.filmDataContainer,flexDirection: 'column', fontSize: '20px'}}>
                            <Box style={{
                                display: 'flex',
                                justifyContent :"flex-start",
                                alignItems: 'center',
                                flexDirection: 'row',
                                width:'100%',
                                marginBottom:10
                            }}>
                                <Box style={{width:'20%', marginRight:40}}>
                                    {
                                        this.state.serial && ((this.state.serial[0].image) ? (
                                            <img style={styles.image} src={
                                                `http://localhost:7789/uploads/${this.state.serial[0].image}`
                                            }/>
                                        )
                                        : (
                                            <img style={styles.image} src={
                                                `http://localhost:7789/uploads/noImage.jpg`
                                            }/>
                                        )
                                    )
                                    }
                                </Box>
                                <Box style={{width:'50%'}}>
                                    {this.state.serial && <Link to={`/film/${this.state.serial[0].id}`}>
                                        {this.state.serial[0] && <p>{this.state.serial[0].name}</p>}
                                    </Link>}
                                    {this.state.serial && <p>
                                        {this.state.serial[0].year}, {this.state.serial[0].genre[0].name}, {this.state.serial[0].genre[1].name}
                                    </p>}
                                    {this.state.serial && <p>{this.state.serial[0].actors[0].name}</p>}
                                </Box>
                                <Box style={{display: 'flex', justifyContent :"flex-start", alignItems: 'flex-end'}}>
                                    {this.state.serial && <p style={styles.rating}>{this.state.serial[0].rating}</p>}
                                </Box>
                            </Box>

                            <Box style={{
                                display: 'flex',
                                justifyContent :"flex-start",
                                alignItems: 'center',
                                flexDirection: 'row',
                                width:'100%',
                                marginBottom:10
                            }}>
                                <Box style={{width:'20%', marginRight:40}}>
                                    {this.state.serial && ((this.state.serial[1].image) ? (
                                        <img style={styles.image} src={
                                            `http://localhost:7789/uploads/${this.state.serial[1].image}`
                                        }/>
                                      )
                                      : (
                                        <img style={styles.image} src={`http://localhost:7789/uploads/noImage.jpg`}/>
                                        )
                                    )}
                                </Box>
                                <Box style={{width:'50%'}}>
                                    {this.state.serial && <Link to={`/film/${this.state.serial[1].id}`}>
                                        {this.state.serial[1] && <p>{this.state.serial[1].name}</p>}
                                    </Link>}
                                    {this.state.serial && <p>
                                        {this.state.serial[1].year}, {this.state.serial[1].genre[0].name}, {this.state.serial[1].genre[1].name}
                                    </p>}
                                    {this.state.serial && <p>{this.state.serial[1].actors[0].name}</p>}
                                </Box>
                                <Box style={{display: 'flex', justifyContent :"flex-start", alignItems: 'flex-end'}}>
                                    {this.state.serial && <p style={styles.rating}>{this.state.serial[1].rating}</p>}
                                </Box>
                            </Box>

                            <Box style={{
                                display: 'flex',
                                justifyContent :"flex-start",
                                alignItems: 'center',
                                flexDirection: 'row',
                                width:'100%',
                                marginBottom:10
                            }}>
                                <Box style={{width:'20%', marginRight:40}}>
                                    {this.state.serial && ((this.state.serial[2].image) ? (
                                      <img style={styles.image} src={
                                          `http://localhost:7789/uploads/${this.state.serial[2].image}`
                                      }/>
                                      ) : (
                                        <img style={styles.image} src={`http://localhost:7789/uploads/noImage.jpg`}/>
                                        ))}
                                </Box>
                                <Box style={{width:'50%'}}>
                                    {this.state.serial && <Link to={`/film/${this.state.serial[2].id}`}>
                                        {this.state.serial[2] && <p>{this.state.serial[2].name}</p>}
                                    </Link>}
                                    {this.state.serial && <p>
                                        {this.state.serial[2].year}, {this.state.serial[2].genre[0].name}, {this.state.serial[2].genre[1].name}
                                    </p>}
                                    {this.state.serial && <p>{this.state.serial[2].actors[0].name}</p>}
                                </Box>
                                <Box style={{display: 'flex', justifyContent :"flex-start", alignItems: 'flex-end'}}>
                                    {this.state.serial && <p style={styles.rating}>{this.state.serial[2].rating}</p>}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box style={{ width:'47%', flexDirection: 'column'}}>
                        <Box style={styles.descriptionTitle}><h3>Популярное в мире:</h3></Box>
                        <Box style={{...styles.filmDataContainer, flexDirection: 'column', fontSize: '20px'}}>
                            <Box style={{
                                display: 'flex',
                                justifyContent :"flex-start",
                                alignItems: 'center',
                                flexDirection: 'row',
                                width:'100%',
                                marginBottom:10
                            }}>
                                <Box style={{width:'20%', marginRight:40}}>
                                    {this.state.popular1 && ((this.state.popular1[0].image) ? (
                                      <img style={styles.image} src={
                                          `http://localhost:7789/uploads/${this.state.popular1[0].image}`
                                      }/>
                                      ) : (
                                        <img style={styles.image} src={`http://localhost:7789/uploads/noImage.jpg`}/>
                                        ))}
                                </Box>
                                <Box style={{width:'50%'}}>
                                    {this.state.popular1 && <Link to={`/film/${this.state.popular1[0].id}`}>
                                        {this.state.popular1 && <p>{this.state.popular1[0].name}</p>}
                                    </Link>}
                                    {this.state.popular1 && <p>
                                        {this.state.popular1[0].year}, {this.state.popular1[0].genre[0].name}, {this.state.popular1[0].genre[1].name}
                                    </p>}
                                    {this.state.popular1 && <p>{this.state.popular1[0].actors[0].name}</p>}
                                </Box>
                                <Box style={{display: 'flex', justifyContent :"flex-start", alignItems: 'flex-end'}}>
                                    {this.state.popular1 && <p style={styles.rating}>{this.state.popular1[0].rating}</p>}
                                </Box>
                            </Box>

                            <Box style={{
                                display: 'flex',
                                justifyContent :"flex-start",
                                alignItems: 'center',
                                flexDirection: 'row',
                                width:'100%',
                                marginBottom:10
                            }}>
                                <Box style={{width:'20%', marginRight:40}}>
                                    {this.state.popular2 && ((this.state.popular2[0].image) ? (
                                          <img style={styles.image} src={
                                              `http://localhost:7789/uploads/${this.state.popular2[0].image}`
                                          }/>
                                      )
                                      : (
                                            <img style={styles.image} src={
                                                `http://localhost:7789/uploads/noImage.jpg`
                                            }/>
                                        ))}
                                </Box>
                                <Box style={{width:'50%'}}>
                                    {this.state.popular2 && <Link to={`/film/${this.state.popular2[0].id}`}>
                                        {this.state.popular2[0] && <p>{this.state.popular2[0].name}</p>}
                                    </Link>}
                                    {this.state.popular2 && <p>
                                        {this.state.popular2[0].year}, {this.state.popular2[0].genre[0].name}, {this.state.popular2[0].genre[1].name}
                                    </p>}
                                    {this.state.popular2 && <p>{this.state.popular2[0].actors[0].name}</p>}
                                </Box>
                                <Box style={{display: 'flex', justifyContent :"flex-start", alignItems: 'flex-end'}}>
                                    {this.state.popular2 && <p style={styles.rating}>{this.state.popular2[0].rating}</p>}
                                </Box>
                            </Box>

                            <Box style={{
                                display: 'flex',
                                justifyContent :"flex-start",
                                alignItems: 'center',
                                flexDirection: 'row',
                                width:'100%',
                                marginBottom:10
                            }}>
                                <Box style={{width:'20%', marginRight:40}}>
                                    {this.state.popular3 && ((this.state.popular3[0].image) ? (
                                          <img style={styles.image}
                                            src={`http://localhost:7789/uploads/${this.state.popular3[0].image}`}/>
                                        )
                                      : (
                                            <img style={styles.image} src={`http://localhost:7789/uploads/noImage.jpg`}/>
                                        )
                                    )}
                                </Box>
                                <Box style={{width:'50%'}}>
                                    {this.state.popular3 && <Link to={`/film/${this.state.popular3[0].id}`}>
                                        {this.state.popular3[0] && <p>{this.state.popular3[0].name}</p>}
                                    </Link>}
                                    {this.state.popular3 && <p>
                                        {this.state.popular3[0].year}, {this.state.popular3[0].genre[0].name}, {this.state.popular3[0].genre[1].name}
                                    </p>}
                                    {this.state.popular3 && <p>{this.state.popular3[0].actors[0].name}</p>}
                                </Box>
                                <Box style={{display: 'flex', justifyContent :"flex-start", alignItems: 'flex-end'}}>
                                    {this.state.popular3 && <p style={styles.rating}>{this.state.popular3[0].rating}</p>}
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
             </Box>}
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
      user: state.app.user,
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

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Home));
