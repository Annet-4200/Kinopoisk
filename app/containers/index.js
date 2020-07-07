import React, { Component } from 'react';
import { Home } from './Home'
import { Film } from  './Film'
import { Actor } from  './Actor'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import style from './style.scss';
import {Producer} from "./Producer";
import {Studio} from "./Studio";
import {Header} from "../components/Header"
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import { bindActionCreators } from "redux";
import {
  get_actors,
  get_cinemas,
  get_films,
  get_filtered_films,
  get_genres, get_halls, get_producers,
  get_studios, update_token
} from "../actions/indexActions";
import { withCookies } from "react-cookie";
import { connect } from "react-redux";
import {User} from "./User";
import {Admin} from "./Admin";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {Footer} from "../components/Footer";

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {main: '#9414dd'},
    background: {
      darker: '#262626',
      main: '#363636'
    },
    secondary: {
      main: '#c682e6',
      hover: '#e6a8ff'
    },
    default: {
      main: '#c682e6',
      hover: '#e6a8ff'
    }
  },
  status: {
    danger: 'orange',
  },
});
import { Search } from "./Search";
import Help from "./Help/Help";
import House from "./House/House";

class IndexApp extends Component {

    componentWillMount() {
        document.title = "KinoPoisk";
        window.realmStudio = 'GOVNO';
        window.мыш = function () {
            alert('МЫШ ПРИДЕТ - ПОРЯДОК НАВЕДЕТ');
            return('(:)_(:)\n' +
                '  0   0\n' +
                '   \\о/ - ето мыш хозяйка')
        };
      this.props.updateToken(this.props.cookies.get('token') || '', this.props.cookies.get('user') || '');
    }

    render() {
    return (
        <ThemeProvider theme={theme}>
          <MuiThemeProvider>
            <BrowserRouter>
              <Header/>
              <div style={{
                alignItems: 'center',
                flexDirection: 'column',
                display: 'flex',
                backgroundColor: '#262626'
              }} className={'site'}>
                <Switch>
                    <Route exact path='/house' component={House}/>
                  <Route exact path='/' component={Home}/>
                  <Route exact path='/admin' component={Admin}/>
                  <Route exact path='/help' component={Help}/>
                  <Route path='/search' render={ () => (
                    <Switch>
                      <Route exact path='/search' component={(props) => (<Search/>)}/>
                      <Route path='/search/name' component={() => (
                        <Switch>
                          <Route path='/search/name/:value'
                                 component={(props) => (<Search name={props.match.params.value} type={'Имя'}/>)}/>
                        </Switch>
                      )}/>
                      <Route path='/search/producer' component={() => (
                        <Switch>
                          <Route path='/search/producer/:id'
                                 component={(props) => (<Search producer={props.match.params.id} type={'Режисер'}/>)}/>
                        </Switch>
                      )}/>
                      <Route path='/search/studio' component={() => (
                        <Switch>
                          <Route path='/search/studio/:id'
                                 component={(props) => (<Search studio={props.match.params.id} type={'Студия'}/>)}/>
                        </Switch>
                      )}/>
                      <Route path='/search/actor' component={() => (
                        <Switch>
                          <Route path='/search/actor/:id'
                                 component={(props) => (<Search actor={props.match.params.id} type={'Актер'}/>)}/>
                        </Switch>
                      )}/>
                    </Switch>
                    )}/>
                  <Route path="/actor/:id" component={(props) => (<Actor id={props.match.params.id}/>)}/>
                  <Route path="/film/:id" render={(props) => (<Film id={props.match.params.id}/>)}/>
                  <Route path="/producer/:id" render={(props) => (<Producer id={props.match.params.id}/>)}/>
                  <Route path="/user/:id" component={(props) => (<User id={props.match.params.id}/>)}/>
                  <Route path="/studio/:id" component={(props) => (<Studio id={props.match.params.id}/>)}/>
                  <Route component={Home}/>
                </Switch>
                <Footer/>
              </div>
            </BrowserRouter>
          </MuiThemeProvider>
        </ThemeProvider>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    updateToken: update_token
  }, dispatch);
};

export default withCookies(connect(() => {}, mapDispatchToProps)(IndexApp));
