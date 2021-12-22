import { createContext, useContext, useState } from 'react'
import { useOnboard } from 'use-onboard'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [claimedPieces, setClaimedPieces] = useState([])

  const onboard = useOnboard({
    options: {
      networkId: process.env.NETWORK_ID, //TODO: where to get the ID from?
      hideBranding: true,
    },
  })

  // TODO: call addClaimedPiece for every tokenId this walletAddress owns
  const addClaimedPiece = (claimedPieceId) => {
    const newClaimedPieces = [claimedPieceId, ...claimedPieces]
    console.log(newClaimedPieces)
    setClaimedPieces(newClaimedPieces)
  }

  const appState = {
    claimedPieces,
    addClaimedPiece,
    onboard,
  }

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
