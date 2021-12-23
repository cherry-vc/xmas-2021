import { ethers } from 'ethers'

import environment, { setupEthers } from '../../environment/api'
import { sortBn } from '../../lib/utils'

const { contracts } = setupEthers()

export default async function handler(req, res) {
  const { method } = req

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  const tokens = await contracts.nft.allTokens()
  const formattedTokens = [...tokens]
    .sort(sortBn)
    .map((id) => id.toString())
    .filter((id) => !!id) // filter out 0 since token id 0 is reserved
  res.status(200).json({ tokens: formattedTokens })
}
