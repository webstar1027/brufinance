//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

interface IBruRouter {
    function borrow(
        uint256 poolIndex,
        string memory nftId,
        address tokenAddress,
        uint256 tokenAmount
    ) external;

    function repay(
        uint256 poolIndex,
        string memory nftId,
        address tokenAddress,
        uint256 tokenAmount
    ) external;

    function deposit(
        uint256 poolIndex,
        address tokenAddress,
        uint256 tokenAmount
    ) external;

    function withdraw(
        uint256 poolIndex,
        uint256 tokenAmount
    ) external;

    function getPoolAddress(uint256 poolIndex) external returns (address);
}
