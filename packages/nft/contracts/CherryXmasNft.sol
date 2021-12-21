//SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/cryptography/MerkleProof.sol';

import './IERC2981.sol';

// @dev Owned ERC721 with additional ruggability:
//        - Minting through a preset merkle tree (known to deployer, secret to others)
//        - Minting sends dust if allowed
//        - Owner is able to force recover any token id back to the vault
//      Note that Opensea expects Ownable for access control to editing collection
contract CherryXmasNft is IERC2981, Ownable, ERC721Enumerable {
    using SafeERC20 for IERC20;

    uint256 private constant DUST_AMOUNT = 0.25 ether;

    string private __baseURI;
    string private _contractURI;
    uint256 private _royaltyRate; // specified in bps
    bytes32 private _merkleRoot;
    address private _minter;
    address private _vault;

    mapping(bytes32 => bool) public claimed; // merkle node => claimed

    modifier onlyMinter() {
        require(_msgSender() == _minter, 'M');
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        string memory contractURI_,
        uint256 royaltyRate_,
        bytes32 merkleRoot_,
        address minter_,
        address vault_
    ) ERC721(name_, symbol_) {
        __baseURI = baseURI_;
        _contractURI = contractURI_;
        _royaltyRate = royaltyRate_;

        _merkleRoot = merkleRoot_;

        _minter = minter_;
        _vault = vault_;
    }

    /// @dev Allow value to be transferred into this contract so it can send dust to users on mint
    receive() external payable {}

    /**********
     * Minting *
     ***********/

    /// @dev Mint token to an address if they provide a correct key and merkle inclusion proof of key
    function mint(
        address to,
        uint256 tokenId,
        bytes32 key,
        bytes32[] memory merkleProof
    ) external onlyMinter {
        _mint(to, tokenId, key, merkleProof);
        if (address(this).balance > DUST_AMOUNT) {
            // Ignore failures if recipient doesn't accept dust (but for some reason accepts NFTs 🤷‍♂️)
            to.call{value: DUST_AMOUNT}('');
        }
    }

    /// @dev Mint token to vault if they provide a correct key and merkle inclusion proof of key
    function mintToVault(
        uint256 tokenId,
        bytes32 key,
        bytes32[] calldata merkleProof
    ) external onlyMinter {
        _mint(_vault, tokenId, key, merkleProof);
    }

    function setMinter(address minter_) external onlyOwner {
        _minter = minter_;
    }

    function minter() public view returns (address) {
        return _minter;
    }

    function merkleRoot() public view returns (bytes32) {
        return _merkleRoot;
    }

    function _mint(
        address to,
        uint256 tokenId,
        bytes32 key,
        bytes32[] memory merkleProof
    ) internal {
        bytes32 node = keccak256(abi.encodePacked(tokenId, key));

        require(!claimed[node], 'N');
        require(MerkleProof.verify(merkleProof, _merkleRoot, node), 'P');
        claimed[node] = true;

        _safeMint(to, tokenId);
    }

    /***********************
     * Royalties (EIP 2981) *
     ************************/

    function setRoyaltyRate(uint256 royaltyRate_) external onlyOwner {
        _royaltyRate = royaltyRate_;
    }

    function royaltyRate() public view returns (uint256) {
        return _royaltyRate;
    }

    function royaltyInfo(
        uint256, /*tokenId*/
        uint256 salePrice
    ) external view returns (address receiver, uint256 royaltyAmount) {
        royaltyAmount = (salePrice * _royaltyRate) / 10000;
        return (_vault, royaltyAmount);
    }

    /***********
     * Recovery *
     ************/

    /// @dev Recover leftover dust or mistaken value transfers
    function recoverDust(address token) external onlyOwner {
        if (token == address(0)) {
            (bool success, ) = _vault.call{value: address(this).balance}('');
            require(success, 'F');
        } else {
            IERC20(token).safeTransfer(_vault, IERC20(token).balanceOf(address(this)));
        }
    }

    /// @dev Force recover a specific token id. Useful if user lost wallet used to claim token id or etc.
    function recoverTokenId(uint256 tokenId) external onlyOwner {
        address owner = ERC721.ownerOf(tokenId);
        _safeTransfer(owner, _vault, tokenId, '');
    }

    function vault() public view returns (address) {
        return _vault;
    }

    /*******
     * Misc *
     ********/

    function setBaseURI(string memory baseURI_) external onlyOwner {
        __baseURI = baseURI_;
    }

    function setContractURI(string memory contractURI_) external onlyOwner {
        _contractURI = contractURI_;
    }

    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    /// @dev Get all tokens. This is not intended to be used on-chain.
    function allTokens() public view returns (uint256[] memory tokens) {
        uint256 supply = ERC721Enumerable.totalSupply();
        tokens = new uint256[](supply);
        for (uint256 ii = 0; ii < supply; ++ii) {
            tokens[ii] = ERC721Enumerable.tokenByIndex(ii);
        }
    }

    /// @dev Get all tokens of a given address. This is not intended to be used on-chain.
    function tokensOf(address owner) public view returns (uint256[] memory tokens) {
        uint256 bal = ERC721.balanceOf(owner);
        tokens = new uint256[](bal);
        for (uint256 ii = 0; ii < bal; ++ii) {
            tokens[ii] = ERC721Enumerable.tokenOfOwnerByIndex(owner, ii);
        }
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(IERC165, ERC721Enumerable)
        returns (bool)
    {
        return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return __baseURI;
    }
}
