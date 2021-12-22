const fs = require('fs')
const path = require('path')

const config = require('../config/nft')
const variants = require('../config/variants')

const collectionMetadata = {
  description: config.collectionDescription,
  external_link: config.externalSiteBaseUri,
  image: `${config.assetBaseUri}0.jpg`, // blacked out variant
  name: config.name,

  // Royalties
  seller_fee_basis_points: config.royaltyRate,
  fee_recipient: config.vault,
}

const tokenZeroMetadata = {
  animation_url: `${config.assetBaseUri}0.mp4`,
  description: config.collectionDescription,
  external_url: config.externalSiteBaseUri,
  image: `${config.assetBaseUri}0.jpg`, // blacked out variant
  name: 'Showpiece animation',
}

const fragmentBaseAttributes = {
  leftTop: {
    trait_type: 'Left wall, top panel',
    value: 'Off',
  },
  leftMiddle: {
    trait_type: 'Left wall, middle panel',
    value: 'Off',
  },
  leftBottom: {
    trait_type: 'Left wall, bottom panel',
    value: 'Off',
  },
  centerTop: {
    trait_type: 'Center wall, top panel',
    value: 'Off',
  },
  centerMiddle: {
    trait_type: 'Center wall, middle panel',
    value: 'Off',
  },
  centerBottom: {
    trait_type: 'Center wall, bottom panel',
    value: 'Off',
  },
  rightTop: {
    trait_type: 'Right wall, top panel',
    value: 'Off',
  },
  rightMiddle: {
    trait_type: 'Right wall, middle panel',
    value: 'Off',
  },
  rightBottom: {
    trait_type: 'Right wall, bottom panel',
    value: 'Off',
  },
}

function hydrateMetadataTemplate({ tokenId, lights = [] }) {
  const attributeMapping = lights.reduce(
    (attributes, [location, value]) => {
      attributes[location] = { ...attributes[location], ...value }
      return attributes
    },
    { ...fragmentBaseAttributes }
  )

  return {
    description: `Single frame of animation (${tokenId} / 777)\n\nAdri Garcia x Cherry Ventures`,
    external_url: `${config.externalSiteBaseUri}/fragments/${tokenId}`,
    image: `${config.assetBaseUri}${tokenId}.jpg`,
    name: `Fragment #${tokenId}`,
    attributes: [
      ...Object.values(attributeMapping),
      {
        trait_type: 'Lights on',
        value: lights.length,
      },
    ],
  }
}

async function main() {
  const metadataPath = path.resolve(__dirname, '../metadata/')
  fs.mkdirSync(metadataPath, { recursive: true })

  fs.writeFileSync(path.resolve(metadataPath, 'collection.json'), JSON.stringify(collectionMetadata, '', 2))
  fs.writeFileSync(path.resolve(metadataPath, '0.json'), JSON.stringify(tokenZeroMetadata, '', 2))

  for (const variant of variants) {
    for (const [start, end] of variant.ranges) {
      // Ranges are inclusive, i.e. []
      for (let tokenId = start; tokenId <= end; ++tokenId) {
        const metadataContent = hydrateMetadataTemplate({ tokenId, lights: variant.lights })
        const variantPath = path.resolve(metadataPath, `${tokenId}.json`)
        fs.writeFileSync(variantPath, JSON.stringify(metadataContent, '', 2))
      }
    }
  }
}

// Recommended pattern
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
