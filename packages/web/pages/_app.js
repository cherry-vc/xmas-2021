import Head from 'next/head'
import { AppProvider } from '../context/AppContext'
import Layout from '../components/Layout'

function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <Head>
        <title>Cherry - Xmas 2021</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  )
}

export default App
