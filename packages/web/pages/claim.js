import { useAppContext } from '../context/context'
import { FaChevronRight } from 'react-icons/fa'
import { styled } from '../stitches.config'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

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

export default function Claim() {
  const { claimedPieces, addClaimedPiece, onboard } = useAppContext()
  const [password, setPassword] = useState('')
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
    const res = await fetch(`/api/check?password=${password}`)
    const { valid } = await res.json()
    if (valid) {
      setPage('CLAIM')
      return
    }
    setWrongPassword(true)
  }

  const onKeepInCherrysVault = () => {
    // TODO: call API
    console.log('KeepInCherrysVault')
    setPage('DONE')
  }

  const onSendToWallet = async () => {
    if (onboard.isWalletSelected) {
      // TODO: call API
      console.log('SendToWallet')
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
          <Square></Square>
        </Container>
      )}
    </CenterWrapper>
  )
}
