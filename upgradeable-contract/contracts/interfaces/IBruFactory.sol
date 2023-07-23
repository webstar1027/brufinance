//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

struct PoolDetails {
    string poolName;
    address poolTokenAddress;
    address interestTokenAddress;
    address proxyPoolAddress;
    address implementationPoolAddress;
    address treasuryAddress;
}

interface IBruFactory {
    event ProxyPoolDeployed(
        string poolName,
        address poolTokenAddress,
        address interestTokenAddress,
        address proxyPoolAddress,
        address implementationAddress,
        address treasuryAddress
    );
    event ImplementationContractUpgraded(
        uint256 poolIndex,
        address implementationAddress
    );

    function initialize() external;

    function addPoolDetails(
        string memory poolName,
        address proxyPoolAddress,
        address implementationAddress,
        address poolTokenAddress,
        address interestTokenAddress,
        address treasuryAddress
    ) external;

    function upgradeImplementationContractAddress(
        uint256 poolIndex,
        address implementationAddress
    ) external;

    // function deployPool(address priceFeedAddress, string memory poolName) external;

    function getPoolAddress(uint256 poolIndex) external view returns (address);

    function getPoolDetails(uint256 poolIndex)
        external
        view
        returns (PoolDetails memory);

    function getAllPoolDetails() external view returns (PoolDetails[] memory);
}
