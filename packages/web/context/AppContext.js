import { createContext, useContext, useState } from 'react'
import { useOnboard } from 'use-onboard'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [ownedPieces, setOwnedPieces] = useState([])

  const onboard = useOnboard({
    options: {
      networkId: process.env.NETWORK_ID, //TODO: where to get the ID from?
      hideBranding: true,
    },
  })

  // TODO: call addOwnedPiece for every tokenId this walletAddress owns
  const addOwnedPiece = (ownedPieceId) => {
    const newOwnedPieces = [ownedPieceId, ...ownedPieces]
    setOwnedPieces(newOwnedPieces)
  }

  const appState = {
    ownedPieces,
    addOwnedPiece,
    setOwnedPieces,
    onboard,
  }

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
