import { styled } from '../stitches.config'
import Layout from '../components/Layout'

const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  margin: 0,
})

const ArtContainer = styled('div', {
  width: '100%',
  padding: '0 80px 80px 80px',
})

const Artpiece = styled('div', {
  width: '100%',
  flexGrow: 1,
})

const Image = styled('img', {
  display: 'block',
  margin: 'auto',
  width: '100%',
  maxWidth: '600px',
})

const Fragments = styled('div', {
  marginTop: '80px',
  display: 'flex',
  gap: '15px',
})

const Fragment = styled('div', {
  width: '80px',
  height: '80px',
})

const FragmentImage = styled('img', {
  width: '80px',
  height: '80px',
})

const Information = styled('div', {
  paddingRight: '80px',
  minWidth: '300px',
  maxWidth: '30%',
})

const Headline = styled('h1', {})

const Description = styled('p', {
  color: '#D8D8D8',
})

export default function Home() {
  const allFragements = [
    {
      openseaUrl: 'https://google.com',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Black_square.jpg',
      state: 'owned',
    },
    {
      openseaUrl: 'https://google.com',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Black_square.jpg',
      state: 'listed',
    },
  ]
  return (
    <Layout>
      <Container>
        <ArtContainer>
          <Artpiece>
            <Image src="https://upload.wikimedia.org/wikipedia/commons/9/99/Black_square.jpg"></Image>
            <Fragments>
              {allFragements.map((fragment) => {
                return (
                  <Fragment>
                    <a href={fragment.openseaUrl} target="_blank">
                      <FragmentImage src={fragment.imageUrl}></FragmentImage>
                    </a>
                  </Fragment>
                )
              })}
            </Fragments>
          </Artpiece>
        </ArtContainer>
        <Information>
          <Headline>Holiday 2021</Headline>
          <Description>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur.
          </Description>
        </Information>
      </Container>
    </Layout>
  )
}
