import React from "react";
import { Link } from 'react-router-dom'
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";

import {post} from "../../fetch";
import Grid from "@material-ui/core/Grid";
import { red } from '@material-ui/core/colors';
import Checkbox from '@material-ui/core/Checkbox';
import {Star, StarBorder } from '@material-ui/icons/';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';


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

const PostCard02 = (props) => {
    let classes = useStyles();
    return(
        <Card className={classes.MuiPostCard}>
            <CardMedia
                className={classes.MuiCardMediaRoot}
                image={`http://localhost:7789/uploads/${props.film.image}`}
            />
            <CardContent className={classes.MuiCardContentRoot}>
                <Grid  container
                       direction="row"
                       justify="flex-end"
                       alignItems="center">
                    <Typography className={classes.MuiTypographyRating} variant={"h4"}>
                        {props.film.rating && props.film.rating}
                        <FormControlLabel label={""} control={<RedCheckbox/> }/>
                    </Typography>
                </Grid>
                <Link to={`/film/${props.film.id}`}>
                <Typography
                    className={classes.MuiTypographyHeading}
                    variant={"h6"}
                >
                    {props.film.name}
                </Typography>
                </Link>
                <Typography className={classes.MuiTypographySubheading} variant={"overline"} gutterBottom>
                    {props.film.year} {props.film.genre && props.film.genre.map((item) => item.name).join(', ')}
                </Typography>
                <Typography className={classes.MuiTypographySubheading}>
                    {props.film.description}
                </Typography>
                <Button
                  className={classes.MuiButtonAddToWatch}
                  onClick={()=> {
                      post('/addToWatch', {filmid: props.film.id, userid: props.user})
                  }}>
                    + в "Посмотреть позже"
                </Button>
            </CardContent>
        </Card>
    );
};

const useStyles = makeStyles(muiBaseTheme => ({
    MuiPostCard: {
        borderRadius: muiBaseTheme.spacing(2), // 16px
        transition: "0.3s",
        boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
        width: "95%",
        minWidth: 500,
        position: "relative",
        maxWidth: 800,
        minHeight: 300,
        marginLeft: "auto",
        overflow: "initial",
        backgroundImage: "linear-gradient(90deg, #262626 0%, #323232 74%)",
        display: "flex",
        paddingRight: 10,
        padding: `${muiBaseTheme.spacing(4)}px 0`,
        "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)"
        },
    },
    MuiCardMediaRoot: {
        flexShrink: 0,
        width: "40%",
        paddingTop: "48%",
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
        padding: muiBaseTheme.spacing(2)
    },
    MuiTypographyHeading: {
        maxWidth: "75%",
        fontWeight: "bold",

    },
    MuiTypographySubheading: {
        marginBottom: muiBaseTheme.spacing(2),
    },
    MuiButtonAddToWatch: {
        backgroundImage: "linear-gradient(147deg, #fe8a39 0%, #fd3838 74%)",
        boxShadow: "0px 4px 32px rgba(252, 56, 56, 0.4)",
        borderRadius: 100,
        bottom: 30,
        right: 30,
        marginLeft: 100,
        position: 'absolute',
        color: "#ffffff"
    },
    MuiTypographyRating: {
        transform: "translateX(25%)",
        height:0,
        color: "#fd3838",
        top: 30,
        right: 30,
        position: 'absolute'
    }
}));

export default PostCard02;
