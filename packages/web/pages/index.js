import { styled } from '../stitches.config'
import { useAppContext } from '../context/context'

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
})

const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  margin: 0,
})

const VideoContainer = styled('div', {
  width: '100%',
  padding: '0 80px 0 80px',
})

const Video = styled('video', {
  display: 'block',
  margin: 'auto',
  width: '100%',
  minWidth: '100px',
  maxWidth: '600px',
})

const Information = styled('div', {
  paddingRight: '80px',
  minWidth: '300px',
  maxWidth: '30%',
})

const Text = styled('p', {
  color: '#000000',
  opacity: 0.5,
  margin: 0,

  variants: {
    type: {
      label: {
        opacity: 1,
      },
    },
  },
})

const Headline = styled('h1', {})

const FragmentContainer = styled('div', {
  margin: '80px',
})

const Fragments = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '15px',
})

const Fragment = styled('div', {
  width: '120px',
  height: '120px',
})

const FragmentImage = styled('img', {
  width: '120px',
  height: '120px',
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
        width: '114px',
        height: '114px',
        // padding: '3px',
        border: '3px solid blue',
      },
    },
  },
})

const FragmentId = styled('div', {
  color: 'White',
  transform: 'translate(5px, -24px)',
})

const Separator = styled('hr', {
  height: '1px',
  background: '#D8D8D8',
  border: 'none',
})

export default function Home() {
  const { claimedPieces, addClaimedPiece, onboard } = useAppContext()

  const someFragments = [
    {
      id: 1,
      openseaUrl: 'https://google.com',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Colourful_square.svg/1200px-Colourful_square.svg.png',
      state: 'not_claimed',
    },
    {
      id: 2,
      openseaUrl: 'https://google.com',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Colourful_square.svg/1200px-Colourful_square.svg.png',
      state: 'claimed',
    },
    {
      id: 3,
      openseaUrl: 'https://google.com',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Colourful_square.svg/1200px-Colourful_square.svg.png',
      state: 'owned',
    },
    {
      id: 4,
      openseaUrl: 'https://google.com',
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Colourful_square.svg/1200px-Colourful_square.svg.png',
      state: 'listed',
    },
  ]

  const allFragements = JSON.parse(JSON.stringify(Array(200).fill(someFragments).flat()))
  let i = 1
  allFragements.forEach((fragment) => (fragment.id = i++))

  return (
    <Wrapper>
      <Container>
        <VideoContainer>
          <Video autoPlay="autoplay" loop muted>
            <source src="/artpiece.mov" type="video/mp4" />
          </Video>
        </VideoContainer>
        <Information>
          <Headline>Holiday 2021</Headline>
          <Text css={{ marginBottom: '15px' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur.
          </Text>
          <table>
            <tbody>
              <tr>
                <td>
                  <Text type="label">Artist:</Text>
                </td>
                <td>
                  <Text>Ari Garcia</Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Text type="label">Date:</Text>
                </td>
                <td>
                  <Text>December 2021</Text>
                </td>
              </tr>
            </tbody>
          </table>
          <Separator />
          <Text>You hold {claimedPieces.length}/600 fragments</Text>
        </Information>
      </Container>
      <FragmentContainer>
        <Headline>Owned fragments</Headline>
        <Fragments>{getFragments(allFragements.filter((f) => f.state === 'owned'))}</Fragments>
        <Headline>Other fragments</Headline>
        <Fragments>{getFragments(allFragements.filter((f) => f.state !== 'owned'))}</Fragments>
      </FragmentContainer>
    </Wrapper>
  )
}

function getFragments(fragments) {
  return (
    <Fragments>
      {fragments.map((fragment) => {
        return (
          <Fragment key={fragment.id}>
            {/* Use tooltip to show more info on fragment?
                    https://react-component.github.io/tooltip/ */}
            <a href={fragment.openseaUrl} target="_blank" rel="noopener noreferrer nofollow">
              <FragmentImage
                src={fragment.state === 'not_claimed' ? 'cherry_logo.png' : fragment.imageUrl}
                state={fragment.state}
              ></FragmentImage>
            </a>
            <FragmentId>{fragment.id}</FragmentId>
          </Fragment>
        )
      })}
    </Fragments>
  )
}
