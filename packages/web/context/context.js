import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppWrapper({ children }) {
  const [claimedPieces, setClaimedPieces] = useState([])

  const addClaimedPiece = (claimedPieceId) => {
    const newClaimedPieces = [claimedPieceId, ...claimedPieces]
    console.log(newClaimedPieces)
    setClaimedPieces(newClaimedPieces)
  }

  const appState = {
    claimedPieces,
    addClaimedPiece,
  }

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>
}

export function useAppContext() {
  return useContext(AppContext)
}
