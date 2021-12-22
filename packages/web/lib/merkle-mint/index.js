const keccak256 = require('keccak256')
const { MerkleTree } = require('merkletreejs')

import mumbaiMap from './chains/mumbai'
import polygonMap from './chains/polygon'

function hydrateMerkleConfigurationFromLeafMap(leafMap) {
  const merkleLeafs = [...leafMap.values()].map(({ leaf }) => leaf)
  const tree = new MerkleTree(merkleLeafs, keccak256, { sort: true })
  const root = tree.getHexRoot()

  return {
    leafMap,
    root,
    tree,
  }
}

export const polygon = hydrateMerkleConfigurationFromLeafMap(polygonMap)
export const mumbai = hydrateMerkleConfigurationFromLeafMap(mumbaiMap)

export const utils = {
  toMerkleLeaf: function (tokenId, keyphraseHash) {
    return ethers.utils.solidityKeccak256(['uint256', 'bytes32'], [tokenId, keyphraseHash])
  },
}
