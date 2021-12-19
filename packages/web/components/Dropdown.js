import { styled } from '../stitches.config'
import { Menu, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import { useRouter } from 'next/router'
import { useAppContext } from '../context/context'

const WalletButton = styled('button', {
  height: '30px',
  width: '80px',
  margin: '15px',
  padding: '0 15px 0 15px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: 'white',
  backgroundColor: '#E64980',
  border: 'none',
  cursor: 'pointer',
})

export default function Dropdown() {
  const router = useRouter()
  const { onboard } = useAppContext()

  const connectToWallet = async (event) => {
    event.syntheticEvent.preventDefault()
    try {
      await onboard.selectWallet()
    } catch (error) {
      console.error(error)
    }
  }

  const claimWithPassword = (event) => {
    event.syntheticEvent.preventDefault()
    //   TODO: what to actually do here?
    router.push(`/claim?method=hold`)
  }

  return (
    <Menu menuButton={<WalletButton>{onboard.isWalletSelected ? onboard.address : 'Wallet'}</WalletButton>}>
      {!onboard.isWalletSelected && <MenuItem onClick={(event) => connectToWallet(event)}>Connect Wallet</MenuItem>}
      {onboard.isWalletSelected && <MenuItem onClick={() => onboard.disconnectWallet()}>Disconnect Wallet</MenuItem>}
      <MenuItem onClick={(event) => claimWithPassword(event)}>Password</MenuItem>
    </Menu>
  )
}
