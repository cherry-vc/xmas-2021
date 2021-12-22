import { styled } from '../stitches.config'
import { useApp } from '../context/AppContext'
import InfoComponent from '../components/InfoComponent'
import environment from '../environment/web'
import { useEffect, useState } from 'react'

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
  const { ownedPieces, setOwnedPieces, addOwnedPiece, onboard } = useApp()
  const [claimedPieces, setClaimedPieces] = useState([])

  const connectToWallet = async () => {
    try {
      await onboard.selectWallet()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetch(`/api/fragment/${onboard.address ? onboard.address : '0x00'}`).then((res) => {
      res.json().then(({ tokens }) => {
        setOwnedPieces(tokens)
      })
    })

    fetch('/api/fragments').then((res) => {
      res.json().then(({ tokens }) => {
        setClaimedPieces(tokens)
      })
    })
  }, [onboard.wallet])

  const allFragements = []
  Object.entries(environment.fragmentMapping).forEach((fragment) => {
    let state = 'not_claimed'
    const tokenId = parseInt(fragment[0])
    if (ownedPieces.includes(tokenId)) {
      state = 'owned'
    } else if (claimedPieces.includes(tokenId)) {
      state = 'claimed'
    }
    allFragements.push({
      id: tokenId,
      imageUrl: `thumbs/${fragment[1]}.jpg`,
      state: state,
    })
  })

  // Generates an error: Prop `src` did not match. Server: "thumbs/white-5.jpg" Client: "thumbs/pink-5.jpg"
  // But can be ignored
  shuffleArray(allFragements)

  const ownedFragments = allFragements.filter((f) => f.state === 'owned')

  return (
    <Wrapper>
      <Container>
        <VideoContainer>
          <Video autoPlay="autoplay" loop muted>
            <source src="/animation480p.mp4" type="video/mp4" />
          </Video>
        </VideoContainer>
        <InfoComponent headline={'Holiday 2021.'} />
      </Container>
      <FragmentContainer>
        <HeadlineContainer>
          <SubHeadline>Your fragments</SubHeadline>
          <Text style={{ display: 'inline' }}>
            {ownedFragments.length} / {allFragements.length}
          </Text>
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
          <Text style={{ display: 'inline' }}>{allFragements.length}</Text>
        </HeadlineContainer>
        <Fragments>{getFragments(allFragements)}</Fragments>
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

function shuffleArray(inputArray) {
  inputArray.sort(() => Math.random() - 0.5)
}
