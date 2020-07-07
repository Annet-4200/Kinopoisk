import React from "react";
import {post} from "../../fetch";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Star1 from '@material-ui/icons/Stars';
import Button from "@material-ui/core/Button";
import { red } from '@material-ui/core/colors';
import Checkbox from '@material-ui/core/Checkbox';
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import {Star, StarBorder } from '@material-ui/icons/';
import CardContent from "@material-ui/core/CardContent";
import { makeStyles, withStyles } from '@material-ui/core/styles';

const RedCheckbox = withStyles({
    root: {
        color: red[600],
        '&$checked': {
            color: red[400],
        },
    },
    checked: {},
})(props => <Checkbox
    icon={
      <StarBorder fontSize="large"/>
    }
    checkedIcon={
      <Star fontSize="large"/>
    }
    value="checkedH"
    {...props}/>
  );

const ListItem = (props) => {
    let classes = useStyles();
    return(
        <Card className={classes.MuiPostCard}>
            <CardMedia
                className={classes.MuiCardMediaRoot}
                image={`http://localhost:7789/uploads/${props.film.image}`}
            />
            <CardContent className={classes.MuiCardContentRoot}>
                <Grid className={classes.Grid1} container display='flex' direction="column" >
                  <Link
                    to={`/film/${props.film.id}`}>
                    <Typography
                      className={classes.MuiTypographyHeading}
                      variant={"h5"}>
                          {props.film.name}
                      </Typography>
                  </Link>
                <div>
                <Typography className={classes.MuiTypographySubheading} variant={"overline"} gutterBottom>
                {props.film.year}, {props.film.duration} мин.
                </Typography>
                </div>
                <div>
                    <Typography className={classes.MuiTypographySubheading} variant={"overline"} gutterBottom>
                {props.film.country}
                </Typography>
                </div>
                <div>
                <Typography className={classes.MuiTypographySubheading} variant={"overline"} gutterBottom>
                    {props.film.genre.map((item) => {return item.name}).join(', ')}
                </Typography>
                </div>
                <Typography className={classes.MuiTypographySubheading} variant={"overline"} gutterBottom>
                {props.film.actors.map((item) => {return item.name}).join(', ')}
                </Typography>

                </Grid>
                <Grid container display='flex'  direction="column" justify="flex-start" alignItems="flex-end" >
                    <Grid container display='flex' justify ="center" alignItems='center' direction="row">
                        <Grid container display='flex' direction= 'row' justify="flex-end">
                            <Grid className={classes.Stars} >
                                <Star1
                                  color={props.film && +props.film.rating > 0 ? 'primary' : 'secondary'}
                                  className={classes.iconHover}
                                />
                                <h3>1</h3>
                            </Grid>
                            <Grid className={classes.Stars}>
                                <Star1
                                  color={props.film && +props.film.rating > 1 ? 'primary' : 'secondary'}
                                  className={classes.iconHover}
                                />
                                <h3>2</h3>
                            </Grid>
                            <Grid className={classes.Stars}>
                                <Star1
                                  color={props.film && +props.film.rating > 2 ? 'primary' : 'secondary'}
                                  className={classes.iconHover}
                                />
                                <h3>3</h3>
                            </Grid>
                            <Grid className={classes.Stars}>
                                <Star1
                                  color={props.film && +props.film.rating > 3 ? 'primary' : 'secondary'}
                                  className={classes.iconHover}
                                />
                                <h3>4</h3>
                            </Grid>
                            <Grid className={classes.Stars}>
                                <Star1
                                  color={props.film && +props.film.rating > 4 ? 'primary' : 'secondary'}
                                  className={classes.iconHover}
                                />
                                <h3>5</h3>
                            </Grid>
                            <Grid className={classes.Stars}>
                                <Star1
                                  color={props.film && +props.film.rating > 5 ? 'primary' : 'secondary'}
                                  className={classes.iconHover}
                                />
                                <h3>6</h3>
                            </Grid>
                            <Grid className={classes.Stars}>
                                <Star1
                                  color={props.film && +props.film.rating > 6 ? 'primary' : 'secondary'}
                                  className={classes.iconHover}
                                />
                                <h3>7</h3>
                            </Grid>
                            <Grid className={classes.Stars}>
                                <Star1
                                  color={props.film && +props.film.rating > 7 ? 'primary' : 'secondary'}
                                  className={classes.iconHover}
                                />
                                <h3>8</h3>
                            </Grid>
                            <Grid className={classes.Stars}>
                                <Star1
                                  color={props.film && +props.film.rating > 8 ? 'primary' : 'secondary'}
                                  className={classes.iconHover}
                                />
                                <h3>9</h3>
                            </Grid>
                            <Grid className={classes.Stars}>
                                <Star1
                                  color={props.film && +props.film.rating > 9 ? 'primary' : 'secondary'}
                                  className={classes.iconHover}
                                />
                                <h3>10</h3>
                            </Grid>
                            <h1 className={classes.MuiTypographyRating} >{props.film.rating} </h1>
                        </Grid>

                    </Grid>
                    <Button
                      className={classes.MuiButtonAddToWatch}
                      onClick={()=> {
                        post('/addToWatch', {filmid: props.film.id, userid: props.user})
                      }}
                    >
                      + в "Посмотреть позже"
                    </Button>
                    <Button
                      className={classes.MuiButtonAddToWatch}
                      onClick={()=> {
                        post('/addWatched', {filmid: props.film.id, userid: props.user})
                      }}
                    >
                      + в "Просмотренные"
                    </Button>
                    <Button
                      className={classes.MuiButtonAddToWatch}
                      onClick={()=> {
                        post('/addFavourite', {filmid: props.film.id, userid: props.user})
                      }}
                    >
                      + в "Любимые"
                    </Button>
                </Grid>
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles(muiBaseTheme => ({
    MuiPostCard: {
        borderRadius: muiBaseTheme.spacing(2), // 16px
        transition: "0.3s",
        boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
        width: "100%",
        position: "relative",
        maxWidth: 1000,
        marginLeft: "auto",
        overflow: "initial",
        backgroundImage: "linear-gradient(90deg, #262626 0%, #323232 74%)",
        display: "flex",
        paddingRight: 10,
        margin: '10px 0',
        padding: `${muiBaseTheme.spacing(2)}px 0`,
        "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)"
        },
    },
    MuiCardMediaRoot: {
        flexShrink: 0,
        width: "20%",
        paddingTop: "25%",
        transform: "translateX(-15%)",
        boxShadow: "4px 4px 20px 1px rgba(252, 56, 56, 0.2)",
        borderRadius: muiBaseTheme.spacing(2), // 16
        backgroundImage: "linear-gradient(147deg, #fe8a39 0%, #fd3838 74%)",
        backgroundColor: muiBaseTheme.palette.background.main,
        overflow: "hidden",
        "&:after": {
            content: '" "',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            borderRadius: muiBaseTheme.spacing(2), // 16
            opacity: 0.5
        }
    },
    MuiCardContentRoot: {
        textAlign: "left",
        paddingLeft: 0,
        padding: muiBaseTheme.spacing(2),
        display: 'flex',
        width: '100%',
        flexDirection: "row",
        justifyContent:"space-between",
        alignItems: "flex-start"
    },
    MuiTypographyHeading: {
        fontWeight: "bold",
        marginBottom: '10px'
    },
    MuiTypographySubheading: {
        marginBottom: muiBaseTheme.spacing(2),
    },
    MuiButtonAddToWatch: {
        backgroundImage: "linear-gradient(147deg, #fe8a39 0%, #fd3838 74%)",
        boxShadow: "0px 4px 32px rgba(252, 56, 56, 0.4)",
        borderRadius: 100,
        color: "#ffffff",
        margin:'5px'
    },
    MuiTypographyRating: {
        display: 'flex',
        margin: '0 0 20px 20px',
        fontSize: '40px',
        color: "#fd3838",
    },
    iconHover: {
                fontSize:'30px',
        '&:hover': {
            color: '#9414dd',
        },
    },
    Stars:{
        display:'flex',
        flexDirection:'column',
        alignItems: 'center',
    },
    Grid1:{
            width: '70%'
    }
}));

export default ListItem;
