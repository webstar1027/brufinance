//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./BruPool.sol";

contract AssetTreasury is ERC1155 {
    uint256 tokenId;
    address factoryAddress;
    address poolAddress;
    address adminAddress;

    constructor(address _poolAddress) ERC1155("") {
        adminAddress = msg.sender;
        poolAddress = _poolAddress;
    }

    modifier onlyadmin() {
        require(msg.sender == adminAddress, "Only admin can mint");
        _;
    }

    function mintNft(
        address userAddress,
        string memory nftId,
        string memory commodityId,
        uint256 quantity,
        uint256 value,
        string memory datahash,
        string memory data
    ) external {
        tokenId++;
        _mint(userAddress, tokenId, 1, "");
        // nft[nid] = NFT(tokenId, cid, quantity, v, false, h, data);
        IBruPool(poolAddress).mintNft(
            tokenId,
            nftId,
            commodityId,
            quantity,
            value,
            datahash,
            data
        );
    }

    function liquidateAsset() external {}
}
