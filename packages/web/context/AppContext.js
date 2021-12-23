import { createContext, useContext, useEffect, useState } from 'react'
import { useOnboard } from 'use-onboard'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [ownedFragments, setOwnedFragments] = useState(new Set())
  const [claimedFragments, setClaimedFragments] = useState(new Set())

  const onboard = useOnboard({
    options: {
      hideBranding: true,
    },
  })

  // Useful to "optimistically" add new fragments to an owner
  const addOwnedFragment = (newTokenId) => {
    const newOwnedPieces = [...new Set(ownedFragments.concat(ownedPieceId))]
    setOwnedFragments(newOwnedPieces)
  }

  useEffect(() => {
    if (onboard.address) {
      fetch(`/api/fragment/${onboard.address}`).then((res) => {
        res.json().then(({ tokens }) => {
          setOwnedFragments(new Set(tokens))
        })
      })
    } else {
      setOwnedFragments(new Set())
    }
  }, [onboard.address])

  useEffect(() => {
    fetch('/api/fragments').then((res) => {
      res.json().then(({ tokens }) => {
        console.log(tokens)
        setClaimedFragments(new Set(tokens))
      })
    })
  }, [])

  const appState = {
    onboard,
    addOwnedFragment,
    ownedFragments,
    claimedFragments,
  }

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
