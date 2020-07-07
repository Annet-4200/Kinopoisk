import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux';
import { get, post, update, remove } from '../../fetch';
import config from '../../../config';
import openSocket from 'socket.io-client';
import appConfig from '../../../config';
import "../../components/Home//style.css";
import {Button, InputLabel, Select, MenuItem, TextField, Box} from "@material-ui/core";
import { withCookies, Cookies } from 'react-cookie';
import FilmCard from "../../components/Home/FilmCard";
import axios from "axios";
import {get_genres, get_films} from "../../actions/indexActions";

const styles = {
    filmDataContainer: {
        display: 'flex',
        padding: '30px',
        backgroundColor: '#363636',
        borderRadius: '10px',
        boxShadow: '0 0 15px black',
        marginBottom: '60px',
        backgroundImage: 'linear-gradient(0deg, rgba(148,20,221,0.35) 0%, rgba(38,38,38,1) 100%)',
    },
    filmDataPart: {
        width: '60%',
        justifyContent:'center',
        padding: '25px',
        paddingLeft: 0,
        paddingBottom: 0
    },
    filmDataInner: {
        width: '100%',
        fontSize: '19px',
        display: 'flex',
        flexDirection: 'row',
        borderRadius: '10px',
        marginBottom: '20px',
        padding:'10px'
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
        fontSize: '46px',
        fontWeight: 'bold',
        marginBottom:'25px',
        fontFamily: 'Oswald',
        opacity: '0.25',
        letterSpacing: '4px',
    },
    editInputWrapper: {
        margin: '15px',
        width:'300px',
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
const requestUrl = `${appConfig.host}`;
const requestPort = `${appConfig.port}`;
const port = +config.port + 1;

class Actor extends Component {
  constructor(props) {
    super(props);
    this.state = {
        actor: null,

        actorName: '',
        actorBirthDate: '',
        actorCountry: '',
        actorGenre: [],
        actorImage: null,
        actorFilm: '',
        isAdmin: false,
    };
    this.socket = openSocket(`http://${config.host}:${+config.port+1}`);
  }

  componentDidMount() {
      this.props.getGenres();
      this.props.getFilms();
      if (this.props.user === "5aaccb7c-1b05-4283-a50e-5b74437417ea") {
          this.setState({isAdmin: true});
      }
      post('/actor', {id: this.props.id}).then(res => {
          this.setState({actor: res});
          console.log(res);
      });
      console.log("Actor: Component did mount");
  }

  render() {
    return (
        <Box style={styles.bigContainer}>
            <Box style={styles.filmDataContainer}>
                <Box style={styles.filmDataPartImage}>
                    {this.state.actor && ((this.state.actor.image) ? (
                      <img style={styles.image} src={`http://localhost:7789/uploads/${this.state.actor.image}`}/>
                      ) : (
                        <img style={styles.image} src={`http://localhost:7789/uploads/noImage.jpg`}/>
                        ))}
                </Box>
                <Box style={styles.filmDataPart}>
                    <p style={styles.filmTitle}>
                        {this.state.actor && this.state.actor.name && this.state.actor.name}
                    </p>
                    <Box style={{display: 'flex', flexDirection:'column'}}>
                        <Box style={styles.filmDataInner}>
                            <Box style={{color: '#989898', width: '35%', fontSize: '20px'}}>
                                <p>дата рождения</p>
                                <hr size={1} color={'#989898'}/>
                                <p>страна</p>
                                <hr size={1} color={'#989898'}/>
                                <p>жанр</p>
                            </Box>
                            <Box style={{width: '65%', fontSize: '20px'}}>
                                <p>{this.state.actor && this.state.actor.birthDate && this.state.actor.birthDate}</p>
                                <hr size={1} color={'#989898'}/>
                                <p>{this.state.actor && this.state.actor.country && this.state.actor.country}</p>
                                <hr size={1} color={'#989898'}/>
                                <p>{this.state.actor && this.state.actor.genre && this.state.actor.genre.map((item) => item.name).join(', ') }</p>
                            </Box>
                        </Box>
                        <Box style={{...styles.filmDataInner, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                            <p style={{ flexDirection:'column', display:'flex', alignItems: 'center',
                                fontFamily:'Oswald', fontSize:'35px', color: "#958e8e", letterSpacing:'3px'}}>Фильмы</p>
                            <ul style={{listStyleType: 'none', paddingInlineStart: '0px', width: '60%'}}>
                                {this.state.actor && this.state.actor.films && this.state.actor.films.map((item) => {
                                    return (<li key={item.id} style={{fontSize: '20px', padding: '5px',
                                        backgroundColor: "#2a272d", borderRadius:'5px', display:'flex', justifyContent:'center'}}>
                                        <Link to={`/film/${item.id}`}> {item.name} </Link>
                                    </li>)
                                })}
                            </ul>
                            {this.state.actor && <Link to={{pathname: `/search/actor/${this.state.actor.id}`}}>
                                <Button variant="contained" color="secondary">Поиск по фильмам актера</Button></Link>}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box style={{display: 'flex',
                justifyContent :"space-between",
                alignItems: 'flex-start',
                flexDirection: 'column'}}>
                <Box style={{ width:'80%', flexDirection: 'column'}}>
                     <Box style={styles.descriptionTitle}><h3>Лучший фильм:</h3></Box>
                     <Box >
                         {
                            this.state.actor && this.state.actor.magnumOpus && this.state.actor.magnumOpus.name
                            && <FilmCard  film={this.state.actor.magnumOpus} user={this.props.user}/>
                         }
                     </Box>
                </Box>
                <Box style={{ width:'80%',flexDirection: 'column'}}>
                    <Box style={styles.descriptionTitle}> <h3>Награды: </h3> </Box>
                    <Box
                      style={{...styles.filmDataContainer, fontSize: '22px', fontWeight:'bold'}}
                    >
                        <ul style={{padding: 0}}>
                            {
                                this.state.actor && this.state.actor.award && this.state.actor.award.map((item) => {
                                    return (<li>{item.name} - {item.nomination}</li>)
                                })
                            }
                        </ul>
                    </Box>
                </Box>
            </Box>

            {this.state.isAdmin && <Box style={{...styles.filmDataContainer,flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', width:'max-content', marginTop: 40}}>
                  <h3 style={styles.editInputWrapper}>Редактирование актера:</h3>
                  <p>{this.state.actor && <TextField  label="Имя" type="text" variant="outlined" color = "secondary"
                                                    defaultValue={this.state.actor.name} onChange={(event) => {this.setState({actorName: event.target.value})}}/>}</p>
                  <p>{this.state.actor && <TextField label="Дата рождения" type="text" variant="outlined" color = "secondary"
                                                     defaultValue={this.state.actor.birthDate} onChange={(event) => {this.setState({actorBirthDate: event.target.value})}}/>}</p>
                  <p>{this.state.actor && <TextField label="Страна" type="text" variant="outlined" color = "secondary"
                                                     defaultValue={this.state.actor.country} onChange={(event) => {this.setState({actorCountry: event.target.value})}}/>}</p>
                  <p>
                      <InputLabel id="genre-label">Жанры:</InputLabel>
                      <Select
                        multiple labelId="genre-label" id="select" value={this.state.actorGenre}
                        onChange={(event) => {
                            this.setState({actorGenre: event.target.value}, () => {
                                console.log("actor genre: ",this.state.actorGenre)
                            });
                        }}>
                          {
                              this.props.genres.map((item, index) => {
                                  return <MenuItem key={`genre-${index}`} value={item.id}>{item.name}</MenuItem>
                              })
                          }
                      </Select>
                  </p>
                  <p>
                      <InputLabel id="film-label">Лучший фильм:</InputLabel>
                      <Select  labelId="film-label" id="select" value={
                          this.state.actorFilm} onChange={(event) => {
                              this.setState({actorFilm: event.target.value}, () => {
                                  console.log("actorFilm: ",this.state.actorFilm)
                              });}}>
                          {
                              this.props.films.map((item, index) => {
                                  return <MenuItem key={`film-${index}`} value={item.id}>{item.name}</MenuItem>
                              })
                          }
                      </Select>
                  </p>
                  <p style={styles.editInputWrapper}> Картинка:
                      <input type="file" onChange={(event) => {
                          this.setState({actorImage: event.target.files[0]})
                      }} />
                  </p>

              <Button  variant="contained" color="secondary" onClick={() => {
                  let data = new FormData();
                  data.append('id', this.state.actor.id);
                  data.append('name', this.state.actorName);
                  data.append('image', this.state.actorImage);
                  data.append('birthDate', this.state.actorBirthDate);
                  data.append('country', this.state.actorCountry);
                  data.append('genreid', this.state.actorGenre);
                  data.append('magnumopusid', this.state.actorFilm);
                  const config = {
                      headers: { 'content-type': 'multipart/form-data' }
                  };
                  axios.post(`http://${appConfig.host}:${+appConfig.port+1}/api/actor/edit`, data, config)
              }}>
                  Редактировать актера
              </Button>
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
      user: state.app.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
      getGenres: get_genres,
      getFilms: get_films,
  }, dispatch);
};

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Actor));
