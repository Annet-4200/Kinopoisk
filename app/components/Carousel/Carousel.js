import React from 'react';
import cx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import ParallaxSlide from './Parallax';
import DotIndicator from './DotIndicator';
import  useSimpleArrowStyles  from './simpleArrow';

const useStyles = makeStyles(({ palette, breakpoints, spacing }) => ({
    root: {
        // a must if you want to set arrows, indicator as absolute
        position: 'relative',
        width: '100%',
    },
    slide: {
        perspective: 1200, // create perspective
        overflow: 'hidden',
        // relative is a must if you want to create overlapping layers in children
        position: 'relative',
        paddingTop: 80,
        display: 'flex',
    },
    imageContainer: {
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        zIndex: 2,
        marginBottom: '10%',
        backgroundColor: 'black'
    },
    image: {
        display: 'flex',
        zIndex: 10,
        width: '400px',
        height: '100%',

    },
    imageLeft: {
        marginLeft: '12%',
    },
    imageRight: {
        marginRight: '12%',
    },
    arrow: {
        display: 'none',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [breakpoints.up('sm')]: {
            display: 'inline-flex',
        },
    },
    arrowLeft: {
        left: 0,

    },
    arrowRight: {
        right: 0,

    },

    indicatorContainer: {
        textAlign: 'center',
    },
    text: {
        // shared style for text-top and text-bottom
        display:'flex',
        fontFamily: 'Poppins, san-serif',
        fontWeight: 900,
        position: 'absolute',
        color: palette.common.white,
        padding: '0 8px',
        marginLeft: '50%',
        transform: 'rotateY(45deg)',
        lineHeight: 1.2,
        textAlign: 'center'
    },
    title: {
        top: 120,
        left: '40%',
        height: '50%',
        fontSize: 60,
        zIndex: 1,
        maxWidth: 400,
        background: 'linear-gradient(0deg, rgba(148,20,221,0.35) 0%, rgba(38,38,38,1) 100%)',
    },
    subtitle: {
        top: 370,
        left: '50%',
        height: '35%',
        fontSize: 96,
        zIndex: 2,
        background: 'linear-gradient(0deg, rgba(148,20,221,0.35) 0%, rgba(58,58,58,1) 100%)',

    },
    previewOverlay: {
        zIndex: 12,
        textAlign: 'center',
        transition: '1s',
        opacity: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: '15% 0',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
        width: '100%',
        height: '100%',
        fontSize: '36px',
        position: 'absolute',
        filter: 'grayscale(0.5)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        '&:hover': {
            opacity: 1
        }
    }
}));

const Carousel = (props) => {
    let data = [];
    props.films.map((item, index) => {
        if (!(index % 2)) {
            let film = {};
            let nextFilm = props.films.length > index ? props.films[index + 1] : null;
            film.id = item.id;
            film.title = item.name;
            film.subtitle = item.year;
            film.image = item.image;
            if (nextFilm) {
                film = {
                    ...film,
                    hasNextFilm: true,
                    nextFilmId: nextFilm.id,
                    nextFilmTitle: nextFilm.name,
                    nextFilmSubtitle: nextFilm.year,
                    nextFilmImage: nextFilm.image,
                }
            }
            data.push(film);
        }
    }
);

    const classes = useStyles();
    const arrowStyles = useSimpleArrowStyles();

    // eslint-disable-next-line react/prop-types
    const renderElements = ({ index, onChangeIndex }) => (
        <div>
            <Button
                className={cx(classes.arrow, classes.arrowLeft)}
                classes={arrowStyles}
                disabled={index === 0}
                onClick={() => onChangeIndex(index - 1)}
            >
                <KeyboardArrowLeft />
            </Button>
            <Button
                className={cx(classes.arrow, classes.arrowRight)}
                classes={arrowStyles}
                disabled={index === data.length - 1}
                onClick={() => onChangeIndex(index + 1)}
            >
                <KeyboardArrowRight />
            </Button>
            <div className={classes.indicatorContainer}>
                {data.map(({ id }, i) => (
                    <DotIndicator
                        key={id}
                        active={i === index}
                        onClick={() => onChangeIndex(i)}
                    />
                ))}
            </div>
        </div>
    );
    const renderChildren = ({ injectStyle }) =>
        data.map(({id, title, subtitle, image, nextFilmTitle, nextFilmSubtitle, nextFilmImage, hasNextFilm}, i) => (
                <div key={id} className={classes.slide}>
                    <Typography className={cx(classes.imageContainer, classes.imageLeft)}
                                style={{...injectStyle(i, 40), transform: `rotateY(30deg)`}}>
                        <div
                            className={cx(classes.previewOverlay, classes.image)}
                        >
                            <p>{title}</p>
                            <p>{subtitle}</p>
                        </div>
                        <img className={classes.image} src={`http://localhost:7789/uploads/${image}`}
                             alt={'slide'}/>
                    </Typography>
                    {
                        hasNextFilm
                        && (
                          <Typography className={cx(classes.imageContainer, classes.imageRight)}
                                      style={{...injectStyle(i, 40), transform: `rotateY(-30deg)`}}>
                              <div
                                className={cx(classes.previewOverlay, classes.image)}
                              >
                                  <p>{nextFilmTitle}</p>
                                  <p>{nextFilmSubtitle}</p>
                              </div>
                              <img className={classes.image} src={`http://localhost:7789/uploads/${nextFilmImage}`}
                                   alt={'slide'}/>
                          </Typography>
                        )
                    }
                </div>
        ));
    return (
        <div className={classes.root}>
            <ParallaxSlide renderElements={renderElements}>
                {renderChildren}
            </ParallaxSlide>
        </div>
    );
};


export default Carousel;
