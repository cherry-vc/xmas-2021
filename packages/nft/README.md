# NFT

Mostly vanilla ERC-721 NFT with a little bit of extra ruggability:

- Minting through a preset merkle tree (known to deployer, secret to others). Useful for gift codes to a preset list of recipients.
- Owner is able to force recover any token id back to a set vault. Useful in case any recipient loses their wallet.

And some other quality of life things:

- Minting sends dust if allowed by recipient
- Royalties directed to vault (assuming EIP-2981 support)
