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


const Actor: React.FC<{}> = () => {

    const router = useRouter()
    const { query } = router
    const [userData, setUserData] = useState<any>({})
    const [credits, setCredits] = useState<any>([])

    useEffect(() => {
        if (query.id) {
            apiCall('get', `/person/${query.id}`).then((elm: any) => {
                setUserData({ ...elm })
            })

            apiCall('get', `/person/${query.id}/movie_credits`).then((elm: any) => {
                setCredits([...elm.cast])
            })

            apiCall('get', `/person/${query.id}/tv_credits`).then((elm: any) => {
                setCredits([...elm.cast])
            })
        }


    }, [router.query])


    return (
        <div className={styles.ratings}>

            <Head>
                <title>Actor</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Container className={styles.muiContainer} maxWidth="lg">
                <Grid container alignItems='center' justify='center' className={styles.container}>
                    <Grid item sm={12} xs={12}>
                        <Typography align='center' variant='h2'>Actor Info</Typography>
                    </Grid>
                </Grid>

                <Grid container spacing={2} justify='center' className={styles.container}>
                    <Typography variant='h3'>{userData?.name}</Typography>
                    <Grid item xs={12} sm={12}>
                        <img style={{ height: '200px' }} src={IMAGE_BASE_URL + userData?.profile_path} alt={userData?.name} />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Typography variant='body1'>{userData?.biography}</Typography>
                        <Typography variant='h6'>{userData?.birthday}</Typography>
                    </Grid>
                </Grid>

                <Grid container>

                    {
                        credits.length > 0 ?
                            credits.map((elm: any, i: number) => {
                                return (
                                    <Grid item xs={12} sm={12} key={i}>
                                        <Typography onClick={() => {
                                            router.push({
                                                pathname: 'details',
                                                query: {
                                                    type: elm.title ? 'movie' : 'tv',
                                                    id: elm.id
                                                }
                                            })
                                        }}>{elm.title ? elm.title : elm.name}</Typography>
                                    </Grid>
                                )
                            })
                            : null
                }
                </Grid>
            </Container>

        </div>
    )

}



export default Actor