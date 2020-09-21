import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import {
    Container,
    Grid,
    Typography,
    Button,
    Card,
    CardActionArea,
    CardContent,
    Chip,
    CardMedia,
    CircularProgress,
} from '@material-ui/core'

import { Rating } from '@material-ui/lab'

import { apiCall } from '../utils/apiCall'
import { IMAGE_BASE_URL, NO_IMAGE } from '../constants'

import styles from '../styles/Ratings.module.css'


const Ratings: React.FC<{}> = () => {

    const router = useRouter()
    const [userData, setUserData] = useState<any>({})
    let [ratingsData, setRatingsData] = useState<any>([])
    const [loading, setLoading] = useState<boolean>(false)

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
        if (Object.keys(userData).length > 0) {

            ratingsData = []
            setRatingsData(ratingsData)
            setLoading(true)

            if (userData.type === 'guest_session_id') {
                apiCall('get', `/guest_session/${userData.id}/rated/tv`).then((res: any) => {
                    ratingsData.push(...res.results)
                    setRatingsData([...ratingsData])
                    setLoading(false)
                }).catch(e => console.log(e))

                apiCall('get', `/guest_session/${userData.id}/rated/movies`).then((res: any) => {
                    ratingsData.push(...res.results)
                    setRatingsData([...ratingsData])
                    setLoading(false)
                }).catch(e => console.log(e))
            }
            else {
                apiCall('get', `/account/{account_id}/rated/tv`,
                    {
                        [userData.type]: userData.id
                    }).then((res: any) => {
                        ratingsData.push(...res.results)
                        setRatingsData([...ratingsData])
                        setLoading(false)
                    }).catch(e => console.log(e))

                apiCall('get', `/account/{account_id}/rated/movies`,
                    {
                        [userData.type]: userData.id
                    }).then((res: any) => {
                        ratingsData.push(...res.results)
                        setRatingsData([...ratingsData])
                        setLoading(false)
                    }).catch(e => console.log(e))
            }
        }
    }, [userData])

    return (
        <div className={styles.ratings}>

            <Head>
                <title>My Ratings</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Container className={styles.muiContainer} maxWidth="lg">
                <Grid container alignItems='center' justify='center' className={styles.container}>
                    <Grid item sm={12} xs={12}>
                        <Typography align='center' variant='h2'>My Ratings</Typography>
                    </Grid>
                    {
                        Object.keys(userData).length === 0 ?
                            <Grid item sm={6} xs={12} className={styles.mt_50}>
                                <Typography align='center' variant='h5'>You are not logged in</Typography>
                                <Grid container alignItems='center' justify='center'>
                                    <Button
                                        className={styles.mt_20}
                                        size='large'
                                        variant='outlined'
                                        color='secondary'
                                        onClick={() => router.push('/login')}
                                    >Click to Login</Button>
                                </Grid>
                            </Grid>
                            : null
                    }
                </Grid>

                <Grid container spacing={2} justify='center' className={styles.container}>
                    {ratingsData.length > 0 ?
                        ratingsData.map((elm: any, i: number) => {
                            return (
                                <Grid item sm={6} xs={12} key={i}>
                                    <Card className={styles.card} key={i}>
                                        <CardActionArea>
                                            <Grid container>
                                                <Grid item sm={9} xs={8}>
                                                    <CardContent>
                                                        <Typography className={styles.h5} variant="h5" gutterBottom>
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
                                                        <Grid container>
                                                            <Grid item xs={12} sm={3}>
                                                                <Chip
                                                                    style={{ marginTop: '15px' }}
                                                                    variant="outlined"
                                                                    color={elm.title ? 'secondary' : 'primary'}
                                                                    label={elm.title ? 'Movie' : 'TV Show'}
                                                                />
                                                            </Grid>

                                                            <Grid item xs={12} sm={9}>
                                                                <Grid container style={{alignItems: 'flex-end'}}>
                                                                    <Rating
                                                                        className={styles.rating}
                                                                        max={10}
                                                                        precision={0.5}
                                                                        value={elm.rating}
                                                                    />
                                                                    <Typography
                                                                        style={{ marginLeft: '8px'}}
                                                                     variant='body1'>{elm.rating}/10</Typography>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
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
                            <CircularProgress color='primary' />
                            :
                            <Typography className={styles.h5} variant="h5" gutterBottom>
                                You have not rated any Movie or TV Show
                            </Typography>
                    }
                </Grid>
            </Container>

        </div>
    )

}



export default Ratings