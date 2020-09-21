import '../styles/globals.css'
import '../styles/nav.css'

import Nav from '../components/Nav'

import React from 'react'


function MyApp({ Component, pageProps }) {

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
