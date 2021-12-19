import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppWrapper({ children }) {
  const [claimedPieces, setClaimedPieces] = useState([])
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')

  const addClaimedPiece = (claimedPieceId) => {
    const newClaimedPieces = [claimedPieceId, ...claimedPieces]
    console.log(newClaimedPieces)
    setClaimedPieces(newClaimedPieces)
  }

  const connectWallet = (param) => {
    const address = '0x...'
    setWalletConnected(true)
    setWalletAddress(address)
  }

  const disconnectWallet = (param) => {
    setWalletConnected(false)
    setWalletAddress('')
  }

  const appState = {
    claimedPieces,
    addClaimedPiece,
    walletConnected,
    walletAddress,
    connectWallet,
    disconnectWallet,
  }

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>
}

export function useAppContext() {
  return useContext(AppContext)
}
