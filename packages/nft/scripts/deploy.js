const hre = require('hardhat')
const inquirer = require('inquirer')

async function sanity() {
  const network = await ethers.provider.getNetwork()
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
  console.log(`Will deploy...`)
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
  /*
  const contractFactory = await hre.ethers.getContractFactory(...)
  const contract = await contractFactory.deploy(
    ...
  )

  // Wait for a few confirmations to reduce chances of Etherscan verification failing
  await contract.deployTransaction.wait(5)
  console.log(`Deployed to address: ${contract.address}`)

  return contract
  */
}

async function verify(contract) {
  console.log()
  console.log('Verifying on Etherscan...')
  /*
  await hre.run('verify:verify', {
    address: contract.address,
    constructorArguments: [...],
  })
  */
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
