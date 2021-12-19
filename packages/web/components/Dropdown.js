import { styled } from '../stitches.config'
import { Menu, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import { useRouter } from 'next/router'
import { useAppContext } from '../context/context'

const WalletButton = styled('button', {
  height: '30px',
  minWidth: '80px',
  margin: '15px',
  color: 'white',
  backgroundColor: '#E64980',
  border: 'none',
  cursor: 'pointer',
})

export default function Dropdown() {
  const router = useRouter()
  const { walletConnected, walletAddress, connectWallet } = useAppContext()

  const connectToWallet = (event) => {
    console.log(event)
    event.syntheticEvent.preventDefault()
    console.log('Wallet')
    connectWallet('')
  }

  const usePassword = (event) => {
    event.syntheticEvent.preventDefault()
    console.log('Password')
    router.push(`/claim?method=hold`)
  }

  return (
    <Menu menuButton={<WalletButton>{walletConnected ? walletAddress : 'Open menu'}</WalletButton>}>
      <MenuItem onClick={(event) => connectToWallet(event)}>Wallet</MenuItem>
      <MenuItem onClick={(event) => usePassword(event)}>Password</MenuItem>
    </Menu>
  )
}
