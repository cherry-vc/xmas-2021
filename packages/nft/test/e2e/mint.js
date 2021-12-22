const hre = require('hardhat')
const { expect } = require('chai')

const keccak256 = require('keccak256')
const { MerkleTree } = require('merkletreejs')

const keyphrases = require('./keyphrases.json')
const merkleNodes = require('./merkle-nodes.json')

const { ethers } = hre

describe('CherryXmasNft (E2E keyphrases)', () => {
  const name = 'Cherry Xmas 2021 NFT Collection'
  const symbol = 'CherryXmas2021'
  const baseUri = 'ipfs://<baseUri>/'
  const contractUri = 'ipfs://<contractUri>'
  const royaltyRate = '1000' // 10%

  const merkleRoot = '0x0563aca179e6298b7f42b51dfd532ca9fada10c4deee34a8892c440fec7cd2e3' // output from script
  let merkleTree

  before('setup accounts', async () => {
    const accounts = await ethers.getSigners()
    owner = accounts[1]
    minter = accounts[2]
    vault = accounts[3]
    guy = accounts[4]
  })

  before('setup merkle tree', () => {
    const leaves = keyphrases.map((phrase, index) => {
      return ethers.utils.solidityKeccak256(['uint256', 'bytes32'], [index, ethers.utils.id(phrase)])
    })
    merkleTree = new MerkleTree(leaves, keccak256, { sort: true })
  })

  before('setup nft', async () => {
    const nftFactory = await ethers.getContractFactory('CherryXmasNft')
    nft = await nftFactory
      .connect(owner)
      .deploy(name, symbol, baseUri, contractUri, royaltyRate, merkleRoot, minter.address, vault.address)
  })

  it('output correct merkle root', () => {
    expect(merkleRoot).to.eq(merkleTree.getHexRoot())
  })

  it('can mint all tokens', async () => {
    for (const keyphrase of [...keyphrases].sort()) {
      const nodeKey = ethers.utils.id(keyphrase)
      // Search key is double keccak'd
      const searchKey = ethers.utils.id(nodeKey)
      const { leaf, tokenId } = merkleNodes[searchKey]
      const proof = merkleTree.getHexProof(leaf)
      console.log(`Minting ${tokenId} (${leaf})`)
      await nft.connect(minter).mint(guy.address, tokenId, nodeKey, proof)
    }

    expect(await nft.totalSupply()).to.eq('15')
  })
})
