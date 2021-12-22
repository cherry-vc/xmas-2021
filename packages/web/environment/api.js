import { ethers } from 'ethers'

import * as chains from '../lib/chains'
import { polygon as polygonContracts, mumbai as mumbaiContracts } from '../lib/contracts'
import envvars from '../lib/envvar'
import { polygon as polygonMerkleConfig, mumbai as mumbaiMerkleConfig } from '../lib/merkle-mint'
import { debug, prod } from '../lib/utils'
import engageEnvLock from './__lock'

const environments = {
  // [chain]: {
  //   chainId,
  //   nodeUrl,
  //   contracts: {
  //     [contract]: [contract instance],
  //   },
  //   merkle: {
  //     leafMap,
  //     root,
  //     tree,
  //   },
  //   signers: {
  //     minter
  //   },
  // }
  polygon: {
    ...chains.polygon,
    contracts: {
      ...polygonContracts,
    },
    merkle: {
      ...polygonMerkleConfig,
    },
  },
  mumbai: {
    ...chains.mumbai,
    contracts: {
      ...mumbaiContracts,
    },
    merkle: {
      ...mumbaiMerkleConfig,
    },
  },
}

const environment = environments[envvars.chain]

let minter, provider
function setupEthers() {
  if (!provider && environment.nodeUrl) {
    provider = new ethers.providers.StaticJsonRpcProvider(environment.nodeUrl)
  }
  if (!minter && envvars.minterKey) {
    minter = new ethers.Wallet(envvars.minterKey)
  }
  return { minter, provider }
}

debug(`Configured to api environment on chain ${envvars.chain}`)
if (!environment.nodeUrl) {
  console.error('!!! No configured node RPC URL the current api environment')
}
if (!envvars.minterKey) {
  // Only warn in prod, can have good reason not to set signers during dev
  prod('!!! No configured signers for the current api environment')
}
engageEnvLock('api')

export { setupEthers }
export default environment
