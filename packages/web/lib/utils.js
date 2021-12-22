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
