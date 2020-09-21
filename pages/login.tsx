import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

import {
    Container,
    Grid,
    Typography,
    Button,
    CircularProgress,
} from '@material-ui/core'

import { apiCall } from '../utils/apiCall'

import styles from '../styles/Login.module.css'
import { ArrowBack, ExitToApp } from '@material-ui/icons'

const Login: React.FC<{}> = () => {

    const router = useRouter()
    const [userData, setUserData] = useState<any>({})
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

    const guestLogin = () => {
        apiCall('get', 'authentication/guest_session/new').then((res: any) => {
            if (res.success === true) {
                localStorage.setItem('guest_session_id', res.guest_session_id)
                setUserData({
                    type: 'guest_session_id',
                    id: localStorage.getItem('guest_session_id')
                })
                router.push('/')
            }
        }).catch(e => console.log(e))
    }

    const sessionLogin = () => {
        apiCall('get', '/authentication/token/new').then((res: any) => {
            if (res.success === true) {
                setLoading(true)
                router.push(`https://www.themoviedb.org/authenticate/${res.request_token}?redirect_to=http://localhost:3000/login`)
            }
        }).catch(e => console.log(e))
    }

    useEffect(() => {
        if (router.query.request_token) {
            setLoading(true)
            apiCall('post', '/authentication/session/new', {
                request_token: router.query.request_token
            }).then((res: any) => {
                setLoading(false)
                if (res.success === true) {
                    localStorage.setItem('session_id', res.session_id)
                    setUserData({
                        type: 'session_id',
                        id: localStorage.getItem('session_id')
                    })
                    router.push('/')
                }
            }).catch(e => {
                console.log(e)
                setLoading(false)
            })
        }
        return
    }, [router.query])

    return (
        <div className={styles.ratings}>

            <Head>
                <title>Login</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Container className={styles.muiContainer} maxWidth="lg">
                <Grid container alignItems='center' justify='center' className={styles.container}>
                    {loading ? 
                        <CircularProgress color='primary' /> : null
                    }
                    {
                        !loading && Object.keys(userData).length > 0 ?
                            <>
                                <Typography variant='h5'>You are already logged in.</Typography>
                                &nbsp; &nbsp;<Button
                                    onClick={() => {
                                        localStorage.removeItem('guest_session_id')
                                        localStorage.removeItem('session_id')
                                        router.reload()
                                    }}
                                    size='large' variant='contained' color='secondary' startIcon={<ExitToApp />}>Log Out</Button>
                                &nbsp; &nbsp;<Button
                                    onClick={() => router.back()}
                                    size='large' variant='outlined' color='primary' startIcon={<ArrowBack />}>Go Back</Button>
                            </>
                            :
                            <>
                                <Typography variant='h5' gutterBottom>You are not logged in.</Typography>
                                <Grid item xs={12} sm={12}>
                                    <Grid container className={styles.mt_20} alignItems='center' justify='center'>
                                        <Grid item xs={12} sm={12}>
                                            <Typography color='textSecondary' variant='h6' gutterBottom>Select any one option to login</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={12} className={styles.mt_50}>
                                            <Button
                                                onClick={() => sessionLogin()}
                                                size='large' color='primary' variant='outlined'>Session Login</Button>
                                        </Grid>

                                        <Grid item xs={12} sm={12} className={styles.mt_20}>
                                            <Button
                                                onClick={() => guestLogin()}
                                                size='large' color='primary' variant='contained'>Guest Session Login
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                    }
                </Grid>
            </Container>

        </div>
    )

}



export default Login