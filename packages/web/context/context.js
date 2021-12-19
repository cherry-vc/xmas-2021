import { createContext, useContext, useState } from 'react'
import { useOnboard } from 'use-onboard'

const AppContext = createContext()

export function AppWrapper({ children }) {
  const [claimedPieces, setClaimedPieces] = useState([])

  const onboard = useOnboard({
    options: {
      //   dappId: process.env.DAPP_ID, // optional API key
      networkId: 137,
      hideBranding: true,
    },
  })

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

export function useAppContext() {
  return useContext(AppContext)
}
