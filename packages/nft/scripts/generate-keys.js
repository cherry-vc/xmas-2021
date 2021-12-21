const fs = require('fs')
const path = require('path')

const csv = require('csvtojson')
const inquirer = require('inquirer')
const ethers = require('ethers')
const keccak256 = require('keccak256')
const { MerkleTree } = require('merkletreejs')

let wordlist

function toMerkleLeaf(keyphrase, index) {
  return ethers.utils.id(`${keyphrase}${index}`)
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
      default: 800,
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

async function merklizeKeyphraseHashes(hashes) {
  const tree = new MerkleTree(hashes, keccak256)
  return `0x${tree.getRoot().toString('hex')}`
}

async function main() {
  await loadWordlist()

  console.log('Generating key keyphrases')
  console.log('=========================')
  console.log()
  const keyphrases = await generateKeyphrases()
  const hashedKeyphrases = keyphrases.reduce((obj, keyphrase, index) => {
    obj[keyphrase] = { index, leaf: toMerkleLeaf(keyphrase, index) }
    return obj
  }, {})

  console.log('Dumping keyphrases to file')
  console.log('==========================')
  const outputPath = path.resolve(__dirname, '../keyphrases.json')
  fs.writeFileSync(outputPath, JSON.stringify(hashedKeyphrases, '', 2))
  console.log(`  File: ${outputPath}`)
  console.log()

  console.log('Generating merkle root')
  console.log('======================')
  const merkleRoot = await merklizeKeyphraseHashes(Object.values(hashedKeyphrases).map(({ leaf }) => leaf))
  console.log(`  Merkle root for set of keyphrases: ${merkleRoot}`)
}

// Recommended pattern
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
