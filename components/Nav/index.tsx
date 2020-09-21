import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button
} from '@material-ui/core'

import { ArrowBack } from '@material-ui/icons';

import { useRouter } from 'next/router'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },

    }),
);

const Nav: React.FC<{}> = () => {
    const classes = useStyles()
    const router = useRouter()

    return (
        <div className='root'>
            <AppBar position="static">
                <Toolbar>
                    {router.pathname === '/'
                        ?
                        <Typography variant="h6" className='home'>
                            Home
                        </Typography>
                        :
                        <IconButton
                            className={classes.menuButton} edge="start" onClick={() => router.push('/')} color="inherit">
                            <ArrowBack />
                        </IconButton>
                    }
                    <div className='root' />
                    <div className='sectionMobile' >
                        <Button color="inherit" onClick={() => router.push('/ratings')}>My Ratings</Button>
                        <Button color="inherit" onClick={() => router.push('/login')}>Account</Button>
                    </div>
                    <div className='sectionDesktop' >
                        <Button color="inherit" onClick={() => router.push('/ratings')}>My Ratings</Button>
                        <Button color="inherit" onClick={() => router.push('/login')}>Account</Button>
                    </div>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Nav