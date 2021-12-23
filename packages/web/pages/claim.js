import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { FaChevronRight } from 'react-icons/fa'
import ethers from 'ethers'

import { styled } from '../stitches.config'
import { useApp } from '../context/AppContext'
import environment from '../environment/web'

const CenterWrapper = styled('div', {
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
})

const Container = styled('div', {
  paddingTop: '10%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const Square = styled('div', {
  width: '500px',
  height: '300px',
  background: '#EEE5D3',
  marginBottom: '32px',
})

const Headline = styled('h1', {
  marginBottom: '64px',
})

const Text = styled('p', {
  color: '$black',
  margin: '0 0 32px 0',
})

const InputRow = styled('div', {
  minWidth: '400px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
})

const Input = styled('input', {
  border: 'none',
  height: '32px',
  fontSize: '18px',
  backgroundColor: 'transparent',
  borderBottom: '1px solid $grey',
  width: '100%',
})

const Submit = styled('button', {
  background: 'none',
  border: 'none',
})

const Button = styled('button', {
  height: '30px',
  margin: 0,
  color: '$white',
  backgroundColor: '$cherry',
  border: 'none',
  flex: '1 1 0px',
  cursor: 'pointer',

  variants: {
    type: {
      secondary: {
        color: '$black',
        backgroundColor: '$white',
      },
    },
    state: {
      disabled: {
        backgroundColor: 'Grey',
      },
    },
  },
})

const ErrorField = styled('p', {
  color: 'red',
  fontSize: '18px',
})

const FragmentContainer = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 0,
})

const Fragment = styled('img', {
  margin: '0 80px',
  minWidth: '100px',
  maxWidth: '400px',
})

export default function Claim() {
  const { onboard, addOwnedPiece } = useApp()
  const [page, setPage] = useState('PASSWORD') // PASSWORD, CLAIM, CUSTODY_CHECK, DONE

  const [password, setPassword] = useState('')
  const [error, setError] = useState(null) // PASSWORD, CLAIMED, UNKNOWN
  const [tokenIdValue, setTokenIdValue] = useState(-1)
  const [txValue, setTxValue] = useState('')

  const { query } = useRouter()

  useEffect(() => {
    if (query['password']) {
      setPassword(query.password)
    }
  }, [query])

  const onPasswordUpdate = async (event) => {
    setPassword(event.target.value)
    if (error) {
      setError(null)
    }
  }

  const onSubmitPassword = async (event) => {
    event.preventDefault()

    // The hash of the password is used in the merkle node
    const keyphraseHash = ethers.utils.id(password)
    // The double hash of the password is used as the merkle leaf map's key
    const leafMapKey = ethers.utils.id(keyphraseHash)

    const merkleConfig = environment.merkle
    const leafMapNode = merkleConfig.leafMap.get(leafMapKey)

    if (!leafMapNode) {
      setError('PASSWORD')
      return
    }

    let previouslyClaimed
    try {
      const res = await fetch(`/api/claimed/${keyphraseHash}`)
      const { claimed: previouslyClaimed } = await res.json()
    } catch (err) {
      setError('UNKNOWN')
      return
    }

    if (claimed) {
      setError('CLAIMED')
      return
    }

    // Otherwise, this password is legit and we can move on!
    setPage('CLAIM')
  }

  const onKeepInCherrysVault = async () => {
    const keyphraseHash = ethers.utils.id(password)

    // TODO: check how well account only now connecting is handled
    const res = await fetch('/api/claim', {
      method: 'POST',
      body: {
        to: 'vault',
        key: keyphraseHash,
      },
    })

    // TODO: check typing on tokenId
    const { tokenId, tx } = await res.json()
    setTxValue(tx)
    setTokenIdValue(tokenId)
    addClaimedPiece(tokenId)

    // TODO: think about animation
    setPage('DONE')
  }

  const onSendToWallet = async () => {
    const keyphraseHash = ethers.utils.id(password)

    if (!onboard.isWalletSelected) {
      // TODO: catch cancelling sign in
      try {
        await onboard.selectWallet()
      } catch (error) {
        console.error(error)
      }
    }

    // TODO: check how well account only now connecting is handled
    const res = await fetch('/api/claim', {
      method: 'POST',
      body: {
        to: onboard.address,
        key: keyphraseHash,
      },
    })

    // TODO: check typing on tokenId
    const { tokenId, tx } = await res.json()
    setTxValue(tx)
    setTokenIdValue(tokenId)
    addClaimedPiece(tokenId)

    // TODO: think about animation
    setPage('DONE')
  }

  return (
    <CenterWrapper>
      {page === 'PASSWORD' && (
        <Container>
          <Square></Square>
          <Headline>Claim your holiday gift.</Headline>
          <InputRow>
            <Input
              placeholder="Enter your password"
              defaultValue={password}
              onChange={(event) => setPassword(event.target.value)}
            ></Input>
            <Submit onClick={onSubmitPassword}>
              <FaChevronRight style={{ height: '30px' }} />
            </Submit>
          </InputRow>
          {error === 'PASSWORD' && <ErrorField>Wrong password!</ErrorField>}
        </Container>
      )}
      {page === 'CLAIM' && (
        <Container>
          <Headline>Santa's on his way!</Headline>
          <Text>He just needs to know where to drop it off!</Text>
          <InputRow>
            <Button type="secondary" onClick={onKeepInCherrysVault}>
              Keep in Cherry's vault
            </Button>
            <Button onClick={onSendToWallet}>Send to wallet</Button>
          </InputRow>
          <Text>
            Don't have a wallet yet? <a href="">Install one</a>.
          </Text>
        </Container>
      )}
      {page === 'CUSTODY_CHECK' && (
        <Container>
          <Headline>Secured by your finest</Headline>
        </Container>
      )}
      {page === 'DONE' && (
        <Container>
          <Headline>Your fragment</Headline>
          <FragmentContainer>
            <Fragment src={`thumbs/${environment.fragmentMapping[tokenIdValue]}.jpg`} />
            {/*<InfoComponent headline={`#${tokenIdValue} / 777`} />*/}
          </FragmentContainer>
        </Container>
      )}
    </CenterWrapper>
  )
}
