import axios from "axios";
import { post } from '../../fetch';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import {
    get_genres,
    get_studios,
    get_actors,
    get_producers, update_token
} from "../../actions/indexActions";
import config from '../../../config';
import appConfig from '../../../config';
import "../../components/Home//style.css";
import openSocket from 'socket.io-client';
import { withCookies, Cookies } from 'react-cookie';
import Star from '@material-ui/icons/Stars';
import { Button, InputLabel, Select, MenuItem, TextField, Box } from "@material-ui/core";

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
    paddingLeft: 0
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
    marginBottom:'40px',
    marginTop:'20px',
    fontFamily: 'Oswald',
    letterSpacing: '4px'
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

};

class Film extends Component {
  constructor(props) {
    super(props);
    this.state = {
        film: null,
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
        isAdmin: false,
    };
    //FOR PRODUCTION (https) and delete port+1
    this.socket = openSocket(`http://${config.host}:${+config.port+1}`);
  }

  componentDidMount() {
      this.props.getGenres();
      this.props.getStudios();
      this.props.getActors();
      this.props.getProducers();
      if (this.props.user === "5aaccb7c-1b05-4283-a50e-5b74437417ea"){
         this.setState({isAdmin: true});
      }
      post('/films', {id: this.props.id}).then(res => {
          this.setState({film: res[0]});
      });
      console.log("Film: Component did mount");
  }

  render() {
      let ageLimit = 0;
      this.state.film && this.state.film.genre && this.state.film.genre.map((item) => {if(item.ageLimit>ageLimit){ageLimit = item.ageLimit}});
    return (
        <Box style={styles.bigContainer}>
          <Box style={styles.filmDataContainer}>
            <Box style={styles.filmDataPartImage}>
              {
                this.state.film && ((this.state.film.image)
                  ? (
                      <img style={styles.image} src={`http://localhost:7789/uploads/${this.state.film.image}`}/>
                  )
                  : (
                      <img style={styles.image} src={`http://localhost:7789/uploads/noImage.jpg`}/>
                    )
                )
              }
              <Button style={styles.MuiButtonAddToWatch} onClick={()=> {
                post('/addToWatch', {filmid: this.state.film.id, userid: this.props.user})
              }}>
                + в "Посмотреть позже"
              </Button>
              <Button style={styles.MuiButtonAddToWatch} onClick={()=> {
                post('/addWatched', {filmid: this.state.film.id, userid: this.props.user})
              }}>
                + в "Просмотренные"
              </Button>
              <Button style={styles.MuiButtonAddToWatch} onClick={()=> {
                post('/addFavourite', {filmid: this.state.film.id, userid: this.props.user})
              }}>
                + в "Любимые"
              </Button>
            </Box>
            <Box style={styles.filmDataPart}>
              <p style={styles.filmTitle}>{this.state.film && this.state.film.name && this.state.film.name}</p>
              <Box style={{display: 'flex', flexDirection: 'column'}}>
                <Box style={styles.filmDataInner}>
                  <Box style={{color:'#989898', width:'35%',  fontSize: '20px'}}>
                    <p>год</p>
                    <hr size={1} color={'#989898'}/>
                    <p>страна</p>
                    <hr size={1} color={'#989898'}/>
                    <p>жанр</p>
                    <hr size={1} color={'#989898'}/>
                    <p>бюджет</p>
                    <hr size={1} color={'#989898'}/>
                    <p>длительность</p>
                    <hr size={1} color={'#989898'}/>
                    <p>студия</p>
                    <hr size={1} color={'#989898'}/>
                    <p>возраст</p>
                    <hr size={1} color={'#989898'}/>
                    <p>награды</p>
                  </Box>
                  <Box style={{ width:'65%', fontSize: '20px'}}>
                    <p>{this.state.film && this.state.film.year && this.state.film.year}</p>
                    <hr size={1} color={'#989898'}/>
                    <p>{this.state.film && this.state.film.country && this.state.film.country}</p>
                    <hr size={1} color={'#989898'}/>
                    <p>
                      {
                        this.state.film
                        && this.state.film.genre
                        && this.state.film.genre.map((item) => (item.name)).join(', ')
                      }
                    </p>
                    <hr size={1} color={'#989898'}/>
                    <p>{this.state.film && this.state.film.budget && this.state.film.budget} $</p>
                    <hr size={1} color={'#989898'}/>
                    <p>{this.state.film && this.state.film.duration && this.state.film.duration}</p>
                    <hr size={1} color={'#989898'}/>
                    <p>
                      {
                        this.state.film
                        && this.state.film.studio
                        && <Link to={`/studio/${this.state.film.studio.id}`}> {this.state.film.studio.name}</Link>
                      }
                    </p>
                    <hr size={1} color={'#989898'}/>
                    <p>{this.state.film && this.state.film.genre && ageLimit}+</p>
                    <hr size={1} color={'#989898'}/>
                    <ul>{this.state.film && this.state.film.award && this.state.film.award.map((item) => {
                      return (<li key={item.name}>{`${item.name} - ${item.nomination}`}</li>)
                    })}</ul>
                  </Box>
                </Box>
                <Box style={{
                  ...styles.filmDataInner,
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}>
                  <Box style={{width:'45%'}}>
                    <p style={{ flexDirection:'column', display:'flex', alignItems: 'center',
                      fontFamily:'Oswald', fontSize:'35px', color: "#958e8e", letterSpacing:'3px'}}>Актеры</p>
                    <ul style={{listStyleType: 'none', paddingInlineStart: '0px'}}>
                      {this.state.film && this.state.film.actors && this.state.film.actors.map((item) => {
                        return (<li key={item.id} style={{fontSize: '20px', padding: '5px',
                          backgroundColor: "#2a272d", borderRadius:'5px', display:'flex', justifyContent:'center'}}>
                          <Link to={`/actor/${item.id}`}> {item.name} </Link>
                        </li>)
                      })}
                    </ul>
                  </Box>
                  <Box style={{width:'45%'}}>
                    <p style={{ flexDirection:'column', display:'flex', alignItems: 'center',
                      fontFamily:'Oswald', fontSize:'35px', color: "#958e8e", letterSpacing:'3px'}}>Режиссеры </p>
                    <ul style={{listStyleType: 'none', paddingInlineStart: '0px'}}>
                      {this.state.film && this.state.film.producer && this.state.film.producer.map((item) => {
                        return (<li key={item.id} style={{fontSize: '20px', padding: '5px',
                          backgroundColor: "#2a272d", borderRadius:'5px', display:'flex', justifyContent:'center'}}>
                          <Link to={`/producer/${item.id}`}> {item.name} </Link>
                        </li>)
                      })}
                    </ul>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box style={{display: 'flex', justifyContent :"space-between", alignItems: 'flex-start', flexDirection: 'row'}}>
            <Box style={{ width:'45%', flexDirection: 'column'}}>
              <Box style={styles.descriptionTitle}><h3>Описание:</h3></Box>
              <Box style={{...styles.filmDataContainer, fontSize: '19px'}}>
                <p>{this.state.film && this.state.film.description && this.state.film.description}</p>
              </Box>
            </Box>
            <Box style={{ width:'45%',flexDirection: 'column'}}>
              <Box style={styles.descriptionTitle}> <h3>В кинотеатрах: </h3> </Box>
              <Box style={{
                ...styles.filmDataContainer,
                fontSize: '22px', fontWeight:'bold'
              }}>
              <ul>
                {
                  this.state.film
                  && this.state.film.cinemas
                  && this.state.film.cinemas.map((item) => <li>{item.city} - {item.name}</li>)
                }
              </ul>
              </Box>
            </Box>
          </Box>
          <Box style={{display: 'flex', justifyContent :"flex-start", alignItems: 'center', flexDirection: 'column'}}>
            <Box style={styles.descriptionTitle}>
              <h3>Оценить фильм:</h3>
            </Box>
            <Box style={{display: 'flex', justifyContent :"center", alignItems: 'center', flexDirection: 'row'}}>
              <Box style={{flexDirection: 'row', display: 'flex' }}>
                <Box style={{flexDirection: 'column', display: 'flex',alignItems: 'center'}}>
                  <Star
                    color={this.state.film && +this.state.film.rating > 0 ? 'primary' : "secondary"}
                    fontSize="large" style={styles.iconHover}/>
                  <h3>1</h3>
                </Box>
                <Box style={{flexDirection: 'column', display: 'flex',alignItems: 'center'}}>
                  <Star
                    color={this.state.film && +this.state.film.rating > 1 ? 'primary' : "secondary"}
                    fontSize="large" style={styles.iconHover}/>
                  <h3>2</h3>
                </Box>
                <Box style={{flexDirection: 'column', display: 'flex',alignItems: 'center'}}>
                  <Star
                    color={this.state.film && +this.state.film.rating > 2 ? 'primary' : "secondary"}
                    fontSize="large" style={styles.iconHover}/>
                  <h3>3</h3>
                </Box>
                <Box style={{flexDirection: 'column', display: 'flex',alignItems: 'center'}}>
                  <Star
                    color={this.state.film && +this.state.film.rating > 3 ? 'primary' : "secondary"}
                    fontSize="large" style={styles.iconHover}/>
                  <h3>4</h3>
                </Box>
                <Box style={{flexDirection: 'column', display: 'flex',alignItems: 'center'}}>
                  <Star
                    color={this.state.film && +this.state.film.rating > 4 ? 'primary' : "secondary"}
                    fontSize="large" style={styles.iconHover}/>
                  <h3>5</h3>
                </Box>
                <Box style={{flexDirection: 'column', display: 'flex',alignItems: 'center'}}>
                    <Star
                      color={this.state.film && +this.state.film.rating > 5 ? 'primary' : "secondary"}
                      fontSize="large" style={styles.iconHover}/>
                    <h3>6</h3>
                </Box>
                <Box style={{flexDirection: 'column', display: 'flex',alignItems: 'center'}}>
                    <Star
                      color={this.state.film && this.state.film.rating > 6 ? 'primary' : "secondary"}
                      fontSize="large" style={styles.iconHover}/>
                    <h3>7</h3>
                </Box>
                <Box style={{flexDirection: 'column', display: 'flex',alignItems: 'center'}}>
                    <Star
                      color={this.state.film && +this.state.film.rating > 7 ? 'primary' : "secondary"}
                      fontSize="large" style={styles.iconHover}/>
                    <h3>8</h3>
                </Box>
                <Box style={{flexDirection: 'column', display: 'flex',alignItems: 'center'}}>
                    <Star
                      color={this.state.film && +this.state.film.rating > 8 ? 'primary' : "secondary"}
                      fontSize="large" style={styles.iconHover}/>
                    <h3>9</h3>
                </Box>
                <Box style={{flexDirection: 'column', display: 'flex',alignItems: 'center'}}>
                    <Star
                      color={this.state.film && +this.state.film.rating > 9 ? 'primary' : 'secondary'}
                      fontSize="large" style={styles.iconHover}/>
                    <h3>10</h3>
                </Box>
                </Box>
                <h1 style={{fontSize: "50px", marginLeft: '30px'}} >{this.state.film && this.state.film.rating} </h1>
            </Box>
          </Box>
          {this.state.isAdmin && <Box style={{
            ...styles.filmDataContainer,
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            width:'max-content',
            marginTop: 40
          }}>
            <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
              <Box>
                <h3 style={styles.editInputWrapper}>Редактирование фильма:</h3>
                  <Box style={styles.editInputWrapper}>
                    {this.state.film && <TextField label="Название" type="text" variant="outlined" color = "secondary"
                                                  defaultValue={this.state.film.name}
                                                  onChange={(event) => {
                                                    this.setState({filmName: event.target.value})
                                                  }}/>}
                  </Box>
                  <Box style={styles.editInputWrapper}>
                    {this.state.film && <TextField label="Год" type="text" variant="outlined" color = "secondary"
                                                 defaultValue={this.state.film.year}
                                                 onChange={(event) => {
                                                   this.setState({filmYear: event.target.value})
                                                 }}/>}
                  </Box>
                  <Box style={styles.editInputWrapper}>
                    {this.state.film && <TextField label="Страна" type="text" variant="outlined" color = "secondary"
                                          defaultValue={this.state.film.country}
                                          onChange={(event) => {
                                            this.setState({filmCountry: event.target.value})
                                          }}/>}
                  </Box>
                  <Box style={styles.editInputWrapper}>
                    <InputLabel id="genre1-label">Жанры:</InputLabel>
                      <Select multiple labelId="genre1-label" id="select" value={this.state.filmGenre}
                              onChange={(event) => {
                                this.setState({
                                  filmGenre: event.target.value},
                                  () => {console.log("film genre: ",this.state.filmGenre)
                                });
                              }}>
                          {this.props.genres.map((item, index) => {
                            return <MenuItem
                              key={`genre-${index}`}
                              value={item.id}>
                              {item.name}
                            </MenuItem>}) }
                      </Select>
                  </Box>
                  <Box style={styles.editInputWrapper}>
                      <InputLabel id="actors-label">Актеры:</InputLabel>
                      <Select multiple labelId="actors-label"
                              id="select" value={this.state.filmActor}
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
                      <Select multiple labelId="producer-label" id="select" value={this.state.filmProducer}
                              onChange={(event) => {
                                this.setState({
                                  filmProducer: event.target.value},
                                  () => {console.log("actor producer: ",this.state.filmProducer)
                                });
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
                    {this.state.film && <TextField label="Длительность" type="number"
                                                   variant="outlined" color = "secondary"
                                                    defaultValue={this.state.film.duration} onChange={(event) => {
                                                      this.setState({filmDuration: event.target.value})
                                                    }}/>}
                  </Box>
                    </Box>
                    <Box>
                  <Box style={styles.editInputWrapper}>
                      {this.state.film && <TextField label="Рейтинг" type="number"
                                                     variant="outlined" color = "secondary"
                                                    defaultValue={this.state.film.rating} onChange={(event) => {
                                                      this.setState({filmRating: event.target.value})
                                                    }}/>}
                  </Box>
                    <Box style={styles.editInputWrapper}>
                      {this.state.film && <TextField label="Количество оценок" type="number"
                                                     variant="outlined" color = "secondary"
                                                    defaultValue={this.state.film.ratesAmount} onChange={(event) => {
                                                      this.setState({filmRatesAmount: event.target.value})
                                                    }}/>}
                      </Box>
                    <Box style={styles.editInputWrapper}>
                      {this.state.film && <TextField label="Бюджет" type="number"
                                                     variant="outlined" color = "secondary"
                                                    defaultValue={this.state.film.budget} onChange={(event) => {
                                                      this.setState({filmBudget: event.target.value})
                                                    }}/>}
                      </Box>
                    <Box style={styles.editInputWrapper}>
                      {this.state.film && <TextField label="Описание" type="text" multiline rowsMax="8"
                                                     variant="outlined" color = "secondary"
                                                    defaultValue={this.state.film.description} onChange={(event) => {
                                                      this.setState({filmDescription: event.target.value})
                                                    }}/>}
                      </Box>
                    <Box style={styles.editInputWrapper}>
                        <p>Картинка:</p>
                      <input type="file" onChange={(event) => {
                        this.setState({filmImage: event.target.files[0]})
                      }}/>
                      </Box>
              <Button  variant="contained" color="secondary" onClick={() => {
                  let data = new FormData();
                  data.append('id', this.state.film.id);
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
                  axios.post(`http://${appConfig.host}:${+appConfig.port+1}/api/film/edit`, data, config)
              }}>
                  Редактировать фильм
              </Button>
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
      studios: state.app.studios,
      actors: state.app.actors,
      producers: state.app.producers,
      user: state.app.user,
      token: state.app.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
      getGenres: get_genres,
      getStudios: get_studios,
      getActors: get_actors,
      getProducers: get_producers,
      updateToken: update_token
  }, dispatch);
};

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Film));
