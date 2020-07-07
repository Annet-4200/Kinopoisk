import PropTypes from 'prop-types';
import config from '../../../config';
import { connect } from 'react-redux';
import Tab from "@material-ui/core/Tab";
import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import "../../components/Home//style.css";
import Tabs from "@material-ui/core/Tabs";
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
import { withCookies, Cookies } from 'react-cookie';
import {Star, StarBorder } from '@material-ui/icons/';
import Typography from "@material-ui/core/Typography";
import { get, post, update, remove } from '../../fetch';
import {Button, Box, TextField} from "@material-ui/core";


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
        marginBottom: '30px',
        fontFamily: 'Oswald',
        letterSpacing: '4px'
    },
    descriptionTitle: {
        fontSize: '25px',
        fontWeight: 'bold',
        fontStyle: 'italic',
        marginLeft: '40px',
        display:'flex',
        justifyContent: 'flex-start'
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
class Help extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email:'',
            topic:'',
            text:'',
            tab:0
        };
        //FOR PRODUCTION (https) and delete port+1
        this.socket = openSocket(`http://${config.host}:${+config.port + 1}`);
    }

    componentDidMount() {
        console.log("Help: Component did mount")
    }

    render() {
        return (
            <Box style={styles.bigContainer}>
                <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <p style={styles.filmTitle}>Ответы на частые вопросы и обратная связь</p>
                </Box>
                <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Tabs width='100%' orientation="vertical" variant="scrollable" value={this.state.tab}
                          onChange={(event, newValue) => {this.setState({tab: newValue})}}>
                        <Tab label="О сайте" value={0} />
                        <Tab label="Навигация по страницам" value={1} />
                        <Tab label="Как добавить фильм в список" value={2} />
                        <Tab label="Как сменить пароль" value={3} />
                        <Tab label="Как удалить аккаунт" value={4} />
                        <Tab label="Узнать больше" value={5} />
                    </Tabs>
                    <Box style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        width:'100%'
                    }}>
                    <TabPanel value={this.state.tab} index={0}>
                        Кинопоиск - это сайт, созданный специально для кинолюбителей всех возрастов. Здесь можно удобно
                        хранить списки своих фильмов, находить для себя новый кино-контент и узнать где сейчас он в прокате.
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={1}>
                        <p> Главная - страница для анонсов самых свежих и популярных фильмов и сериалов.</p>
                        <p> Страница фильма - детальная информация о фильме и кинотеатрах, где сейчас фильм прокате.</p>
                        <p> Страница актера - детальная информация об актере, его наградах и лучшем фильме.</p>
                        <p> Страница режиссера - детальная информация о режиссере, можно просмотреть фильмы, над которыми режиссер работал.</p>
                        <p> Страница студии - детальная информация о студии и список лучших фильмов, можно просмотреть весь список фильмов студии.</p>
                        <p> Профиль - личный кабинет пользователя, где можно поменять информацию о себе и сменить пароль. Тут же хранятся Ваши списки фильмов.</p>
                        <p> Помощь - ответы на частые вопросы и обратная связь.</p>
                        <p> Поиск - расширенный поиск по всем фильтрам для фильмов, возможна любая комбинация, в том числе мультивыбор.</p>
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={2}>
                        Чтобы добавить фильм в какой-либо список, нужно перейти на его детальную страницу и под постером фильма выбрать нужный список.
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={3}>
                       Чтобы сменить свой пароль, нужно сначала зайти в Профиль и на вкладке с личной информацией ввести свой старый пароль.
                        Новый пароль должен быть не меньше 8 символов, содержать минимум одну строчную и заглавнуе буквы и хотя бы одну цифру.
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={4}>
                        К сожалению, у пользователей сейчас нет возможности удалять свои аккаунты самолично. Если Вы хотите удалить свой аккаунт,
                        заполните форму ниже и мы свяжемся с Вами как можно скорее.
                    </TabPanel>
                    <TabPanel value={this.state.tab} index={5}>
                        Если Вас заинтересовал этот сайт и Вы хотите как-либо содействовать его развитию, оставить отзыв или предложить что-то новое,
                        то заполняйте форму ниже. Всегда рады вашим отзывам!
                    </TabPanel>
                    </Box>
                </Box>
                <Box style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <p style={{
                        ...styles.filmTitle,
                        display: 'flex',
                        textAlign: 'center',
                        fontStyle:'none',
                        fontSize: '25px'
                    }}>
                        Если вы не нашли ответа на свой вопрос, то можете задать его нам онлайн</p>
                </Box>
                <Box style={styles.filmDataContainer}>
                    <Box style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center'
                    }}>
                        <TextField style={{width: '300px', margin: '20px'}} label="Электронная почта" type="text"
                                   variant="outlined" color="secondary"
                                   onChange={(event) => {
                                       this.setState({email: event.target.value}, () => {
                                           console.log("email", this.state.email)
                                       })
                                   }}/>
                        <TextField style={{width: '400px', margin: '20px'}} label="Тема сообщения" type="text"
                                   variant="outlined" color="secondary"
                                   onChange={(event) => {
                                       this.setState({topic: event.target.value}, () => {
                                           console.log("topic", this.state.topic)
                                       })
                                   }}/>
                        <TextField style={{width: '90%', margin: '20px'}} label="Описание проблемы" type="text"
                                   variant="outlined" color="secondary" multiline rowsMax={10} rows={6}
                                   onChange={(event) => {
                                       this.setState({text: event.target.value}, () => {
                                           console.log("text", this.state.text)
                                       })
                                   }}/>
                    <div style={{width:'100%'}}>
                    <div style={{ display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',

                        flexDirection:'row'}}>
                            <Button style={{fontSize: '18px', width: '200px', display: 'flex'}} variant="contained" color="primary"
                                    onClick={() => {
                                        post('/send', {
                                            user: this.props.user,
                                            text: this.state.text,
                                            email: this.state.email,
                                            topic: this.state.topic
                                        })
                                    }}>
                                Отправить
                            </Button>
                    </div>
                    </div>
                    </Box>
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
      token: state.app.token,
      user: state.app.user,
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

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Help));
