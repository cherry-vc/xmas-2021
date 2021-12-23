import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { FaChevronRight } from 'react-icons/fa'

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
  color: '#000000',
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
  borderBottom: '1px solid #D8D8D8',
  width: '100%',
})

const Submit = styled('button', {
  background: 'none',
  border: 'none',
})

const Button = styled('button', {
  height: '30px',
  margin: 0,
  color: 'white',
  backgroundColor: '#E64980',
  border: 'none',
  flex: '1 1 0px',
  cursor: 'pointer',

  variants: {
    type: {
      secondary: {
        color: 'black',
        backgroundColor: 'white',
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
  const { addOwnedPiece, onboard } = useApp()
  const [password, setPassword] = useState('')
  const [txValue, setTxValue] = useState('')
  const [tokenIdValue, setTokenIdValue] = useState(-1)
  const [isWrongPassword, setWrongPassword] = useState(false)
  const [page, setPage] = useState('PASSWORD', 'CLAIM', 'DONE')
  const { query } = useRouter()

  useEffect(() => {
    if (query['password']) {
      setPassword(query.password)
    }
  }, [query])

  const onSubmitPassword = async (event) => {
    event.preventDefault()
    try {
      const res = await fetch('/api/claim', {
        method: 'POST',
        body: {
          key: password,
        },
      })

      const { tokenId, tx } = await res.json()
      if (tokenId > 0) {
        setTxValue(tx)
        setTokenIdValue(tokenId)
        setPage('CLAIM')
        return
      }
    } catch (error) {}
    setWrongPassword(true)
  }

  const onKeepInCherrysVault = () => {
    // TODO: call API
    console.log('KeepInCherrysVault')
    addOwnedPiece(tokenIdValue)
    setPage('DONE')
  }

  const onSendToWallet = async () => {
    if (onboard.isWalletSelected) {
      // TODO: call API
      console.log('SendToWallet')
      addClaimedPiece(tokenIdValue)
      setPage('DONE')
    } else {
      try {
        await onboard.selectWallet()
      } catch (error) {
        console.error(error)
      }
    }
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
          {isWrongPassword && <ErrorField>Wrong password!</ErrorField>}
        </Container>
      )}
      {page === 'CLAIM' && (
        <Container>
          <Headline>Santa's on his way!</Headline>
          <Text>He just needs to know where to drop it off!</Text>
          <InputRow>
            <Button type="secondary" onClick={() => onKeepInCherrysVault()}>
              Keep in Cherry's vault
            </Button>
            <Button onClick={() => onSendToWallet()}>
              {onboard.isWalletSelected ? 'Send to wallet' : 'Connect to wallet'}
            </Button>
          </InputRow>
          <Text>
            Don't have a wallet yet? <a href="">Install one</a>
          </Text>
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
