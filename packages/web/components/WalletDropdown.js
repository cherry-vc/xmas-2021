import { useState } from 'react'
import { Menu, MenuItem } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'

import { styled } from '../stitches.config'
import { useApp } from '../context/AppContext'
// import PasswordClaimModal from './PasswordClaimModal'

const WalletButton = styled('button', {
  height: '35px',
  width: '140px',
  marginLeft: '20px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: '$white',
  backgroundColor: '$cherry',
})

export default function Dropdown() {
  const { onboard, connectToWallet } = useApp()
  const [isOpen, setOpen] = useState(false)

  const handlePasswordModal = () => {
    // This method is also called when the modal is closed -> weird bug?
    if (!isOpen) {
      setOpen(true)
    }
  }

  const onClick = onboard.isWalletSelected ? onboard.disconnectWallet : connectToWallet

  return <WalletButton onClick={onClick}>{onboard.isWalletSelected ? 'Disconnect' : 'Connect Wallet'}</WalletButton>
  /* Dropdown's causing layout problems
  return (
    <Menu menuButton={<WalletButton>{onboard.isWalletSelected ? onboard.address : 'Connect Wallet'}</WalletButton>}>
      {!onboard.isWalletSelected && <MenuItem onClick={(event) => connectToWallet(event)}>Connect Wallet</MenuItem>}
      {onboard.isWalletSelected && <MenuItem onClick={() => onboard.disconnectWallet()}>Disconnect Wallet</MenuItem>}
      {<MenuItem onClick={() => handlePasswordModal()}>
        <PasswordClaimModal isOpen={isOpen} setOpen={setOpen} />
      </MenuItem>}
    </Menu>
  */
}
