import { ethers } from 'ethers'

import environment, { setupEthers } from '../../../environment/api'
import { sortBn } from '../../../lib/utils'

const { contracts } = setupEthers()

export default async function handler(req, res) {
  const { method } = req

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  const { addr } = req.query
  if (!ethers.utils.isAddress(addr)) {
    res.status(400).end(`Given Address ${addr} Not An Address`)
    return
  }

  const tokens = await contracts.nft.tokensOf(addr)
  const formattedTokens = [...tokens]
    .sort(sortBn)
    .map((id) => id.toString())
    .filter((id) => !!id) // filter out 0 since token id 0 is reserved
  res.status(200).json({ tokens: formattedTokens })
}
