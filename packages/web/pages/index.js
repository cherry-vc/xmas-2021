import { styled } from '../stitches.config'
import { useAppContext } from '../context/context'

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
})

const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
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
  padding: 0,

  variants: {
    type: {
      label: {
        opacity: 1,
      },
    },
  },
})

const Hyperlink = styled('a', {
  color: '#E64980',
  opacity: 1,
  cursor: 'pointer',
  textDecoration: 'underline',
})

const Headline = styled('h1', {})

const SubHeadline = styled('h3', {
  paddingRight: '10px',
  display: 'inline',
})

const HeadlineContainer = styled('div', {
  padding: '20px 0',
})

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
        // gift icon
        filter: 'blur(10px)',
        transform: 'scale(0.85)',
      },
    },
  },
})

const GiftImage = styled('img', {
  opacity: 0.65,
  position: 'relative',
  top: '0px',
  left: '0px',
  padding: '45px',
  height: '30px',
  width: '30px',
  filter: 'none',
  transform: 'translate(0px, -124px)',
  backgroundColor: 'black',
})

const FragmentId = styled('div', {
  color: 'White',
  width: '28px',
  height: '23px',
  textAlign: 'center',
  paddingTop: '6px',
  transform: 'translate(92px, -33px)',
  variants: {
    state: {
      not_claimed: {
        display: 'none',
      },
      claimed: {
        background: 'black',
      },
      owned: {
        background: '#E64980',
      },
    },
  },
})

const Separator = styled('hr', {
  height: '1px',
  background: '#D8D8D8',
  border: 'none',
})

export default function Home() {
  const { claimedPieces, addClaimedPiece, onboard } = useAppContext()

  const connectToWallet = async () => {
    try {
      await onboard.selectWallet()
    } catch (error) {
      console.error(error)
    }
  }

  const someFragments = [
    {
      id: 1,
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Colourful_square.svg/1200px-Colourful_square.svg.png',
      state: 'not_claimed',
    },
    {
      id: 2,
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Colourful_square.svg/1200px-Colourful_square.svg.png',
      state: 'claimed',
    },
    {
      id: 3,
      imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Colourful_square.svg/1200px-Colourful_square.svg.png',
      state: 'owned',
    },
  ]

  const allFragements = JSON.parse(JSON.stringify(Array(280).fill(someFragments).flat()))
  let i = 1
  allFragements.forEach((fragment) => (fragment.id = i++))

  const ownedFragments = allFragements.filter((f) => f.state === 'owned')
  const otherFragments = allFragements.filter((f) => f.state !== 'owned')

  return (
    <Wrapper>
      <Container>
        <VideoContainer>
          <Video autoPlay="autoplay" loop muted>
            <source src="/artpiece.mov" type="video/mp4" />
          </Video>
        </VideoContainer>
        <Information>
          <Headline>Holiday 2021.</Headline>
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
        <HeadlineContainer>
          <SubHeadline>Your fragments</SubHeadline>
          <Text style={{ display: 'inline' }}>{ownedFragments.length}</Text>
        </HeadlineContainer>
        {ownedFragments.length === 0 ? (
          onboard.isWalletSelected ? (
            <Text>You don't own any fragments yet</Text>
          ) : (
            <>
              <Text style={{ display: 'inline' }}>You haven't connected your wallet yet. </Text>
              <Hyperlink onClick={connectToWallet}>Connect my wallet</Hyperlink>
            </>
          )
        ) : (
          <Fragments>{getFragments(ownedFragments)}</Fragments>
        )}
        <Separator style={{ marginTop: '28px' }} />
        <HeadlineContainer>
          <SubHeadline>All fragments</SubHeadline>
          <Text style={{ display: 'inline' }}>{otherFragments.length}</Text>
        </HeadlineContainer>
        <Fragments>{getFragments(otherFragments)}</Fragments>
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
            <FragmentImage src={fragment.imageUrl} state={fragment.state} />
            {fragment.state === 'not_claimed' && <GiftImage src="present_icon.svg" state={fragment.state} />}
            <FragmentId state={fragment.state}>{fragment.id}</FragmentId>
          </Fragment>
        )
      })}
    </Fragments>
  )
}
