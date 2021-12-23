import { ethers } from 'ethers'

import environment, { setupEthers } from '../../../environment/api'

const { contracts } = setupEthers()

export default async function handler(req, res) {
  const { method } = req

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  const { key } = req.query
  const claimed = await contracts.nft.claimed(key)
  res.status(200).json({ claimed })
}
