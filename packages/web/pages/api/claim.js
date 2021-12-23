import { ethers } from 'ethers'

import environment, { setupEthers } from '../../environment/api'

const merkleConfig = environment.merkle
const { contracts, minter } = setupEthers()

export default async function handler(req, res) {
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

  const to = req.body?.to || ''
  if (!to || (!ethers.utils.isAddress(to) && to !== 'vault')) {
    res.status(400).end(`To Parameter ${to} Not An Address Or Vault`)
    return
  }

  // merkle leaf map's keys are another keccak256(key)
  const key = req.body?.key || ''
  const leafMapKey = ethers.utils.id(key)
  const leafMapNode = merkleConfig.leafMap.get(leafMapKey)

  if (!leafMapNode) {
    res.status(403).end(`Key Parameter ${key} Invalid`)
    return
  }
  if (await contracts.nft.claimed(key)) {
    res.status(400).end(`Key Parameter ${key} Already Claimed`)
    return
  }

  const { leaf, tokenId } = leafMapNode
  const proof = merkleConfig.tree.getHexProof(leaf)

  if (ethers.utils.isAddress(to)) {
    // Sanity check claim tx
    try {
      await contracts.nft.connect(minter).callStatic.mint(to, tokenId, key, proof)
    } catch (err) {
      res.status(400).end('Claim Tx Failing')
      return
    }

    // Send claim tx
    const tx = await contracts.nft.connect(minter).mint(to, tokenId, key, proof)
    res.status(200).json({ tokenId, tx: tx.hash })
  } else if (to === 'vault') {
    // Sanity check claim tx
    try {
      await contracts.nft.connect(minter).callStatic.mintToVault(tokenId, key, proof)
    } catch (err) {
      res.status(400).end('Claim Tx Failing')
      return
    }

    // Send claim tx
    const tx = await contracts.nft.connect(minter).mintToVault(tokenId, key, proof)
    res.status(200).json({ tokenId, tx: tx.hash })
  }
}
