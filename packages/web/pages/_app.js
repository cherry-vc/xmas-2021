import { AppProvider } from '../context/AppContext'
import Layout from '../components/Layout'

function App({ Component, pageProps }) {
  return (
    <AppProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppProvider>
  )
}

export default App
