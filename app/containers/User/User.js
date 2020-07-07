import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {update_token} from "../../actions/indexActions";
import { bindActionCreators } from 'redux';
import { get, post, update, remove } from '../../fetch';
import config from '../../../config';
import openSocket from 'socket.io-client';
import appConfig from '../../../config';
import "../../components/Home//style.css";
import {Button, InputLabel, Select, MenuItem, TextField, Box} from "@material-ui/core";
import { withCookies, Cookies } from 'react-cookie';
import axios from "axios";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Typography from "@material-ui/core/Typography";
import PropTypes from 'prop-types';
import Tab from "@material-ui/core/Tab";
import withStyles from "@material-ui/core/styles/withStyles";
import {ListItem} from "../../components/ListItem";

const styles = {
    filmDataContainer: {
        display: 'flex',
        padding: '30px',
        width:'840px',
        backgroundColor: '#363636',
        borderRadius: '0 0 10px 10px',
        boxShadow: '0 0 15px black',
        marginBottom: '60px',
        backgroundImage: 'linear-gradient(0deg, rgba(148,20,221,0.35) 0%, rgba(38,38,38,1) 100%)',
        transform: 'translate(-32px, -32px)'
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
        display: 'flex',
        justifyContent: 'center'
    },
    editInputWrapper: {
        margin: '15px',
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

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            <Box p={4}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};


const StyledTab = withStyles(theme => ({
    root: {
        padding: 0,
    }
}))(props => <TabPanel disableRipple {...props} />);
const requestUrl = `${appConfig.host}`;
const requestPort = `${appConfig.port}`;
const port = +config.port + 1;

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
        user: null,
        nickname: '',
        name : '',
        oldPassword: '',
        newPassword: '',
        birthDate: '',
        gender: '',
        email: '',
        image: '',
        tab: 0,
        isAdmin: false,
    };
    //FOR PRODUCTION (https) and delete port+1
    this.socket = openSocket(`http://${config.host}:${+config.port+1}`);
  }

  componentDidMount() {
      console.log(process.env.NODE_ENV);
      console.log(process.env.PORT);
      console.log(this.props.id);
      post('/user', {id: this.props.id}).then(res => {
          this.setState({user: res});
          console.log(res);
      });
      if (this.props.id === "5aaccb7c-1b05-4283-a50e-5b74437417ea") {
          this.setState({isAdmin: true});
      }
      console.log("User: Component did mount");
  };

  render() {
    return (
        <Box style={styles.bigContainer}>
            <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between'}}>
            <p style={styles.filmTitle}>Страница пользователя {this.state.user && this.state.user.login}</p>
            {this.props.token && this.props.token.length > 0 && <Link to={'/'}><Button style={{width:'200px'}} variant="contained" color="secondary" onClick={() => {
                this.props.cookies.set('token', '', {path: '/'});
                this.props.updateToken('')
            }}>Выйти из аккаунта</Button></Link>}
            </Box>
            <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', margin: "0 0 20px 0"}}>
            {this.state.isAdmin &&  <Link to={'/admin'}>
                <Button variant="contained" style={{width:'200px'}} color="secondary">Редактирование БД</Button></Link>}
            </Box>
            <AppBar position="static">
                <Tabs variant="fullWidth" value={this.state.tab} onChange={(event, newValue) => {this.setState({tab: newValue})}}>
                    <Tab label="Профиль"  value={0} />
                    <Tab label="Посмотреть позже"  value={1} />
                    <Tab label="Просмотренное"  value={2} />
                    <Tab label="Любимые фильмы"  value={3} />
                </Tabs>
            </AppBar>
            <StyledTab  value={this.state.tab} index={0}>
                <Box style={styles.filmDataContainer}>
                    <Box style={styles.filmDataPartImage}>
                        {this.state.user && ((this.state.user.image) ? (
                          <img style={styles.image} src={`http://localhost:7789/uploads/${this.state.user.image}`}/>
                          ) : (
                            <img style={styles.image} src={`http://localhost:7789/uploads/noImage.jpg`}/>
                            ))}
                        <input type="file" onChange={(event) => {
                            this.setState({image: event.target.files[0]})
                        }} />
                    </Box>
                    <Box style={styles.filmDataPart}>
                        <Box style={{display: 'flex'}}>
                            <Box style={styles.filmDataInner}>
                                <div style={styles.editInputWrapper}>
                                    {this.state.user &&
                                    <TextField label="Никнейм" type="text" variant="outlined" color = "secondary"
                                               defaultValue={this.state.user.nickname && this.state.user.nickname}
                                               onChange={(event) => {
                                                   this.setState({nickname: event.target.value})
                                               }}/>}</div>
                                <div style={styles.editInputWrapper}>
                                    {this.state.user
                                    && <TextField label="Имя" type="text" variant="outlined" color = "secondary"
                                                  defaultValue={this.state.user.name}
                                                  onChange={(event) => {
                                                      this.setState({name: event.target.value})
                                                  }}/>}</div>
                                <div style={styles.editInputWrapper}>
                                    {this.state.user
                                    && <TextField label="Дата рождения"
                                                  type="date" format="dd/MM/yyyy"
                                                  variant="outlined" color = "secondary"
                                                  InputLabelProps={{shrink: true}}
                                                  defaultValue={this.state.user.birthDate && this.state.user.birthDate}
                                                  onChange={(event) => {
                                                      this.setState({birthDate: event.target.value})
                                                  }}/>}</div>
                                <div style={styles.editInputWrapper}>
                                    {this.state.user
                                    && <TextField label="Пол"
                                                  defaultValue={
                                                       this.state.user.gender
                                                       && this.state.user.gender
                                                       || this.state.gender
                                                  }
                                                  variant="outlined" color = "secondary" select
                                                  onChange={(event) => {this.setState({gender: event.target.value})}}>
                                    <MenuItem value={"Женский"}>Женский</MenuItem>
                                    <MenuItem value={"Мужской"}>Мужской</MenuItem>
                                </TextField>}</div>
                            </Box>
                            <Box style={styles.filmDataInner}>
                                <div style={styles.editInputWrapper}>{
                                    this.state.user && <TextField label="Электронная почта" type="email"
                                                                  variant="outlined" color = "secondary"
                                                                  defaultValue={
                                                                      this.state.user.email
                                                                      && this.state.user.email
                                                                  }
                                                                  onChange={(event) => {
                                                                      this.setState({email: event.target.value})
                                                                  }}/>
                                }</div>
                                <div style={styles.editInputWrapper}>{
                                    this.state.user && <TextField label="Старый пароль" type="password"
                                                                  variant="outlined" color = "secondary"
                                                                  defaultValue={this.state.user.password}
                                                                  onChange={(event) => {
                                                                      this.setState({
                                                                          oldPassword: event.target.value
                                                                      })
                                                                  }}/>
                                }</div>
                                <div style={styles.editInputWrapper}>{
                                    this.state.user && <TextField label="Новый пароль"
                                                                  type="password" variant="outlined"
                                                                  color = "secondary"
                                                                  onChange={(event) => {
                                                                      this.setState({
                                                                          newPassword: event.target.value
                                                                      })
                                                                  }}/>
                                }</div>
                                <Button
                                  style={styles.editInputWrapper}
                                  variant="contained"
                                  color="secondary"
                                  onClick={() => {
                                    let data = new FormData();
                                    data.append('id', this.state.user.id);
                                    data.append('name', this.state.name);
                                    data.append('nickname', this.state.nickname);
                                    data.append('gender', this.state.gender);
                                    data.append('oldPassword', this.state.oldPassword);
                                    data.append('newPassword', this.state.newPassword);
                                    data.append('birthDate', this.state.birthDate);
                                    data.append('email', this.state.email);
                                    data.append('image', this.state.image);
                                    const config = {
                                        headers: { 'content-type': 'multipart/form-data' }
                                    };
                                    axios.post(
                                      `http://${appConfig.host}:${+appConfig.port+1}/api/user/edit`,
                                      data,
                                      config
                                    ).then(res => {
                                        this.setState({
                                            user: res
                                        })
                                    });
                                }}>Изменить данные</Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </StyledTab>
            <StyledTab  value={this.state.tab} index={1}>
                <Box style={{width: '100%',
                    justifyContent :"space-between",
                    alignItems: 'center',
                    flexDirection: 'column'}}>
                    <Box style={styles.descriptionTitle}><h3>Посмотреть эти фильмы позже:</h3></Box>
                    {this.state.user && this.state.user.filmsToWatch && this.state.user.filmsToWatch.map((item) => {
                        return (<ListItem  film={item} user={this.state.user.id}/>)})}
                </Box>
            </StyledTab>
            <StyledTab  value={this.state.tab} index={2}>
                    <Box style={{width: '100%',
                        justifyContent :"space-between",
                        alignItems: 'center',
                        flexDirection: 'column'}}>
                        <Box style={styles.descriptionTitle}><h3>Список просмотренных фильмов:</h3></Box>
                        {this.state.user && this.state.user.watchedFilms && this.state.user.watchedFilms.map((item) => {
                            return (<ListItem  film={item} user={this.state.user.id}/>)})}
                    </Box>
            </StyledTab>
            <StyledTab  value={this.state.tab} index={3}>
                <Box style={{width: '100%',
                    justifyContent :"space-between",
                    alignItems: 'center',
                    flexDirection: 'column'}}>
                    <Box style={styles.descriptionTitle}><h3>Список любимых фильмов:</h3></Box>
                    {this.state.user && this.state.user.favouriteFilms && this.state.user.favouriteFilms.map((item) => {
                        return (<ListItem  film={item} user={this.state.user.id}/>)})}
                </Box>
            </StyledTab>
        </Box>
    )
  }
}

function mapStateToProps(state) {
  return {
      isFetching: state.app.isFetching,
      token: state.app.token
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
      updateToken: update_token
  }, dispatch);
};

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(User));
