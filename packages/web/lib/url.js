import * as contracts from './contracts'
import envvars from './envvar'

let assetBaseUrl, openseaCollectionBaseUrl

if (envvars.chain === 'polygon') {
  const nftAddress = contracts.polygon.nft.address
  assetBaseUrl = `https://opensea.io/assets/matic/${nftAddress}`
  openseaCollectionBaseUrl = 'https://opensea.io/collection/cherry-xmas-2021-nft-collection'
} else if (envvars.chain === 'mumbai') {
  const nftAddress = contracts.mumbai.nft.address
  assetBaseUrl = `https://testnets.opensea.io/assets/mumbai/${nftAddress}`
  openseaCollectionBaseUrl = 'https://testnets.opensea.io/collection/cherry-xmas-2021-nft-collection'
}

export function buildOpenseaAssetUrl(tokenId) {
  if (tokenId) {
    assetBaseUrl = `${assetBaseUrl}/${tokenId}`
  }

  return assetBaseUrl
}

export { openseaCollectionBaseUrl }
