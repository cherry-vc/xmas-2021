const fs = require('fs')
const path = require('path')

const csv = require('csvtojson')
const inquirer = require('inquirer')
const ethers = require('ethers')
const keccak256 = require('keccak256')
const { MerkleTree } = require('merkletreejs')

let wordlist

function toMerkleLeaf(index, keyphraseHash) {
  return ethers.utils.solidityKeccak256(['uint256', 'bytes32'], [index, keyphraseHash])
}

function getRandomWord() {
  const index = Math.floor(Math.random() * wordlist.length)
  return wordlist[index]
}

function generateKeyphrase(prefix) {
  return `${prefix}-${getRandomWord()}${getRandomWord()}`
}

async function loadWordlist() {
  const wordlistPath = path.resolve(__dirname, 'bip39-wordlist/wordlist.csv')
  wordlist = (await csv().fromFile(wordlistPath)).map((list) => list.word)
}

async function generateKeyphrases() {
  console.log('What should be used as the keyphrase prefix?')
  const { prefix } = await inquirer.prompt([
    {
      type: 'input',
      name: 'prefix',
      message: 'Prefix',
      default: 'cherryxmas2021',
    },
  ])

  console.log('How many keyphrases to generate?')
  const { numKeyphrases } = await inquirer.prompt([
    {
      type: 'number',
      name: 'numKeyphrases',
      message: 'Number',
      default: 777,
    },
  ])

  console.log(`Will generate keyphrases similar to ${generateKeyphrase(prefix)}.`)
  const { confirmed } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message: 'Proceed?',
      default: false,
    },
  ])
  console.log()

  if (!confirmed) {
    process.exit(0)
  } else {
    return Array(numKeyphrases).fill().map(() => generateKeyphrase(prefix))
  }
}

async function merklizeKeyphraseNodes(hashes) {
  const tree = new MerkleTree(hashes, keccak256, { sort: true })
  return tree.getHexRoot()
}

async function main() {
  await loadWordlist()

  console.log('Generating key keyphrases')
  console.log('=========================')
  console.log()
  const keyphrases = await generateKeyphrases()
  const keyphraseNodes = keyphrases.reduce((obj, keyphrase, index) => {
    const keyphraseHash = ethers.utils.id(keyphrase)
    obj[ethers.utils.id(keyphraseHash)] = { leaf: toMerkleLeaf(index, keyphraseHash), tokenId: index }
    return obj
  }, {})

  console.log('Dumping keyphrases to file')
  console.log('==========================')
  const keyphraseOutputPath = path.resolve(__dirname, '../keyphrases.json')
  fs.writeFileSync(keyphraseOutputPath, JSON.stringify(keyphrases, '', 2))
  console.log(`  File: ${keyphraseOutputPath}`)
  console.log()

  console.log('Dumping merkle nodes to file')
  console.log('============================')
  const merkleNodesOutputPath = path.resolve(__dirname, '../merkle-nodes.json')
  fs.writeFileSync(merkleNodesOutputPath, JSON.stringify(keyphraseNodes, '', 2))
  console.log(`  File: ${merkleNodesOutputPath}`)
  console.log()

  console.log('Generating merkle root')
  console.log('======================')
  const merkleRoot = await merklizeKeyphraseNodes(Object.values(keyphraseNodes).map(({ leaf }) => leaf))
  console.log(`  Merkle root for set of keyphrases: ${merkleRoot}`)
}

// Recommended pattern
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
