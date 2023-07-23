//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

import "../interfaces/IBruFactory.sol";
import "../interfaces/IBruProxy.sol";
import "../proxy/BruProxy.sol";
import "./BruPool.sol";

contract BruFactory is IBruFactory, UUPSUpgradeable {
    address private admin;
    uint256 poolCounter;
    address stakeAddress;
    bool init;

    // mapping(uint => address) public override poolAddresses;

    PoolDetails[] private poolDetails;

    function initialize() external override {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Can be used only by admin");
        _;
    }

    function addPoolDetails(
        string memory poolName,
        address proxyPoolAddress,
        address implementationAddress,
        address poolTokenAddress,
        address interestTokenAddress,
        address treasuryAddress
    ) external override {
        poolDetails.push(
            PoolDetails(
                poolName,
                poolTokenAddress,
                interestTokenAddress,
                proxyPoolAddress,
                implementationAddress,
                treasuryAddress
            )
        );
        emit ProxyPoolDeployed(
            poolName,
            poolTokenAddress,
            interestTokenAddress,
            proxyPoolAddress,
            implementationAddress,
            treasuryAddress
        );
    }

    function upgradeImplementationContractAddress(
        uint256 poolIndex,
        address newImplementationAddress
    ) external override onlyAdmin {
        address proxyPoolAddress = poolDetails[poolIndex].proxyPoolAddress;
        poolDetails[poolIndex]
            .implementationPoolAddress = newImplementationAddress;
        IBruProxy(proxyPoolAddress).upgradeTo(newImplementationAddress);
        emit ImplementationContractUpgraded(
            poolIndex,
            newImplementationAddress
        );
    }

    function getPoolAddress(uint256 poolIndex)
        external
        view
        override
        returns (address)
    {
        require(poolIndex <= poolDetails.length - 1, "Pool does not exist");
        return poolDetails[poolIndex].proxyPoolAddress;
    }

    function getPoolDetails(uint256 poolIndex)
        external
        view
        override
        returns (PoolDetails memory)
    {
        require(poolIndex <= poolDetails.length - 1, "Pool does not exist");
        return poolDetails[poolIndex];
    }

    function getAllPoolDetails()
        external
        view
        override
        returns (PoolDetails[] memory)
    {
        return poolDetails;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        view
        override
    {
        require(msg.sender == admin, "Only factory address allowed");
    }
}
