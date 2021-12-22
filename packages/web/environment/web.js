import { ethers } from 'ethers'

import envvars from '../lib/envvar'
import { polygon as polygonMerkleConfig, mumbai as mumbaiMerkleConfig } from '../lib/merkle-mint'
import { debug } from '../lib/utils'
import engageEnvLock from './__lock'

const environments = {
  // [network]: {
  //   merkle: {
  //     leafMap,
  //     root,
  //     tree,
  //   },
  // }
  polygon: {
    merkle: {
      ...polygonMerkleConfig,
    },
  },
  mumbai: {
    merkle: {
      ...mumbaiMerkleConfig,
    },
  },
}

const environment = environments[envvars.chain]

debug(`Configured to web environment on chain ${envvars.chain}`)
engageEnvLock('web')

export default environment
