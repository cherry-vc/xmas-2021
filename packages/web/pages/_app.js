import { AppWrapper } from '../context/context'
import Layout from '../components/Layout'

function App({ Component, pageProps }) {
  return (
    <AppWrapper>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppWrapper>
  )
}

export default App
