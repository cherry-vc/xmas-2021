const baseUri = 'QmNqMYbEAMEcwU8SF57fEPLoF1L6bJLkRJUbH9EdCYFeZw'

module.exports = {
  // Contract
  name: 'Cherry Xmas 2021 NFT Collection',
  symbol: 'CherryXmas2021',
  baseUri: `ipfs://${baseUri}/`,
  contractUri: `ipfs://${baseUri}/collection.json`,
  royaltyRate: '1000', // 10%
  merkleRoot: '0x093793aba6aed781834a04d76fd4df96427eedb5a01e0d37eb92362076024077',
  minter: '0x7773DbaFAE86B8DfF55612b085Fdab6cB4559540',
  vault: '0x519149b8D4e76C429f79fd355B2Ed8F574D0b8E2', // TODO: update for mainnet

  // Metadata
  assetBaseUri: 'ipfs://QmSv1DCLNU4suFQieNrVh3bRJcMzL2HivCanfxfRFnU6Ws/',
  externalSiteBaseUri: 'https://xmas-2021.cherry.vc',
  collectionDescription: 'A special holiday showpiece\n\nCherry Ventures x Adri Garcia',
}
