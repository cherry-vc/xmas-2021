import { styled } from '../stitches.config'
import { Menu, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import { useAppContext } from '../context/context'
import PasswordClaimModal from './PasswordClaimModal'
import { useState } from 'react'

const WalletButton = styled('button', {
  height: '35px',
  width: '110px',
  margin: '15px 30px 15px 15px',
  padding: '0 15px 0 15px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: 'white',
  backgroundColor: '#E64980',
  border: 'none',
  cursor: 'pointer',
})

export default function Dropdown() {
  const { onboard } = useAppContext()
  const [isOpen, setOpen] = useState(false)

  const connectToWallet = async (event) => {
    event.syntheticEvent.preventDefault()
    try {
      await onboard.selectWallet()
    } catch (error) {
      console.error(error)
    }
  }

  const handleClick = () => {
    // This method is also called when the modal is closed -> weird bug?
    if (!isOpen) setOpen(true)
  }

  return (
    <Menu menuButton={<WalletButton>{onboard.isWalletSelected ? onboard.address : 'Open Wallet'}</WalletButton>}>
      {!onboard.isWalletSelected && <MenuItem onClick={(event) => connectToWallet(event)}>Connect Wallet</MenuItem>}
      {onboard.isWalletSelected && <MenuItem onClick={() => onboard.disconnectWallet()}>Disconnect Wallet</MenuItem>}
      <MenuItem onClick={() => handleClick()}>
        <PasswordClaimModal isOpen={isOpen} setOpen={setOpen} />
      </MenuItem>
    </Menu>
  )
}
