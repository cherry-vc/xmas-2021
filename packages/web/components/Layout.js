import React from 'react'
import Link from 'next/link'
import { styled } from '../stitches.config'
import { useRouter } from 'next/router'
import WalletDropdown from './WalletDropdown'

// In general make the header look roughly similar to cherry.vc
const Header = styled('div', {
  maxWidth: '$maxWidth',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  height: '81px',
  padding: '10px $pagePadding',
  backgroundColor: '$beige',
})

const CherryLogo = styled('img', {
  height: '27px',
})

const NavContainer = styled('div', {
  marginLeft: 'auto',
})

const LinkText = styled('a', {
  marginX: '20px',
  paddingY: '4px',
  variants: {
    active: {
      yes: {
        cursor: 'default',
        borderBottom: '1px solid $black',
      },
      no: {
        cursor: 'pointer',
      },
    },
  },
})

const Content = styled('div', {
  position: 'absolute',
  top: '81px',
  bottom: 0,
  width: '100%',
  overflowY: 'auto',
  scrollbarColor: 'gray transparent',
})

export default function Layout({ children }) {
  const router = useRouter()
  return (
    <div>
      <Header>
        <a href="https://cherry.vc">
          <CherryLogo src="cherry_logo.png" />
        </a>
        <NavContainer>
          <Link href="/" passHref>
            <LinkText active={router.pathname === '/' ? 'yes' : 'no'}>Gallery</LinkText>
          </Link>
          <Link href="/claim" passHref>
            <LinkText active={router.pathname === '/claim' ? 'yes' : 'no'}>Claim</LinkText>
          </Link>
          <WalletDropdown />
        </NavContainer>
      </Header>
      <Content>{children}</Content>
    </div>
  )
}
