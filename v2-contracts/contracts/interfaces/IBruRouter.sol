//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

interface IBruRouter {
    
    function deposit(
        uint256 poolIndex,
        address tokenAddress,
        uint256 tokenAmount
    ) external;

    function withdraw(
        uint256 poolIndex,
        address tokenAddress,
        uint256 tokenAmount
    ) external;

    function getPoolAddress(uint256 poolIndex) external returns (address);
}
