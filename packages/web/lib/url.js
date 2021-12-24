import * as contracts from './contracts'
import envvars from './envvar'

const blockExplorer = {
  txBaseUrl: null,
}

const opensea = {
  assetBaseUrl: null,
  collectionBaseUrl: null,
}

if (envvars.chain === 'polygon') {
  blockExplorer.txBaseUrl = 'https://polygonscan.com/tx'

  const nftAddress = contracts.polygon.nft.address
  opensea.assetBaseUrl = `https://opensea.io/assets/matic/${nftAddress}`
  opensea.collectionBaseUrl =
    'https://opensea.io/collection/cherry-xmas-2021?search[sortAscending]=false&search[sortBy]=VIEWER_COUNT'
} else if (envvars.chain === 'mumbai') {
  blockExplorer.txBaseUrl = 'https://mumbai.polygonscan.com/tx'

  const nftAddress = contracts.mumbai.nft.address
  opensea.assetBaseUrl = `https://testnets.opensea.io/assets/mumbai/${nftAddress}`
  opensea.collectionBaseUrl = 'https://testnets.opensea.io/collection/cherry-xmas-2021-nft-collection'
}

export function buildBlockExplorerTxLink(tx) {
  return `${blockExplorer.txBaseUrl}/${tx}`
}

export function buildOpenseaAssetUrl(tokenId) {
  return `${opensea.assetBaseUrl}/${tokenId}`
}

export { blockExplorer, opensea }
