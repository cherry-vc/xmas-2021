import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaChevronRight } from 'react-icons/fa'
import { ethers } from 'ethers'

import { styled } from '../stitches.config'
import SafeLink from '../components/SafeLink'
import { useApp } from '../context/AppContext'
import environment from '../environment/web'
import { buildBlockExplorerTxLink } from '../lib/url'
import { debug } from '../lib/utils'

const Container = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '32px',
  padding: '0 $pagePadding',
  paddingTop: '40px',
})

const GiftboxImage = styled('img', {
  height: '337px',
  marginBottom: '32px',
})

const Headline = styled('h1', {
  textAlign: 'center',
  marginBottom: '30px',
})

const PasswordForm = styled('form', {
  position: 'relative',
  width: '330px', // align with header text
})

const Input = styled('input', {
  border: 'none',
  height: '32px',
  width: '100%',
  fontSize: '18px',
  backgroundColor: 'transparent',
  borderBottom: '1px solid $grey',
  paddingRight: '40px', // give space for button placed above
})

const Submit = styled('button', {
  position: 'absolute',
  right: 0,
  padding: '9px 0 9px 9px',
  background: 'none',
  border: 'none',
  userSelect: 'none',
})

const ErrorField = styled('p', {
  opacity: 0.5,
  width: '330px',
  fontSize: '13px',
  fontFamily: '$italic',
  marginTop: '10px',
})

const ButtonRow = styled('div', {
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
})

const Button = styled('button', {
  height: '40px',
  color: '$white',
  backgroundColor: '$cherry',
  border: 'none',
  flex: '1 1 0px',

  variants: {
    type: {
      secondary: {
        color: '$black',
        backgroundColor: '$white',
      },
    },
    disabled: {
      true: {
        backgroundColor: 'Grey',
      },
    },
  },
})

const InstallWalletLink = styled(SafeLink, {
  color: '$cherry',
})

const TeamImage = styled('img', {
  height: '367px',
  marginBottom: '32px',
})

const FragmentContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
})

const Fragment = styled('img', {
  minWidth: '100px',
  maxWidth: '400px',
})

const GalleryLink = styled('a', {
  padding: '20px',
})

export default function Claim() {
  const { onboard, connectToWallet, addOwnedFragment } = useApp()
  const [page, setPage] = useState('PASSWORD') // PASSWORD, CLAIM, CUSTODY_CHECK, DONE

  const [password, setPassword] = useState('')
  const [keyhash, setKeyhash] = useState('')
  const [error, setError] = useState(null) // PASSWORD, CLAIMED, UNKNOWN
  const [claiming, setClaiming] = useState(false)
  const [claimedTokenId, setClaimedTokenId] = useState(-1)
  const [txHash, setTxHash] = useState('')

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

    try {
      const res = await fetch(`/api/claimed/${leafMapNode.leaf}`)
      const { claimed } = await res.json()

      if (claimed) {
        setError('CLAIMED')
        return
      }
    } catch (err) {
      setError('UNKNOWN')
      return
    }

    // Otherwise, this password is legit and we can move on!
    setPage('CLAIM')
    setKeyhash(keyphraseHash)
  }

  const onSendToCherry = () => {
    setPage('CUSTODY_CHECK')
  }

  const onSendToWallet = async () => {
    if (environment.demoClaim) {
      debug('Demo mode: progressing to next step: DONE')
      setPage('DONE')
      setClaimedTokenId(1)
      return
    }
    setClaiming(true)

    const res = await fetch('/api/claim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: onboard.address,
        key: keyhash,
      }),
    })

    const { tokenId, tx } = await res.json()
    setClaiming(false)
    setTxHash(tx)
    setClaimedTokenId(tokenId)
    addOwnedFragment(tokenId)

    // TODO: think about animation
    setPage('DONE')
  }

  const onKeepInCherrysVault = async () => {
    if (environment.demoClaim) {
      debug('Demo mode: progressing to next step: DONE')
      setPage('DONE')
      setClaimedTokenId(1)
      return
    }
    setClaiming(true)

    const res = await fetch('/api/claim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'vault',
        key: keyhash,
      }),
    })

    const { tokenId, tx } = await res.json()
    setClaiming(false)
    setTxHash(tx)
    setClaimedTokenId(tokenId)
    addOwnedFragment(tokenId)

    // TODO: think about animation
    setPage('DONE')
  }

  const displayTxHash = !!txHash ? `${txHash.substring(0, 36)}…` : ''

  return (
    <Container>
      {page === 'PASSWORD' && (
        <>
          <GiftboxImage src="/giftbox.jpg" alt="Giftbox" />
          <Headline>
            Claim your <em>holiday</em> gift.
          </Headline>
          <PasswordForm onSubmit={onSubmitPassword}>
            <Input placeholder="Enter your password" defaultValue={password} onChange={onPasswordUpdate}></Input>
            <Submit onClick={onSubmitPassword}>
              <img src="/arrow.svg" alt="" />
            </Submit>
          </PasswordForm>
          {error === 'PASSWORD' && (
            <ErrorField>
              Oops, <span style={{ fontFamily: 'initial' }}>that</span> one wasn't in Santa's books...
            </ErrorField>
          )}
          {error === 'CLAIMED' && (
            <ErrorField>
              Oops, this one's already been claimed!
              <br />
              Santa can't just print these out like Powell can!
            </ErrorField>
          )}
          {error === 'UNKNOWN' && (
            <ErrorField>Oops, we're not sure what went wrong but the holiday elves are on it!</ErrorField>
          )}
        </>
      )}
      {page === 'CLAIM' && (
        <>
          <Headline css={{ marginTop: '80px' }}>
            Santa's <em>on his way!</em>
          </Headline>
          <p style={{ marginBottom: '32px' }}>He just needs to know where to drop it off!</p>
          <ButtonRow>
            <Button type="secondary" onClick={onSendToCherry}>
              Keep in Cherry's vault
            </Button>
            <Button disabled={claiming} onClick={onboard.isWalletSelected ? onSendToWallet : connectToWallet}>
              {onboard.isWalletSelected ? 'Send to wallet' : 'Connect wallet'}
            </Button>
          </ButtonRow>
          <p style={{ marginTop: '10px' }}>
            Don't have a wallet yet?{' '}
            <InstallWalletLink href="https://ethereum.org/en/wallets">Install one</InstallWalletLink>.
          </p>
        </>
      )}
      {page === 'CUSTODY_CHECK' && (
        <>
          <Headline>
            Thanks for your trust, <em>you're in good hands</em>
          </Headline>
          <TeamImage src="/custody.jpg" alt="Your finest custodians" />
          <p style={{ fontSize: '14px', marginBottom: '5px' }}>
            Please contact us with this password if you'd like us to return it:
          </p>
          <p style={{ fontSize: '14px', opacity: 0.5, marginBottom: '32px' }}>{password}</p>
          <ButtonRow css={{ maxWidth: '150px' }}>
            <Button disabled={claiming} onClick={onKeepInCherrysVault}>
              Let's gooo
            </Button>
          </ButtonRow>
        </>
      )}
      {page === 'DONE' && (
        <>
          <Headline>
            Hohoho, look what <em>Santa</em> brought!
          </Headline>
          <FragmentContainer>
            <Fragment src={`full_frames/${environment.fragmentMapping[claimedTokenId]}.jpg`} />
            {/*<InfoComponent headline={`#${claimedTokenId} / 777`} />*/}
            <Link href="/" passHref>
              <GalleryLink>
                View collection
                <img style={{ display: 'inline-block', height: '12px', marginLeft: '10px' }} src="/arrow.svg" alt="" />
              </GalleryLink>
            </Link>
          </FragmentContainer>
          <p style={{ fontSize: '12px', opacity: 0.5 }}>
            Mint transaction (Polygon): <SafeLink href={buildBlockExplorerTxLink(txHash)}>{displayTxHash}</SafeLink>
          </p>
          <p style={{ fontSize: '12px', opacity: 0.5 }}>
            Asset may take a few minutes to appear on marketplaces such as Opensea
          </p>
        </>
      )}
    </Container>
  )
}
