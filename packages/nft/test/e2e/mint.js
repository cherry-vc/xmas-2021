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

  const merkleRoot = '0xe0065a7aac7bd823ddb44c7ecf0bc30eb34f52b7f1d3939c788367f333ba3718' // output from script
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
      const tokenId = index + 1 // tokenId 0 reserved
      return ethers.utils.solidityKeccak256(['uint256', 'bytes32'], [tokenId, ethers.utils.id(phrase)])
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
