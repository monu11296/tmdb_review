import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import { apiCall } from '../utils/apiCall'
import { IMAGE_BASE_URL, NO_IMAGE } from '../constants'

import styles from '../styles/Details.module.css'

import {
    Chip,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Button,
    CircularProgress,
    Snackbar
} from '@material-ui/core'

import { Rating } from '@material-ui/lab'

import { makeStyles } from '@material-ui/core/styles';


const Details: React.FC<{}> = () => {
    let [detailsData, setDetailsData]: any = useState({})
    const [loading, setLoading] = useState<boolean>(false)
    const [rating, setRating] = useState<number>(0)
    const [userData, setUserData] = useState<any>({})
    const [ratingSuccess, setRatingSuccess] = useState<boolean>(false)
    const [showSnack, setShowSnack] = useState<boolean>(false)
    const [credits, setCredits] = useState<any>([])

    const router = useRouter()
    const { query } = router

    useEffect(() => {
        if (localStorage.getItem('guest_session_id') !== null) {
            setUserData({
                type: 'guest_session_id',
                id: localStorage.getItem('guest_session_id')
            })
            return
        }
        if (localStorage.getItem('session_id') !== null) {
            setUserData({
                type: 'session_id',
                id: localStorage.getItem('session_id')
            })
            return
        }
    }, [])

    useEffect(() => {
        if (query.type && query.id) {
            setLoading(true)
            apiCall('get', `/${query.type}/${query.id}`).then((res: any) => {
                setDetailsData(res)
                setLoading(false)
            }).catch(e => {
                setLoading(false)
                console.log(e)
            })

            if (query.type === 'movie') {
                apiCall('get', `/movie/${query.id}/credits`).then((res: any) => {
                    if (Object.keys(res.cast).length > 0) {
                        setCredits(res.cast)
                        return
                    }
                    // apiCall('get', `/person/${res.cast[0].id}`).then((elm: any) => {
                    //     console.log(elm)
                    // })
                })
            }
            if (query.type === 'tv') {
                apiCall('get', `/tv/${query.id}/credits`).then((res: any) => {
                    if (Object.keys(res.cast).length > 0) {
                        setCredits(res.cast)
                        return
                    }
                    // apiCall('get', `/person/${res.cast[0].id}`).then((elm: any) => {
                    //     console.log(elm)
                    // })
                })
            }
        }

        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })

    }, [router.query])


    const addRating = () => {
        setRatingSuccess(true)
        setShowSnack(false)
        apiCall('post', `/${query.type}/${query.id}/rating`,
            { value: rating, [userData.type]: userData.id }
        ).then((res: any) => {
            if (res.success === true) {
                setShowSnack(true)
                setRatingSuccess(false)
            }
        }).catch(e => {
            setRatingSuccess(false)
        })
    }

    return (
        <div className={styles.details}>

            <Head>
                <title>Details</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container className={styles.muiContainer} maxWidth="lg">

                {detailsData && Object.keys(detailsData).length > 0 ?
                    <Grid container className={styles.container}>
                        <Grid item xs={12} sm={4}>
                            <img className={styles.image}
                                src={detailsData.poster_path ? IMAGE_BASE_URL + detailsData.poster_path : NO_IMAGE}
                                alt={detailsData.name} />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Typography variant='h3' className={styles.h3}>
                                {`${query.type === 'tv' ? detailsData.name : detailsData.title} 
                                (${query.type === 'tv'
                                        ? new Date(detailsData.first_air_date).getFullYear()
                                        : new Date(detailsData.release_date).getFullYear()})
                                `}
                            </Typography>

                            {detailsData?.overview ?
                                <>
                                    <Typography variant='h5' className={styles.mt_20}>
                                        Overview
                                    </Typography>
                                    <Typography variant='body1' color='textSecondary' className={styles.mt_10}>
                                        {detailsData.overview}
                                    </Typography>
                                </>
                                : null
                            }

                            {query.type === 'tv' ?
                                <Typography variant='body2' className={styles.mt_20}>{`First Air Date:  ${detailsData.first_air_date}`}</Typography>
                                :
                                <Typography variant='body2' className={styles.mt_20}>{`Released On :  ${detailsData.release_date}`}</Typography>
                            }


                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <>
                                        <div className={styles.mt_20}>
                                            {
                                                detailsData?.genres ?

                                                    detailsData?.genres.map((genres: any) => {
                                                        return (
                                                            <Chip key={genres.id} className={styles.chip} variant='default' color='secondary' label={genres.name} />
                                                        )
                                                    })
                                                    : null
                                            }
                                        </div>
                                        <Chip
                                            className={styles.chip}
                                            variant='outlined' color='primary'
                                            label={`Total Ratings:  ${detailsData.vote_count}`}
                                        />
                                        <Chip
                                            className={styles.chip}
                                            variant='outlined' color='primary'
                                            label={`Average Rating:  ${detailsData.vote_average * 10}%`}
                                        />
                                    </>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    {
                                        query.type === 'tv' ?
                                            <>
                                                <Typography variant='body1' className={styles.mt_20}>{`Seasons:  ${detailsData.number_of_seasons}`}</Typography>
                                                <Typography variant='body1'>{`Total Episodes:  ${detailsData.number_of_episodes}`}</Typography>
                                            </>
                                            : null
                                    }
                                </Grid>
                                {
                                    Object.keys(credits).length > 0 ?
                                        credits?.map((elm: any, i: number) => {
                                            return (
                                                <Grid item xs={12} sm={12}>
                                                    <Typography key={i} onClick={() => router.push(`/actor?id=${elm.id}`)}>{elm?.name}</Typography>
                                                </Grid>
                                            )
                                        })
                                        : null
                                }

                            </Grid>

                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card className={styles.card}>
                                <CardContent>
                                    <Typography align='center' variant='h5'>
                                        {`Want to add rating for this ${query.type === 'tv' ? 'TV Show' : 'Movie'} ?`}</Typography>
                                    {
                                        Object.keys(userData).length > 0 ?
                                            <Grid container alignItems='center' justify='center'>
                                                <Grid item xs={12} sm={12} className={styles.mt_10}>
                                                    <Grid container alignItems='center' justify='center'>
                                                        <Grid item xs={12} sm={10}>
                                                            <Rating
                                                                className={styles.rating}
                                                                size="large"
                                                                value={rating}
                                                                name='rating'
                                                                max={10}
                                                                precision={0.5}
                                                                onChange={(event, newValue) => {
                                                                    setRating(newValue);
                                                                }}
                                                            />
                                                        </Grid>
                                                        {rating ?
                                                            <Grid item xs={3} sm={2}>
                                                                <Typography
                                                                    style={{ fontWeight: 500 }}
                                                                    variant='h5' color='primary'
                                                                >
                                                                    {rating}/10
                                                                </Typography>
                                                            </Grid>
                                                            : null}
                                                    </Grid>

                                                </Grid>
                                                <Grid item xs={12} sm={12} className={styles.mt_20}>
                                                    <Grid container alignItems='center' justify='center'>
                                                        <Grid item xs={7} sm={4}>
                                                            {rating ?
                                                                <Button
                                                                    size='large'
                                                                    variant='contained'
                                                                    color='secondary'
                                                                    onClick={() => addRating()}
                                                                    disabled={ratingSuccess}
                                                                >
                                                                    Submit Rating
                                                            </Button>
                                                                : null}
                                                        </Grid>
                                                        {ratingSuccess ?
                                                            <Grid item xs={2} sm={2}>
                                                                <CircularProgress />
                                                            </Grid>
                                                            : null}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            :
                                            <Grid container className={styles.mt_20} alignItems='center' justify='center'>
                                                <Grid item xs={6} sm={4}>
                                                    <Typography color='textSecondary' variant='body1'>
                                                        You are not logged in
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={6} sm={4}>
                                                    <Button variant='outlined' color='primary' onClick={() => router.push('/login')}>
                                                        Click to login
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                    }
                                </CardContent>
                            </Card>
                            <Snackbar
                                anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
                                open={showSnack}
                                onClose={() => setShowSnack(false)}
                                autoHideDuration={3000}
                                message="Your Rating was submitted Successfully !" />
                        </Grid>
                    </Grid>
                    : loading ?
                        <CircularProgress style={{ marginTop: '20px' }} />
                        :
                        <>
                            <Typography className={styles.mt_20} variant='h6'>No Data to load</Typography>
                            <Button onClick={() => router.push('/')} className={styles.mt_20} size='large' variant='contained' color='primary'>Go Back</Button>
                        </>
                }
            </Container>
        </div >
    )
}

export default Details