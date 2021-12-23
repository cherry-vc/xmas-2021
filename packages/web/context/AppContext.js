import { createContext, useContext, useEffect, useState } from 'react'
import { useOnboard } from 'use-onboard'
import { ethers } from 'ethers'
import { debug } from '../lib/utils'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [ownedFragments, setOwnedFragments] = useState(new Set())
  const [claimedFragments, setClaimedFragments] = useState(new Set())

  const onboard = useOnboard({
    options: {
      darkMode: false,
      hideBranding: true,
      walletSelect: {
        wallets: [
          { walletName: 'metamask', preferred: true },
          /* TODO: re-enable
          {
            walletName: 'walletConnect',
            rpc: {
              ['137']: 'https://polygon-rpc.com/',
              ['80001']: 'https://rpc-mumbai.maticvigil.com',
            },
            preferred: true,
          },
          */
          { walletName: 'coinbase', preferred: true },
          { walletName: 'trust', preferred: true },
        ],
      },
    },
  })

  const connectToWallet = async () => {
    try {
      // Try fetching current wallet's network to avoid asking them to switch it
      if (window.ethereum) {
        const rawCurrentChainId = await window.ethereum.request({ method: 'eth_chainId' })
        const currentChainId = ethers.BigNumber.from(rawCurrentChainId).toNumber()
        if (currentChainId) {
          const onboardInstance = onboard.onboard
          onboardInstance.config({ networkId: currentChainId })
        }
      }
    } catch (error) {
      debug('Failed to fetch current chain id', error)
    }

    try {
      await onboard.selectWallet()
    } catch (error) {
      console.error(error)
    }
  }

  // Useful to "optimistically" add new fragments to an owner
  const addOwnedFragment = (newTokenId) => {
    const newOwnedPieces = new Set([...ownedFragments].concat(newTokenId))
    setOwnedFragments(newOwnedPieces)
  }

  useEffect(() => {
    if (onboard.address) {
      fetch(`/api/fragment/${onboard.address}`).then((res) => {
        res.json().then(({ tokens }) => {
          setOwnedFragments(new Set(tokens.map((id) => parseInt(id, '10'))))
        })
      })
    } else {
      setOwnedFragments(new Set())
    }
  }, [onboard.address])

  useEffect(() => {
    fetch('/api/fragments').then((res) => {
      res.json().then(({ tokens }) => {
        setClaimedFragments(new Set(tokens.map((id) => parseInt(id, '10'))))
      })
    })
  }, [])

  const appState = {
    onboard,
    connectToWallet,
    addOwnedFragment,
    ownedFragments,
    claimedFragments,
  }

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>
}

export function useApp() {
  return useContext(AppContext)
}
