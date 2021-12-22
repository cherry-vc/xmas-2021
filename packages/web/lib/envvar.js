const chain = (process.env.NEXT_PUBLIC_CHAIN || '').toLowerCase()
const blockNativeApi = process.env.NEXT_PUBLIC_BLOCKNATIVE_API_KEY || ''

// Not accessable on web
const polygonNodeUrl = process.env.PUBLIC_POLYGON_NODE_URL || ''
const mumbaiNodeUrl = process.env.MUMBAI_NODE_URL || ''
const minterKey = process.env.MINTER_KEY || ''

if (!chain) {
  throw new Error('!!! No chain network selected (use environment variable `NEXT_PLUGIN_CHAIN`)')
}

const allowedChains = ['polygon', 'mumbai']
if (!allowedChains.includes(chain)) {
  throw new Error(`!!! Invalid network selected (${chain}). Select one of: ${Object.keys(allowedChains)}.`)
}

const envvars = {
  chain,
  minterKey,
  apiKeys: {
    blockNative: blockNativeApi,
  },
  nodeUrl: {
    polygon: polygonNodeUrl,
    mumbai: mumbaiNodeUrl,
  },
}

export default envvars
