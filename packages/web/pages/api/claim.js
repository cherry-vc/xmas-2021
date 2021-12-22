import { ethers } from 'ethers'

import environment, { setupEthers } from '../../environment/api'

const merkleConfig = environment.merkle
const { minter, provider } = setupEthers()

export default function handler(req, res) {
  const { method } = req

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  if (!minter) {
    res.status(503).end('Claiming currently not enabled')
    return
  }

  // merkle leaf map's keys are another keccak256(key)
  const leafMapKey = ethers.utils.id(req.body?.key || '')
  const leafNode = merkleConfig.leafMap.get(leafMapKey)

  if (!leafNode) {
    res.status(403).end()
    return
  }

  // TODO: find merkle proof and mint
  res.status(200).json({ tokenId: 7, tx: '0x1fc53fce9bb8cf8f35c1ce1f22e58a4e96a714c62ae40c5a7eab1a72f4741d38' })
}
