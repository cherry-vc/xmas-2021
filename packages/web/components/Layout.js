import Link from 'next/link'
import { styled } from '../stitches.config'
import { useRouter } from 'next/router'
import Dropdown from './Dropdown'

const Header = styled('div', {
  display: 'flex',
  alignItems: 'center',
  margin: 0,
  height: '80px',
  width: '100%',
  backgroundColor: '#F6F0E4',
})

const CherryLogo = styled('img', {
  margin: '15px',
  height: '50px',
})

const NavContainer = styled('div', {
  marginLeft: 'auto',
})

const LinkText = styled('a', {
  color: 'black',
  margin: '15px',
  variants: {
    active: {
      yes: {
        cursor: 'default',
        textDecoration: 'underline',
      },
      no: {
        cursor: 'pointer',
        textDecoration: 'none',
      },
    },
  },
})

const Content = styled('div', {
  position: 'absolute',
  top: '80px',
  bottom: 0,
  margin: 0,
  width: '100%',
  backgroundColor: '#F6F0E4',
  overflowY: 'auto',
  scrollbarColor: 'gray transparent',
})

export default function Layout({ children }) {
  const router = useRouter()
  return (
    <div style={{ margin: 0 }}>
      <Header>
        <Link href="/" passHref>
          <CherryLogo src="cherry_logo.png" />
        </Link>
        <NavContainer>
          <Link href="/" passHref>
            <LinkText active={router.pathname === '/' ? 'yes' : 'no'}>Gallery</LinkText>
          </Link>
          <Link href="/claim" passHref>
            <LinkText active={router.pathname === '/claim' ? 'yes' : 'no'}>Claim</LinkText>
          </Link>
          <Dropdown />
        </NavContainer>
      </Header>
      <Content>{children}</Content>
    </div>
  )
}
