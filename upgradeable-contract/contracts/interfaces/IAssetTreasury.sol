//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;
interface IAssetTreasury {
    function balanceOf(address userAddress, uint tokenId) external returns(uint);
}
