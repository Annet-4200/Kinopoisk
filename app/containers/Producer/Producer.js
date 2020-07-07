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
import axios from "axios";
import {get_genres} from "../../actions/indexActions";


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
        width: '65%',
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

class Producer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        producer: null,

        producerName: '',
        producerBirthDate: '',
        producerCountry: '',
        producerGenre: [],
        producerImage: null,
        producerNFilms: 0,
        isAdmin: false,
    };
    //FOR PRODUCTION (https) and delete port+1
    this.socket = openSocket(`http://${config.host}:${+config.port+1}`);
  }

  componentDidMount() {
      console.log(process.env.NODE_ENV);
      console.log(process.env.PORT);
      console.log(this.props.id);
      this.props.getGenres();
      if (this.props.user === "5aaccb7c-1b05-4283-a50e-5b74437417ea") {
          this.setState({isAdmin: true});
      }
      post('/producer', {id: this.props.id}).then(res => {
          this.setState({producer: res});
          console.log(res);
      });
      console.log("Producer: Component did mount");
  }

  render() {
    return (
        <Box style={styles.bigContainer}>
            {/*<Link to={`/actor/${this.state.film.actor.id}`}>{this.state.film.actor.name}</Link>*/}
            <Box style={styles.filmDataContainer}>
                <Box style={styles.filmDataPartImage}>
                    {this.state.producer && ((this.state.producer.image) ? (
                      <img style={styles.image} src={`http://localhost:7789/uploads/${this.state.producer.image}`}/>
                      ) : (
                        <img style={styles.image} src={`http://localhost:7789/uploads/noImage.jpg`}/>
                        ))}
                </Box>
                <Box style={styles.filmDataPart}>
                    <p style={styles.filmTitle}>{this.state.producer
                    && this.state.producer.name
                    && this.state.producer.name}</p>
                    <Box style={{display: 'flex', flexDirection: 'column'}}>
                        <Box style={styles.filmDataInner}>
                            <Box style={{color: '#989898', width: '40%', fontSize: '20px'}}>
                                <p>дата рождения</p>
                                <hr size={1} color={'#989898'}/>
                                <p>страна</p>
                                <hr size={1} color={'#989898'}/>
                                <p>количество фильмов</p>
                            </Box>
                            <Box style={{width: '60%', fontSize: '20px'}}>
                                <p>{this.state.producer
                                && this.state.producer.birthDate
                                && this.state.producer.birthDate}</p>
                                <hr size={1} color={'#989898'}/>
                                <p>{this.state.producer
                                && this.state.producer.country
                                && this.state.producer.country}</p>
                                <hr size={1} color={'#989898'}/>
                                <p>{this.state.producer
                                && this.state.producer.numberOfFilms
                                && this.state.producer.numberOfFilms}</p>
                            </Box>
                        </Box>
                        <Box style={{
                            ...styles.filmDataInner,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>
                            <p style={{ flexDirection:'column', display:'flex', alignItems: 'center',
                                fontFamily:'Oswald', fontSize:'35px', color: "#958e8e", letterSpacing:'3px'}}>Жанры</p>
                            <ul style={{listStyleType: 'none', paddingInlineStart: '0px', width: '60%'}}>
                                {this.state.producer
                                && this.state.producer.genre
                                && this.state.producer.genre.map((item) => {
                                    return (<li key={item.name} style={{fontSize: '20px', padding: '5px',
                                        backgroundColor: "#2a272d", borderRadius:'5px',
                                        display:'flex', justifyContent:'center'}}>
                                        {item.name}</li>)})}
                            </ul>
                            {this.state.producer && <Link style={{display: 'contents'}} to={{
                                pathname: `/search/producer/${this.state.producer.id}`
                            }}><Button style={{width:'70%'}}  variant="contained" color="secondary">
                                Поиск по фильмам режиссера
                            </Button></Link>}
                        </Box>
                    </Box>
                </Box>
                <Box>
                </Box>
            </Box>

            {this.state.isAdmin && <Box style={{...styles.filmDataContainer,flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', width:'max-content', marginTop: 40}}>
                  <h3 style={styles.editInputWrapper} >Редактирование режиссера:</h3>
                  <p>{this.state.producer && <TextField label="Имя" type="text" variant="outlined" color = "secondary"
                                                     defaultValue={this.state.producer.name}
                                                        onChange={(event) => {
                                                            this.setState({producerName: event.target.value})
                                                        }}/>}</p>
                  <p>{this.state.producer && <TextField label="Дата рождения" type="text"
                                                        variant="outlined" color = "secondary"
                                                     defaultValue={this.state.producer.birthDate}
                                                        onChange={(event) => {
                                                            this.setState({
                                                                producerBirthDate: event.target.value
                                                            })
                                                        }}/>}</p>
                  <p>{this.state.producer && <TextField label="Страна" type="text"
                                                        variant="outlined" color = "secondary"
                                                     defaultValue={this.state.producer.country} onChange={(event) => {
                                                         this.setState({producerCountry: event.target.value})
                                                     }}/>}</p>
                  <p>
                      <InputLabel id="genre-label">Жанры:</InputLabel>
                      <Select multiple labelId="genre-label" id="select" value={this.state.producerGenre}
                              onChange={(event) => {
                                  this.setState({
                                      producerGenre: event.target.value},
                                    () => {console.log("producer genre: ",this.state.producerGenre)
                                  });
                              }}>
                          {this.props.genres.map((item, index) => { return <MenuItem
                            key={`genre-${index}`}
                            value={item.id}>
                              {item.name}
                          </MenuItem>}) }
                      </Select>
                  </p>
                  <p>{this.state.actor && <TextField label="Количество фильмов" type="number"
                                                     variant="outlined" color = "secondary"
                                                     defaultValue={this.state.producer.numberOfFilms}
                                                     onChange={(event) => {
                                                         this.setState({
                                                             producerNFilms: event.target.value
                                                         })
                                                     }}/>}</p>
                  <p style={styles.editInputWrapper}> Картинка:
                      <input type="file" onChange={(event) => {
                          this.setState({producerImage: event.target.files[0]})
                      }} />
                  </p>
              <Button  variant="contained" color="secondary" onClick={() => {
                  let data = new FormData();
                  data.append('id', this.state.producer.id);
                  data.append('name', this.state.producerName);
                  data.append('image', this.state.producerImage);
                  data.append('numberOfFilms', this.state.producerNFilms);
                  data.append('genreid', this.state.producerGenre);
                  data.append('country', this.state.producerCountry);
                  data.append('birthDate', this.state.producerBirthDate);
                  const config = {
                      headers: { 'content-type': 'multipart/form-data' }
                  };
                  axios.post(`http://${appConfig.host}:${+appConfig.port+1}/api/producer/edit`, data,
                      config)
              }}>
                  Редактировать режиссера
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
      user: state.app.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
      getGenres: get_genres,
  }, dispatch);
};

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Producer));
