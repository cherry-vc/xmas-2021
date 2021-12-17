import { styled } from '../stitches.config'

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

const Link = styled('a', {
  color: 'black',
  margin: '15px',
  textDecoration: 'none',
})

const WalletButton = styled('button', {
  height: '30px',
  margin: '15px',
  color: 'white',
  backgroundColor: '#E64980',
  border: 'none',
})

const Content = styled('div', {
  position: 'absolute',
  top: '80px',
  bottom: 0,
  margin: 0,
  backgroundColor: '#F6F0E4',
  overflowY: 'auto',
  scrollbarColor: 'gray transparent',
})

export default function Layout({ children }) {
  return (
    <div style={{ margin: 0 }}>
      <Header>
        <CherryLogo src="cherry_logo.png" />
        <NavContainer>
          <Link href="/">Gallery</Link>
          <Link href="/claim">Claim</Link>
          <WalletButton>Wallet</WalletButton>
        </NavContainer>
      </Header>
      <Content>{children}</Content>
    </div>
  )
}
