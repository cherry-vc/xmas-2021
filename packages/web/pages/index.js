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
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '15px',
})

const Fragment = styled('div', {
  width: '80px',
  height: '80px',
})

const FragmentImage = styled('img', {
  width: '80px',
  height: '80px',
  variants: {
    state: {
      not_claimed: {
        // nothing
      },
      claimed: {
        filter: 'grayscale(100%)',
      },
      owned: {
        // nothing
      },
      listed: {
        width: '72px',
        height: '72px',
        padding: '3px',
        border: '3px solid blue',
      },
    },
  },
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
  const someFragments = [
    {
      openseaUrl: 'https://google.com',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Colourful_square.svg/1200px-Colourful_square.svg.png',
      state: 'not_claimed',
    },
    {
      openseaUrl: 'https://google.com',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Colourful_square.svg/1200px-Colourful_square.svg.png',
      state: 'claimed',
    },
    {
      openseaUrl: 'https://google.com',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Colourful_square.svg/1200px-Colourful_square.svg.png',
      state: 'owned',
    },
    {
      openseaUrl: 'https://google.com',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Colourful_square.svg/1200px-Colourful_square.svg.png',
      state: 'listed',
    },
  ]

  const allFragements = Array(5).fill(someFragments).flat()

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
                    {/* Use tooltip to show more info on fragment?
                    https://react-component.github.io/tooltip/ */}
                    <a href={fragment.openseaUrl} target="_blank">
                      <FragmentImage
                        src={fragment.state === 'not_claimed' ? 'cherry_logo.png' : fragment.imageUrl}
                        state={fragment.state}
                      ></FragmentImage>
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
