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
import axios from "axios";
import { withCookies, Cookies } from 'react-cookie';
import {ListItem} from "../../components/ListItem";

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
        width: '50%',
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
        width: '50%',
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
        marginBottom: '25px'
    },
    bigContainer: {
        width: '90%',
        maxWidth: '1000px',
        //backgroundImage: 'linear-gradient(0deg, rgba(148,20,221,0.35) 0%, rgba(38,38,38,1) 100%)',
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
        letterSpacing: '4px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
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

class Studio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            studio: null,

            studioName: '',
            studioYear: '',
            studioCountry: '',
            studioImage: '',
            isAdmin: false,
        };
        //FOR PRODUCTION (https) and delete port+1
        this.socket = openSocket(`http://${config.host}:${+config.port + 1}`);
    }

    componentDidMount() {
        console.log(process.env.NODE_ENV);
        console.log(process.env.PORT);
        console.log(this.props.id);
        if (this.props.user === "5aaccb7c-1b05-4283-a50e-5b74437417ea") {
            this.setState({isAdmin: true});
        }
        post('/studio', {id: this.props.id}).then(res => {
            this.setState({studio: res});
            console.log(res);
        });
        console.log("Studio: Component did mount");
    }

    render() {
        return (
          <Box style={styles.bigContainer}>
              <Box style={styles.filmDataContainer}>
                  <Box style={styles.filmDataPartImage}>
                      {this.state.studio && ((this.state.studio.image) ? (
                        <img style={styles.image}
                           src={`http://localhost:7789/uploads/${this.state.studio.image}`}/>) : (
                        <img style={styles.image} src={`http://localhost:7789/uploads/noImage.jpg`}/>))}
                      {this.state.studio && <Link to={{
                          pathname: `/search/studio/${this.state.studio.id}`
                      }}><Button variant="contained" color="secondary">Поиск по фильмам студии</Button></Link>}
                  </Box>
                  <Box style={styles.filmDataPart}>
                      <p
                        style={styles.filmTitle}>{this.state.studio && this.state.studio.name && this.state.studio.name}</p>
                      <Box style={{display: 'flex'}}>
                          <Box style={{...styles.filmDataInner}}>
                              <Box style={{color: '#989898', width: '35%', fontSize: '20px'}}>
                                  <p>год создания</p>
                                  <hr size={1} color={'#989898'}/>
                                  <p>страна</p>
                                  <hr size={1} color={'#989898'}/>
                                  <p>количество фильмов</p>
                              </Box>
                              <Box style={{width: '65%', fontSize: '20px'}}>
                                  <p>{this.state.studio && this.state.studio.yearFoundation && this.state.studio.yearFoundation}</p>
                                  <hr size={1} color={'#989898'}/>
                                  <p>{this.state.studio && this.state.studio.country && this.state.studio.country}</p>
                                  <hr size={1} color={'#989898'}/>
                                  <p>{this.state.studio && this.state.studio.films.length}</p>
                              </Box>
                          </Box>
                      </Box>
                  </Box>
              </Box>

              <Box style={{
                  display: 'flex',
                  justifyContent: "space-between",
                  alignItems: 'flex-start',
                  flexDirection: 'column'
              }}>
                  <Box style={styles.descriptionTitle}>Список лучших фильмов студии:</Box>
                  {this.state.studio && this.state.studio.films && this.state.studio.films.map((item) => {
                      return (<ListItem film={item} user={this.props.user}/>)
                  })}
              </Box>
              {this.state.isAdmin && <Box style={{
                  ...styles.filmDataContainer,
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  width: 'max-content',
                  marginTop: 40
              }}>
                  <h3 style={styles.editInputWrapper}>Редактирование студии:</h3>
                  <p>{this.state.studio && <TextField label="Название" type="text" variant="outlined" color="secondary"
                                                      defaultValue={this.state.studio.name} onChange={(event) => {
                      this.setState({studioName: event.target.value})
                  }}/>}</p>
                  <p>{this.state.studio &&
                  <TextField label="Дата основания" type="text" variant="outlined" color="secondary"
                             defaultValue={this.state.studio.yearFoundation} onChange={(event) => {
                      this.setState({studioYear: event.target.value})
                  }}/>}</p>
                  <p>{this.state.studio && <TextField label="Страна" type="text" variant="outlined" color="secondary"
                                                      defaultValue={this.state.studio.country} onChange={(event) => {
                      this.setState({studioCountry: event.target.value})
                  }}/>}</p>
                  <p style={styles.editInputWrapper}> Картинка:
                      <input type="file" onChange={(event) => {
                          this.setState({studioImage: event.target.files[0]})
                      }}/>
                  </p>
                  <Button variant="contained" color="secondary" onClick={() => {
                      let data = new FormData();
                      data.append('id', this.state.studio.id);
                      data.append('name', this.state.studioName);
                      data.append('image', this.state.studioImage);
                      data.append('yearFoundation', this.state.studioYear);
                      data.append('country', this.state.studioCountry);
                      const config = {
                          headers: {'content-type': 'multipart/form-data'}
                      };
                      axios.post(`http://${appConfig.host}:${+appConfig.port + 1}/api/studio/edit`, data, config)
                  }}>
                      Редактировать студию
                  </Button>
              </Box>}
          </Box>
        )
    }
}
function mapStateToProps(state) {
  return {
      isFetching: state.app.isFetching,
      user: state.app.user,
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
  }, dispatch);
};

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Studio));
