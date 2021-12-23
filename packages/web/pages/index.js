import { useEffect, useState } from 'react'
import { styled } from '../stitches.config'
import { useApp } from '../context/AppContext'
import SafeLink from '../components/SafeLink'
import environment from '../environment/web'
import { buildOpenseaAssetUrl, openseaCollectionBaseUrl } from '../lib/url'

const fragments = Object.entries(environment.fragmentMapping)
  .map((fragment) => {
    const tokenId = fragment[0]
    return {
      tokenId,
      src: `thumbs/${fragment[1]}.jpg`,
      url: buildOpenseaAssetUrl(tokenId),
    }
  })
  .sort((a, b) => Number(a.tokenId) - Number(b.tokenId))

const Wrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: '$maxWidth',
  margin: '0 auto',
  marginTop: '30px',
  padding: '0 $pagePadding',
})

const Container = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const Video = styled('video', {
  display: 'block',
  width: '100%',
  minWidth: '100px',
  maxWidth: '450px',
  paddingRight: '25px',
})

const Information = styled('div', {
  minWidth: '300px',
  maxWidth: '45%',
  paddingLeft: '25px',
})

const Headline = styled('h1', {
  fontSize: '40px',
  marginBottom: '10px',
})

const Separator = styled('hr', {
  height: '1px',
  background: '$grey',
  border: 'none',
})

const Text = styled('p', {
  opacity: 0.5,
  lineHeight: 1.5,

  variants: {
    type: {
      label: {
        opacity: 1,
        marginRight: '10px',
      },
    },
  },
})

const SubTextLinks = styled('p', {
  opacity: 0.5,
  lineHeight: 1.5,
  fontSize: '12px',
  fontFamily: '$italic',
})

const SubHeadline = styled('h3', {
  paddingRight: '10px',
  display: 'inline',
})

const HeadlineContainer = styled('div', {
  padding: '20px 0',
})

const FragmentsContainer = styled('div', {
  marginTop: '40px',
})

const Fragments = styled('div', {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: '15px',
})

const FragmentContainer = styled('div', {
  position: 'relative',
  width: '120px',
  height: '120px',
  overflow: 'hidden',
})

const FragmentImage = styled('img', {
  width: '120px',
  height: '120px',
  variants: {
    type: {
      not_claimed: {
        // gift icon
        filter: 'blur(7px)',
      },
    },
  },
})

const GiftImage = styled('img', {
  opacity: 0.65,
  position: 'relative',
  top: '0px',
  left: '0px',
  padding: '48px',
  filter: 'none',
  transform: 'translate(0px, -119px)',
  backgroundColor: '$black',
})

const FragmentId = styled('div', {
  position: 'absolute',
  bottom: 0,
  right: 0,
  color: '$white',
  width: '28px',
  height: '25px',
  paddingTop: '2px',
  textAlign: 'center',
  variants: {
    type: {
      not_claimed: {
        display: 'none',
      },
      claimed: {
        background: '$black',
      },
      owned: {
        background: '$cherry',
      },
    },
  },
})

function Fragment({ tokenId, src, type, url, ...props }) {
  const container = (
    <FragmentContainer {...props}>
      <FragmentImage src={src} type={type} />
      {type === 'not_claimed' && <GiftImage src="present_icon.svg" type={type} />}
      <FragmentId type={type}>{tokenId}</FragmentId>
    </FragmentContainer>
  )
  return url ? <SafeLink href={url}>{container}</SafeLink> : container
}

export default function Home() {
  const { onboard, ownedFragments, claimedFragments } = useApp()

  const connectToWallet = async () => {
    try {
      await onboard.selectWallet()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Wrapper>
      <Container>
        <Video autoPlay="autoplay" loop muted>
          <source src="/animation480p.mp4" type="video/mp4" />
        </Video>
        <Information>
          <Headline>
            <em>Holidays</em> 2021.
          </Headline>
          <Text css={{ marginBottom: '15px' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur.
          </Text>
          <SubTextLinks css={{ marginBottom: '15px' }}>
            <SafeLink href="sale-and-license-rarible-variant-e.pdf" style={{ marginRight: '5px' }}>
              Terms
            </SafeLink>
            <SafeLink href={openseaCollectionBaseUrl} style={{ marginRight: '5px' }}>
              Opensea
            </SafeLink>
            <SafeLink href="https://github.com/cherry-vc/xmas-2021/" style={{ marginRight: '5px' }}>
              Github
            </SafeLink>
          </SubTextLinks>
          <Separator style={{ margin: '25px 0' }} />
          <table>
            <tbody>
              <tr>
                <td>
                  <Text type="label">Artist:</Text>
                </td>
                <td>
                  <Text>Owi SixSeven</Text>
                </td>
              </tr>
              <tr>
                <td>
                  <Text type="label">Date:</Text>
                </td>
                <td>
                  <Text>2021</Text>
                </td>
              </tr>
            </tbody>
          </table>
        </Information>
      </Container>
      <FragmentsContainer>
        <HeadlineContainer>
          <SubHeadline>Your fragments</SubHeadline>
          <Text style={{ display: 'inline' }}>
            {onboard.isWalletSelected ? `${ownedFragments.size} • ${onboard.address}` : ''}
          </Text>
        </HeadlineContainer>
        {ownedFragments.size === 0 ? (
          onboard.isWalletSelected ? (
            <Text>You don't own any fragments yet</Text>
          ) : (
            <>
              <Text style={{ display: 'inline' }}>You haven't connected your wallet yet</Text>
            </>
          )
        ) : (
          <Fragments>
            {fragments
              .filter(({ tokenId }) => ownedFragments.has(tokenId))
              .map(({ tokenId, src, url }, index) => (
                <Fragment key={index} tokenId={tokenId} src={src} url={url} type="owned" />
              ))}
          </Fragments>
        )}
        <Separator style={{ marginTop: '28px' }} />
        <HeadlineContainer>
          <SubHeadline>All fragments</SubHeadline>
          <Text style={{ display: 'inline' }}>{fragments.length}</Text>
        </HeadlineContainer>
        <Fragments>
          {fragments.map(({ tokenId, src, url }, index) => {
            const type = ownedFragments.has(tokenId)
              ? 'owned'
              : claimedFragments.has(tokenId)
              ? 'claimed'
              : 'not_claimed'
            const linkUrl = type === 'claimed' ? url : ''
            return <Fragment key={index} tokenId={tokenId} src={src} url={linkUrl} type={type} />
          })}
        </Fragments>
      </FragmentsContainer>
    </Wrapper>
  )
}
