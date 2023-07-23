//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

struct PoolDetails {
    address poolAddress;
    string poolName;
}

interface IBruFactory {
    event PoolDeployed(string poolName, address poolAddress);


    function deployPool(address priceFeedAddress, string memory poolName) external;

    function getPoolAddress(uint poolIndex) external view returns(address);

    function getPoolDetails() external view returns (PoolDetails[] memory);
}
