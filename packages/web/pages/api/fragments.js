import { ethers } from 'ethers'

import environment, { setupEthers } from '../../environment/api'

const { provider } = setupEthers()

export default function handler(req, res) {
  const { method } = req

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  // TODO:
  //   1. instantiate + connect contract
  //   2. return nft.allTokens() (and sort it here)
  res.status(200).json({ tokens: [] })
}
