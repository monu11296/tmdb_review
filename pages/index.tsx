import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'

import { apiCall } from '../utils/apiCall'
import { IMAGE_BASE_URL, NO_IMAGE } from '../constants'


import {
    Input,
    Select,
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    Typography,
    Grid,
    Container,
    Chip,
    CircularProgress,
    Button
} from '@material-ui/core';
import { Search, Close } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    h5: {
        fontWeight: 500
    },
});

const Home: React.FC<{}> = () => {
    const router = useRouter();
    const classes = useStyles();
    let [dataMoviesTvShows, setDataMoviesTvShows] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)

    let [searchKeyword, setSearchKeyword] = useState<string>('')

    useEffect(() => {

        if (searchKeyword.length > 2) {
            setLoading(true)
        }

        const makeAPICall = setTimeout(() => {
            if (searchKeyword.length > 2) {
                dataMoviesTvShows = []
                setDataMoviesTvShows(dataMoviesTvShows)

                apiCall('get', '/search/movie', {
                    query: searchKeyword
                }).then((elm: any) => {
                    dataMoviesTvShows.push(...elm.results)
                    setDataMoviesTvShows([...dataMoviesTvShows])
                    setLoading(false)
                }).catch(e => {
                    dataMoviesTvShows = []
                    setDataMoviesTvShows(dataMoviesTvShows)
                    setLoading(false)
                })

                apiCall('get', '/search/tv', {
                    query: searchKeyword
                }).then((elm: any) => {
                    dataMoviesTvShows.push(...elm.results)
                    setDataMoviesTvShows([...dataMoviesTvShows])
                    setLoading(false)
                }).catch(e => {
                    dataMoviesTvShows = []
                    setDataMoviesTvShows(dataMoviesTvShows)
                    setLoading(false)
                })
            }
        }, 1000)

        return () => clearTimeout(makeAPICall)
    }, [searchKeyword])

    const getDetails = (id: number, type: string) => {
        router.push({
            pathname: '/details',
            query: { id: id, type: type }
        })
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Movies & TV Shows Search based on TMDB API</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <Typography variant='h2' className={styles.title}>
                    Lookup Movies & TV Shows
                </Typography>

                <Container maxWidth="lg" className={styles.muiContainer}>
                    <Grid container justify='center' alignItems='center'>
                        <Grid item sm={2} xs={12}></Grid>
                        <Grid item sm={4} xs={12}>
                            <Input
                                value={searchKeyword}
                                className={styles.inputSearch}
                                placeholder='Type to Search'
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchKeyword(e.target.value)}
                                endAdornment={<Search />}
                            />
                        </Grid>
                        <Grid item sm={2} xs={12}>
                            <Grid container justify='center' alignItems='center'>
                                <Button
                                    onClick={() => {
                                        setSearchKeyword('')
                                        setDataMoviesTvShows([])
                                    }}
                                    disabled={searchKeyword.length === 0}
                                    variant='contained'
                                    endIcon={<Close />}
                                >
                                    Clear
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item sm={2} xs={12}>
                        </Grid>
                    </Grid>

                    <Grid container spacing={2} justify='center'>
                        {dataMoviesTvShows.length > 0 ?
                            dataMoviesTvShows.map((elm: any, i: number) => {
                                return (
                                    <Grid item sm={6} xs={12} key={i}>
                                        <Card className={styles.card} key={i}>
                                            <CardActionArea onClick={() => getDetails(elm.id, elm.title ? 'movie' : 'tv')}>
                                                <Grid container>
                                                    <Grid item sm={9} xs={8}>
                                                        <CardContent>
                                                            <Typography className={classes.h5} variant="h5" gutterBottom>
                                                                {elm.title ? elm.title : elm.name}
                                                            </Typography>
                                                            <Typography variant="body1" gutterBottom color='textSecondary'>
                                                                {elm.overview
                                                                    ? elm.overview.length > 100
                                                                        ? elm.overview.substring(0, 100) + '...'
                                                                        : elm.overview
                                                                    : 'No Description'
                                                                }
                                                            </Typography>
                                                            <Chip
                                                                style={{ marginTop: '15px' }}
                                                                variant="outlined"
                                                                color={elm.title ? 'secondary' : 'primary'}
                                                                label={elm.title ? 'Movie' : 'TV Show'}
                                                            />
                                                            &nbsp;&nbsp;
                                                            {elm.vote_average ?
                                                                <Chip style={{ marginTop: '15px' }} label={`Average Vote: ${elm.vote_average}`} />
                                                                : null
                                                            }
                                                        </CardContent>
                                                    </Grid>
                                                    <Grid item sm={3} xs={4}>
                                                        <CardMedia
                                                            className={styles.media}
                                                            title={elm.original_title ? elm.original_title : elm.original_name}
                                                            image={
                                                                elm.poster_path
                                                                    ? IMAGE_BASE_URL + elm.poster_path
                                                                    : NO_IMAGE
                                                            }
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                )
                            })
                            :
                            loading ?
                                <Grid item sm={1} xs={1}>
                                    <CircularProgress style={{ marginTop: '20px' }} />
                                </Grid>
                                : null
                        }
                    </Grid>
                </Container>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
                </a>
            </footer>
        </div>
    )
}

export default Home