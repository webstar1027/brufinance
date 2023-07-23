//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

interface IPoolToken {
    function changeName(string memory tokenName) external;

    function mint(address userAddress, uint256 tokenAmount) external;

    function burn(address userAddress, uint256 tokenAmount) external;

    function setPoolAddress(address _poolAddress) external;
}
