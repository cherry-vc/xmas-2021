import { ethers } from 'ethers'

import envvars from '../lib/envvar'
import fragmentMap from '../lib/fragmentMap'
import { polygon as polygonMerkleConfig, mumbai as mumbaiMerkleConfig } from '../lib/merkle-mint'
import { debug, prod } from '../lib/utils'
import engageEnvLock from './__lock'

const environments = {
  // [network]: {
  //   merkle: {
  //     leafMap,
  //     root,
  //     tree,
  //   },
  //   fragmentMapping,
  //   demoClaim,
  // }
  polygon: {
    merkle: {
      ...polygonMerkleConfig,
    },
    fragmentMapping: fragmentMap,
  },
  mumbai: {
    merkle: {
      ...mumbaiMerkleConfig,
    },
    fragmentMapping: fragmentMap,
  },
}

const environment = environments[envvars.chain]
environment.demoClaim = envvars.demoClaim

debug(`Configured to web environment on chain ${envvars.chain}`)
if (environment.demoClaim) {
  prod('!!! Configured to demo the claiming process (NEXT_PUBLIC_DEMO_CLAIM)')
}
engageEnvLock('web')

export default environment
