import { ethers } from 'ethers'

export function debug(...args) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(...args)
  }
}

export function prod(...args) {
  if (process.env.NODE_ENV === 'production') {
    console.error(...args)
  }
}

export function sortBn(a, b) {
  const aBn = ethers.BigNumber.from(a)
  const bBn = ethers.BigNumber.from(b)

  return aBn.gt(bBn) ? 1 : -1
}
