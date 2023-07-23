//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

import "./interfaces/IBruFactory.sol";
import "./interfaces/IBruRouter.sol";
import "./interfaces/IBruPool.sol";
contract BruRouter is IBruRouter {
    address private factoryAddress;

    constructor(address _address) {
        factoryAddress = _address;
    }

    function borrow(
        uint256 poolIndex,
        string memory nftId,
        address tokenAddress,
        uint256 tokenAmount
    ) external override { 
        address poolAddress = getPoolAddress(poolIndex);
        require(poolAddress != address(0), "Pool does not exist");
        IBruPool(poolAddress).borrow(
            msg.sender,
            nftId,
            tokenAddress,
            tokenAmount
        );
    }

    function repay(
        uint256 poolIndex,
        string memory nftId,
        address tokenAddress,
        uint256 tokenAmount
    ) external override{
        address poolAddress = getPoolAddress(poolIndex);
        require(poolAddress != address(0), "Pool does not exist");
        IBruPool(poolAddress).repay(
            msg.sender,
            nftId,
            tokenAmount,
            tokenAddress
        );
    }

    function deposit(
        uint256 poolIndex,
        address tokenAddress,
        uint256 tokenAmount
    ) external override {
        address poolAddress = getPoolAddress(poolIndex);
        require(poolAddress != address(0), "Pool does not exist");  
        IBruPool(poolAddress).deposit(msg.sender, tokenAddress, tokenAmount);
    }

    function withdraw(
        uint256 poolIndex,
        uint256 tokenAmount
    ) external override {
        address poolAddress = getPoolAddress(poolIndex);
        require(poolAddress != address(0), "Pool does not exist");
        IBruPool(poolAddress).withdraw(msg.sender, tokenAmount);
    }

    function getPoolAddress(uint256 poolIndex)
        public
        view
        override
        returns (address)
    {
        return IBruFactory(factoryAddress).getPoolAddress(poolIndex);
    }

    function getPoolDetails(uint256 poolIndex)
        external
        view
        returns (PoolDetails memory)
    {
        return IBruFactory(factoryAddress).getPoolDetails(poolIndex);
    }

    function getAllPoolDetails() external view returns(PoolDetails[] memory){
        return IBruFactory(factoryAddress).getAllPoolDetails();
    }
}
