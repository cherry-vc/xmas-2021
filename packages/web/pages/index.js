import { useEffect, useState } from 'react'
import { styled } from '../stitches.config'
import { useApp } from '../context/AppContext'
import SafeLink from '../components/SafeLink'
import environment from '../environment/web'
import { buildOpenseaAssetUrl, openseaCollectionBaseUrl } from '../lib/url'

const fragments = Object.entries(environment.fragmentMapping)
  .map((fragment) => {
    const tokenId = parseInt(fragment[0], '10')
    return {
      tokenId,
      src: `thumbs/${fragment[1]}.jpg`,
      url: buildOpenseaAssetUrl(tokenId),
    }
  })
  .sort((a, b) => a.tokenId - b.tokenId)

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
  maxWidth: '460px',
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

const TextLink = styled(SafeLink, {
  opacity: 0.5,
  lineHeight: 1.5,
})

const SubText = styled('p', {
  opacity: 0.5,
  lineHeight: 1.5,
  fontSize: '12px',
})

const DetailTable = styled('table', {
  fontSize: '14px',
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
      <FragmentImage src={src} alt={`Fragment #${tokenId}`} type={type} />
      {type === 'not_claimed' && <GiftImage src="present_icon.svg" alt="" type={type} />}
      <FragmentId type={type}>{tokenId}</FragmentId>
    </FragmentContainer>
  )
  return url ? <SafeLink href={url}>{container}</SafeLink> : container
}

export default function Home() {
  const { onboard, ownedFragments, claimedFragments } = useApp()

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
            "The Unicorn" explores the possibility of highlighting its powerful image within an aseptic and neutral
            space. The light that Cherry emits reflects and impacts directly on the creation and contemplation of this
            icon. Creating a direct connection between admiration and respect for this mythological figure.
          </Text>
          <SubText css={{ marginBottom: '15px' }}>
            A special showpiece for the holidays, created with the intention of celebrating and sharing what has been
            achieved in 2021. Commission and royalty proceeds committed to a charitable cause.
          </SubText>
          <SubText css={{ fontFamily: '$italic', marginBottom: '15px' }}>
            <SafeLink href="sale-and-license-rarible-variant-e.pdf" style={{ marginRight: '5px' }}>
              Terms
            </SafeLink>
            <SafeLink href={openseaCollectionBaseUrl} style={{ marginRight: '5px' }}>
              Opensea
            </SafeLink>
            <SafeLink href="https://github.com/cherry-vc/xmas-2021/" style={{ marginRight: '5px' }}>
              Github
            </SafeLink>
          </SubText>
          <Separator style={{ margin: '20px 0' }} />
          <DetailTable>
            <tbody>
              <tr>
                <td>
                  <Text type="label">Artist:</Text>
                </td>
                <td>
                  <TextLink href="https://theartofvisual.com">Owi Sixseven</TextLink>
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
              <tr>
                <td>
                  <Text type="label">Royalties:</Text>
                </td>
                <td>
                  <Text>10%</Text>
                </td>
              </tr>
            </tbody>
          </DetailTable>
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
          <Fragments css={{ justifyContent: 'flex-start' }}>
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
