const hre = require('hardhat')
const inquirer = require('inquirer')

const nftConfig = require('../config/nft')

async function sanity() {
  const network = await ethers.provider.getNetwork()

  if (process.env.TESTNET) {
    const expectedChainId = hre.config.networks.polygonMumbai.chainId
    if (network.chainId !== expectedChainId) {
      console.log(`Wrong chain id! Expected ${expectedChainId} (Polygon Mumbai testnet), got: ${network.chainId}`)
      throw new Error('Wrong chain id')
    }
    return
  }

  const expectedChainId = hre.config.networks.polygon.chainId
  if (network.chainId !== expectedChainId) {
    console.log(`Wrong chain id! Expected ${expectedChainId} (Polygon mainnet), got: ${network.chainId}`)
    throw new Error('Wrong chain id')
  }

  if (!hre.config.etherscan.apiKey) {
    console.log('Missing Polygonscan API key!')
    throw new Error('Missing Polygonscan API key')
  }
}

async function confirm() {
  console.log(`Will deploy CherryXmasNft, initialized to:`)
  Object.entries(nftConfig).forEach(([k, v]) => {
    console.log(`  - ${k}: ${v}`)
  })
  console.log()

  const accounts = await hre.ethers.getSigners()
  console.log(`From address: ${accounts[0].address}`)
  console.log()

  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Proceed?',
      default: false,
    },
  ])
  console.log()

  return confirmed
}

async function deploy() {
  console.log('Deploying...')
  const nftFactory = await hre.ethers.getContractFactory('CherryXmasNft')
  const nft = await nftFactory.deploy(
    nftConfig.name,
    nftConfig.symbol,
    nftConfig.baseUri,
    nftConfig.contractUri,
    nftConfig.royaltyRate,
    nftConfig.merkleRoot,
    nftConfig.minter,
    nftConfig.vault
  )

  // Wait for a few confirmations to reduce chances of Etherscan verification failing
  await nft.deployTransaction.wait(5)
  console.log(`Deployed to address: ${nft.address}`)

  return nft
}

async function verify(contract) {
  console.log()

  const network = await ethers.provider.getNetwork()
  const mumbaiChainId = hre.config.networks.polygonMumbai.chainId

  if (network.chainId === mumbaiChainId) {
    console.log('Skipping verification on Mumbai testnet...')
    return
  }

  console.log('Verifying on Polygonscan...')
  await hre.run('verify:verify', {
    address: contract.address,
    constructorArguments: [
      nftConfig.name,
      nftConfig.symbol,
      nftConfig.baseUri,
      nftConfig.contractUri,
      nftConfig.royaltyRate,
      nftConfig.merkleRoot,
      nftConfig.minter,
      nftConfig.vault,
    ],
  })
}

async function main() {
  console.log(`Connecting to ${hre.network.name}...`)
  await sanity()
  if (!(await confirm())) {
    console.log('Aborting...')
    return
  }

  // Ok, go ahead and deploy
  const contract = await deploy()
  await verify(contract)

  console.log()
  console.log('All done :)')
}

// Recommended pattern
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
