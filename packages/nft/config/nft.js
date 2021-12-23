const baseUri = 'QmYHgm5GnjSGwXcLoSfcK5mccMz3XS8Un3kE4Ybm1Mo1Q5'

module.exports = {
  // Contract
  name: 'Cherry Xmas 2021 NFT Collection',
  symbol: 'CherryXmas2021',
  baseUri: `ipfs://${baseUri}/`,
  contractUri: `ipfs://${baseUri}/collection.json`,
  royaltyRate: '1000', // 10%
  merkleRoot: '0x23353d291fb3b47dbb8bdfe9ce2d472bdc5eb2651238d5bcbb6f2f2b3ad951c9',
  minter: '0x7773DbaFAE86B8DfF55612b085Fdab6cB4559540',
  vault: '0xDd9703901BE5a4223b70Be04289b9233539b048d',

  // Metadata
  assetBaseUri: 'ipfs://QmSv1DCLNU4suFQieNrVh3bRJcMzL2HivCanfxfRFnU6Ws/',
  externalSiteBaseUri: 'https://xmas-2021.cherry.vc',
  collectionDescription: 'A special showpiece for the holidays, created with the intention of celebrating and sharing what has been achieved in 2021.\n\nCherry Ventures x Owi Sixseven',

  // Testnet
  // merkleRoot: '0x093793aba6aed781834a04d76fd4df96427eedb5a01e0d37eb92362076024077',
  // vault: '0x519149b8D4e76C429f79fd355B2Ed8F574D0b8E2',
}
