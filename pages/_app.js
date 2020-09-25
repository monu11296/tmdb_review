import '../styles/globals.css'
import '../styles/nav.css'

import { useRouter } from 'next/router'

import Nav from '../components/Nav'

import React, { useEffect } from 'react'


function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    if (router.pathname !== '/' || router.pathname !== 'login' || router.pathname !== 'ratings') {
      router.push('/')
    }
  }, [])

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <div>
      <Nav />
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
