const hre = require('hardhat')
const { expect } = require('chai')

const keccak256 = require('keccak256')
const { MerkleTree } = require('merkletreejs')

const { ethers } = hre

const ZERO_ADDRESS = '0x' + '0'.repeat(40)
const ONE_ETH = ethers.utils.parseEther('1')

function toMerkleLeaf(index, keyphraseHash) {
  return ethers.utils.solidityKeccak256(['uint256', 'bytes32'], [index, keyphraseHash])
}

describe('CherryXmasNft', () => {
  const name = 'Cherry Xmas 2021 NFT Collection'
  const symbol = 'CherryXmas2021'
  const baseUri = 'ipfs://<baseUri>/'
  const contractUri = 'ipfs://<contractUri>'
  const royaltyRate = '1000' // 10%

  const keyphrases = [
    'test-weirdwink',
    'test-absurdaccident',
    'test-acquireaddress',
    'test-safesail',
    'test-satoshisausage',
  ]
  const merkleLeaves = keyphrases.map((phrase, index) => toMerkleLeaf(index, ethers.utils.id(phrase)))
  let merkleTree, merkleRoot

  let nft
  let owner, minter, vault, guy

  before('setup accounts', async () => {
    const accounts = await ethers.getSigners()
    owner = accounts[1]
    minter = accounts[2]
    vault = accounts[3]
    guy = accounts[4]
  })

  before('setup merkle tree', async () => {
    merkleTree = new MerkleTree(merkleLeaves, keccak256, { sort: true })
    merkleRoot = merkleTree.getHexRoot()
  })

  beforeEach('setup nft', async () => {
    const nftFactory = await ethers.getContractFactory('CherryXmasNft')
    nft = await nftFactory.connect(owner).deploy(
      name,
      symbol,
      baseUri,
      contractUri,
      royaltyRate,
      merkleRoot,
      minter.address,
      vault.address
    )
  })

  context('nft details', () => {
    it('set correct initial details', async () => {
      const nftName = await nft.name()
      const nftSymbol = await nft.symbol()
      const nftContractUri = await nft.contractURI()

      expect(nftName).to.equal(name)
      expect(nftSymbol).to.equal(symbol)
      expect(nftContractUri).to.equal(contractUri)

      // Test for token uris done later due to token needing to exist
    })

    it('can change contract uri', async () => {
      const newContractUri = 'ipfs://<contractUri2>'
      await nft.connect(owner).setContractURI(newContractUri)

      expect(await nft.contractURI()).to.equal(newContractUri)
    })

    it('cannot change details unless owner', async () => {
      await expect(
        nft.connect(minter).setBaseURI('ipfs://')
      ).to.be.revertedWith('Ownable: caller is not the owner')
      await expect(
        nft.connect(minter).setContractURI('ipfs://')
      ).to.be.revertedWith('Ownable: caller is not the owner')
    })
  })

  context('minting', () => {
    it('set correct initial merkle root', async () => {
      expect(await nft.merkleRoot()).to.equal(merkleRoot)
    })

    it('set correct initial minter', async () => {
      expect(await nft.minter()).to.addressEqual(minter.address)
    })

    it('can change minter', async () => {
      const newMinter = guy
      await nft.connect(owner).setMinter(newMinter.address)

      expect(await nft.minter()).to.addressEqual(newMinter.address)
    })

    it('can merkle mint without dust to given address', async () => {
      const prevGuyEthBal = await ethers.provider.getBalance(guy.address)

      // Mint token id 1
      const tokenId = 1
      const key = ethers.utils.id(keyphrases[tokenId])
      const leaf = toMerkleLeaf(tokenId, key)
      const proof = merkleTree.getHexProof(leaf)
      await nft.connect(minter).mint(guy.address, tokenId, key, proof)

      expect(await ethers.provider.getBalance(guy.address)).to.equal(prevGuyEthBal)
      expect(await nft.balanceOf(guy.address)).to.equal('1')
      expect(await nft.ownerOf(tokenId)).to.equal(guy.address)
    })

    it('can merkle mint with dust to given address', async () => {
      // Send some ETH into nft contract
      await owner.sendTransaction({
        to: nft.address,
        value: ONE_ETH
      })
      const prevGuyEthBal = await ethers.provider.getBalance(guy.address)
      const prevNftEthBal = await ethers.provider.getBalance(nft.address)

      // Mint token id 2
      const tokenId = 2
      const key = ethers.utils.id(keyphrases[tokenId])
      const leaf = toMerkleLeaf(tokenId, key)
      const proof = merkleTree.getHexProof(leaf)
      await nft.connect(minter).mint(guy.address, tokenId, key, proof)

      expect(await ethers.provider.getBalance(nft.address)).to.eq(prevNftEthBal.sub(ethers.utils.parseEther('0.25')))
      expect(await ethers.provider.getBalance(guy.address)).to.eq(prevGuyEthBal.add(ethers.utils.parseEther('0.25')))
      expect(await nft.balanceOf(guy.address)).to.equal('1')
      expect(await nft.ownerOf(tokenId)).to.equal(guy.address)
    })

    it('can merkle mint to vault', async () => {
      // Mint token id 3
      const tokenId = 3
      const key = ethers.utils.id(keyphrases[tokenId])
      const leaf = toMerkleLeaf(tokenId, key)
      const proof = merkleTree.getHexProof(leaf)
      await nft.connect(minter).mintToVault(tokenId, key, proof)

      expect(await nft.balanceOf(vault.address)).to.equal('1')
      expect(await nft.ownerOf(tokenId)).to.equal(vault.address)
    })

    it('cannot mint unless minter', async () => {
      // Attempt to token id 4
      const tokenId = 4
      const key = ethers.utils.id(keyphrases[tokenId])
      const leaf = toMerkleLeaf(tokenId, key)
      const proof = merkleTree.getHexProof(leaf)

      await expect(
        nft.connect(guy).mint(guy.address, tokenId, key, proof)
      ).to.be.revertedWith('M')
      await expect(
        nft.connect(guy).mintToVault(tokenId, key, proof)
      ).to.be.revertedWith('M')
    })
  })

  context('royalties', () => {
    it('set correct initial royalty rate', async () => {
      expect(await nft.royaltyRate()).to.eq(royaltyRate)
    })

    it('can change royalty rate', async () => {
      const newRoyaltyRate = '1500' // 15%
      await nft.connect(owner).setRoyaltyRate(newRoyaltyRate)

      expect(await nft.royaltyRate()).to.eq(newRoyaltyRate)
    })

    it('can query royalty info', async () => {
      const salePrice = ONE_ETH.mul('10')
      const [receiver, royaltyAmount] = await nft.royaltyInfo(0, salePrice)

      const expectedRoyaltyAmount = ONE_ETH // 10% of sale
      expect(receiver).to.addressEqual(vault.address)
      expect(royaltyAmount).to.eq(expectedRoyaltyAmount)
    })

    it('changes royalty info if vault changes', async () => {
      const newVault = guy

      await nft.connect(owner).setVault(newVault.address)
      const [receiver, royaltyAmount] = await nft.royaltyInfo(0, ONE_ETH)

      expect(receiver).to.addressEqual(newVault.address)
    })
  })

  context('recovery', () => {
    it('can recover dust', async () => {
      const dust = ONE_ETH
      await owner.sendTransaction({
        to: nft.address,
        value: dust
      })
      const prevVaultEthBal = await ethers.provider.getBalance(vault.address)

      await nft.connect(owner).recoverDust(ZERO_ADDRESS)

      expect(await ethers.provider.getBalance(vault.address)).to.eq(prevVaultEthBal.add(dust))
      expect(await ethers.provider.getBalance(nft.address)).to.eq(0)
    })

    describe('with minted tokens', () => {
      const tokenId = 3

      beforeEach('mint token', async () => {
        // Mint token id 3
        const key = ethers.utils.id(keyphrases[tokenId])
        const leaf = toMerkleLeaf(tokenId, key)
        const proof = merkleTree.getHexProof(leaf)
        await nft.connect(minter).mint(guy.address, tokenId, key, proof)
      })

      it('can recover token id', async () => {
        expect(await nft.ownerOf(tokenId)).to.not.addressEqual(vault.address)
        await nft.connect(owner).recoverTokenId(tokenId)
        expect(await nft.ownerOf(tokenId)).to.addressEqual(vault.address)
      })

      it('cannot recover unless owner', async () => {
        await expect(
          nft.connect(guy).recoverTokenId(tokenId)
        ).to.be.revertedWith('Ownable: caller is not the owner')
      })
    })
  })

  context('vault', () => {
    it('set correct initial vault', async () => {
      expect(await nft.vault()).to.addressEqual(vault.address)
    })

    it('can change vault', async () => {
      const newVault = guy
      await nft.connect(owner).setVault(newVault.address)

      expect(await nft.vault()).to.addressEqual(newVault.address)
    })

    it('cannot change vault unless owner', async () => {
        await expect(
          nft.connect(guy).setVault(guy.address)
        ).to.be.revertedWith('Ownable: caller is not the owner')
    })
  })

  context('ownership', () => {
    it('set correct initial owner', async () => {
      expect(await nft.owner()).to.addressEqual(owner.address)
    })

    it('can change owner', async () => {
      const newOwner = guy
      await nft.connect(owner).transferOwnership(newOwner.address)

      expect(await nft.owner()).to.addressEqual(newOwner.address)
    })

    it('can renounce ownership', async () => {
      await nft.connect(owner).renounceOwnership()
      expect(await nft.owner()).to.addressEqual(ZERO_ADDRESS)
    })

    it('cannot change owner unless owner', async () => {
        await expect(
          nft.connect(guy).transferOwnership(guy.address)
        ).to.be.revertedWith('Ownable: caller is not the owner')
        await expect(
          nft.connect(guy).renounceOwnership()
        ).to.be.revertedWith('Ownable: caller is not the owner')
    })
  })

  context('queries', () => {
    beforeEach('mint nfts', async () => {
      const mints = [
        [0, guy.address],
        [1, owner.address],
        [3, guy.address],
      ]

      for (const [tokenId, addr] of mints) {
        const key = ethers.utils.id(keyphrases[tokenId])
        const leaf = toMerkleLeaf(tokenId, key)
        const proof = merkleTree.getHexProof(leaf)
        await nft.connect(minter).mint(addr, tokenId, key, proof)
      }
    })

    it('queried tokenUri is correct', async () => {
      const tokenId = 3
      const tokenUri = await nft.tokenURI(tokenId)

      expect(tokenUri).to.eq(`${baseUri}${tokenId}.json`)
    })

    it('can change base uri to update tokenUri', async () => {
      const tokenId = 3
      const newBaseUri = 'ipfs://<baseUri2>/'
      await nft.connect(owner).setBaseURI(newBaseUri)

      const tokenUri = await nft.tokenURI(tokenId)

      expect(tokenUri).to.eq(`${newBaseUri}${tokenId}.json`)
    })

    it('can query all minted tokens', async () => {
      const tokenIds = (await nft.allTokens()).map(id => id.toString()).sort()
      const expectedTokenIds = ['0', '1', '3'] // based on mints

      expect(tokenIds).to.deep.eq(expectedTokenIds)
    })

    it('can query all tokens held by address', async () => {
      const tokenIdsForAddr = (await nft.tokensOf(guy.address)).map(id => id.toString()).sort()
      const expectedTokenIdsForAddr = ['0', '3'] // based on mints

      expect(tokenIdsForAddr).to.deep.eq(expectedTokenIdsForAddr)
    })
  })
})
