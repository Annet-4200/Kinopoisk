import React from "react";
import Box from '@material-ui/core/Box';
import Menu from '@material-ui/core/Menu';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { fade, makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

import { post } from "../../fetch";
import { useCookies } from "react-cookie";
import { Link, useHistory } from "react-router-dom";
import { update_token } from "../../actions/indexActions";

const useStyles = makeStyles(theme => ({
    popover: {
      justifyContent: 'center',
      alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
        padding: '15px'
    },
    inputWrapper: {
      margin: '15px 0'
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {

        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 290,
        width: '45%',

    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    width100: {
        width: '100%'
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    button: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.default.main,
        color: '#ffffff',
        '&:hover': {
            backgroundColor: theme.palette.default.hover,
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    poisk:{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    link: {
        color: '#ffffff',
        textDecoration: 'none',
    '&:link': {
      color: '#ffffff',
    },
    '&:visited': {
    color: '#ffffff',
        }
    },
}));

export default function Header() {
    let history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    let token = useSelector((state) => {return state.app.token}, shallowEqual);
    let user = useSelector((state) => {return state.app.user}, shallowEqual);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [registrationLogin, setRegistrationLogin] = React.useState(null);
    const [registrationPassword, setRegistrationPassword] = React.useState(null);
    const [login, setLogin] = React.useState(null);
    const [password, setPassword] = React.useState(null);
    const [signInAnEl, setSignInAnEl] = React.useState(null);
    const [signUpAnEl, setSignUpAnEl] = React.useState(null);
    const openSignIn = Boolean(signInAnEl);
    const openSignUp = Boolean(signUpAnEl);
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSignInAnEl(null);
        setSignUpAnEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = event => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleClickSignIn = event => {
        setSignInAnEl(event.currentTarget);
    };

    const handleClickSignUp = event => {
        setSignUpAnEl(event.currentTarget);
    };

    const handleClose = () => {
        setSignInAnEl(null);
        setSignUpAnEl(null);
    };

    const id = open ? 'simple-popover' : undefined;

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={menuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
          <Link to={`/user/${user}`}>
              <MenuItem onClick={() => {handleMenuClose()}}>Профиль</MenuItem>
          </Link>
          <MenuItem onClick={() => {
              setCookie('token', '', {path: '/'});
              setCookie('user', '', {path: '/'});
              dispatch(update_token('', ''));
              handleMenuClose()
          }}>
              Выход
          </MenuItem>
      </Menu>
    );
    return (
    <div className={classes.grow}>
        <AppBar position="static">
        <Toolbar className={classes.poisk}>
            <Typography className={classes.title} variant="h5" noWrap>
              <Link className={classes.link} to={`/`}>
                  Кинопоиск
              </Link>
            </Typography>
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div>
                <InputBase
                    placeholder="Search…"
                    onChange={(event) => {
                        history.push(`/search/name/${event.target.value}`);
                    }}
                    classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                    }}
                    inputProps={{ 'aria-label': 'search' }}
                />
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
                {token && token.length > 0 ? (
                <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                ) : (
                <div>
                    <Button aria-describedby={id} variant="contained" onClick={handleClickSignIn} color="default" className={classes.button}>
                      Авторизация
                    </Button>
                    <Popover
                        id={id}
                        open={openSignIn}
                        anchorEl={signInAnEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        className={classes.popover}
                    >
                        <div
                            className={classes.popover}
                        >
                            <Typography className={classes.typography}>Авторизация</Typography>
                            <Box className={classes.inputWrapper}>
                            <TextField label="Логин" type="text" variant="outlined" color="default"
                                 defaultValue={login} onChange={(event) => {setLogin(event.target.value)}}/>
                            </Box>
                            <Box className={classes.inputWrapper}>
                            <TextField
                                label="Пароль" type="password" variant="outlined" color="default"
                                defaultValue={password} onChange={(event) => {setPassword(event.target.value)}}
                            />
                            </Box>
                            <Button className={classes.button} variant="contained" color="secondary" onClick={() => {post('/auth', {login: login, password: password}).then((res) => {
                                setCookie('token', res.token, {path: '/'});
                                setCookie('user', res.id, {path: '/'});
                                dispatch(update_token(res.token, res.id))
                            })}}>
                                Авторизация
                            </Button>
                        </div>
                    </Popover>
                    <Button
                      aria-describedby={id}
                      variant="contained"
                      onClick={handleClickSignUp}
                      color="default"
                      className={classes.button}
                    >
                      Регистрация
                    </Button>
                    <Popover
                    id={id}
                    open={openSignUp}
                    anchorEl={signUpAnEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    >
                    <div
                    className={classes.popover}
                    >
                        <Typography className={classes.typography}>
                            Регистрация
                        </Typography>
                        <Box className={classes.inputWrapper}>
                        <TextField label="Логин" type="text" variant="outlined" color="default"
                            defaultValue={registrationLogin}
                            onChange={(event) => {setRegistrationLogin(event.target.value)}}/>
                        </Box>
                        <Box className={classes.inputWrapper}>
                        <TextField label="Пароль" type="password" variant="outlined" color="default"
                            defaultValue={registrationPassword}
                            onChange={(event) => {setRegistrationPassword(event.target.value)}}
                        />
                        </Box>
                        <Button className={classes.button}
                            variant="contained" color="default"
                            onClick={() => {
                                post('/register', {login: registrationLogin, password: registrationPassword})
                                .then((res) => {
                                setCookie('token', res.token, {path: '/'});
                                setCookie('user', res.id, {path: '/'});
                                dispatch(update_token(res.token, res.id))
                            })}}
                        >
                          Зарегистрироваться
                        </Button>
                    </div>
                    </Popover>
                </div>)}
            </div>
        </Toolbar>
        </AppBar>
        {renderMenu}
    </div>
    );
}
