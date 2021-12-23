const cherryXmasNft2021Abi = [
  'function mint(address to, uint256 tokenId, bytes32 key, bytes32[] memory merkleProof)',
  'function mintToVault(uint256 tokenId, bytes32 key, bytes32[] calldata merkleProof)',
  'function claimed(bytes32 key) view returns (bool)',
  'function allTokens() view returns (uint256[] memory tokens)',
  'function tokensOf(address owner) view returns (uint256[] memory tokens)',
]

export default cherryXmasNft2021Abi
