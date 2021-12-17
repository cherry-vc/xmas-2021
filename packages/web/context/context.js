import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppWrapper({ children }) {
  const [claimedPieces, setClaimedPieces] = useState([])
  const [walletConnected, setWalletConnected] = useState(false)

  const addClaimedPiece = (claimedPieceId) => {
    const newClaimedPieces = [claimedPieceId, ...claimedPieces]
    console.log(newClaimedPieces)
    setClaimedPieces(newClaimedPieces)
  }

  const appState = {
    claimedPieces,
    addClaimedPiece,
    walletConnected,
    setWalletConnected,
  }

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>
}

export function useAppContext() {
  return useContext(AppContext)
}
