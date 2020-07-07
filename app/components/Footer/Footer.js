import React from "react";
import EmailIcon from '@material-ui/icons/Email';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import InstagramIcon from '@material-ui/icons/Instagram';
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
const useStyles = makeStyles(theme => ({

    background:{
        backgroundColor:'#181818',
        height: 250,
        boxShadow: '0 0 20px black',
        marginTop: 50,
        maxWidth: '90%',
        width: '1200px',
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        alignItems: 'center'
    },
    bottom:{
        height: 75,
        display: 'flex',
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor:'#101010',
        width: '100%',
        boxShadow: '0 0 10px black',
        flexDirection: 'column',
        marginTop: 25
    },
    title:{
        color: '#606060'
    },
    Name:{
        color: '#454545'
    },
    content:{
        display: 'flex',
        justifyContent: 'center',
        alignItems:'center',
        flexDirection: 'row',
    },
    pages:{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems:'flex-end',
        flexDirection: 'column',
        paddingLeft: '140px',
    },
    link:{
        color: '#606060',
        fontSize: '20px',
        margin: "5px 0",
        display: 'flex',
        alignItems: 'flex-end'
    },
    contact:{
        color: '#606060',
        fontSize: '20px',
        margin: "5px 0",
        display: 'flex',
        paddingLeft: '190px',
        justifyContent: 'center',
        alignItems:'flex-start',
        flexDirection: 'column',
    },
    icon:{
        fontSize: '27px',
        margin: '3px 10px 3px 0',
    },
    underline:{
        textDecoration:'underline',
        display:'flex'
    }
}));

export default function Footer() {
    const classes = useStyles();
    let token = useSelector((state) => {return state.app.token}, shallowEqual);
    let user = useSelector((state) => {return state.app.user}, shallowEqual);
    return (
      <div className={classes.background}>
          <div className={classes.content}>
              <div className={classes.pages}>
                  <a className={classes.link} href={`http://localhost:7788/`}>Главная</a>
                  <a className={classes.link} href={`http://localhost:7788/user/${user}`}>Профиль</a>
                  <a className={classes.link} href={`http://localhost:7788/help`}>Помощь</a>
                  <a className={classes.link} href={`http://localhost:7788/search`}>Поиск</a>
              </div>
              <div className={classes.contact}>
                  <p className={classes.underline}>Contact me</p>
                  <div className={classes.content}>
                      <InstagramIcon className={classes.icon} color="secondary"/>
                      <a className={classes.link} href={`https://www.instagram.com/annet_4200/`}>
                          @annet_4200
                      </a>
                  </div>
                  <div className={classes.content}>
                      <LinkedInIcon className={classes.icon} color="secondary"/>
                      <a className={classes.link}
                         href={`https://www.linkedin.com/in/anna-ageeva-4a5919192`}>
                          Anna Ageeva
                      </a>
                  </div>
                  <div className={classes.content}>
                      <EmailIcon className={classes.icon} color="secondary"/>
                      <a className={classes.link} href={`http://localhost:7788/help`}>
                          anya10299@gmail.com
                      </a>
                  </div>
              </div>
          </div>
          <div className={classes.bottom}>
              <Typography className={classes.title} variant="h5" noWrap>
                  © 2019  Кинопоиск
              </Typography>
              <div className={classes.Name}>
                  Site by Anna Ageeva
              </div>
          </div>
      </div>
    );
}
