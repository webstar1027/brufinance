//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

import "@openzeppelin/contracts/utils/Create2.sol";

import "./../interfaces/IBruFactory.sol";

import "./BruPool.sol";

contract BruFactory is IBruFactory {
    address private admin;
    uint public poolCounter;

       
    // mapping(uint => address) public override poolAddresses;

    PoolDetails[] poolDetails;

    constructor(){
        admin = msg.sender;
    }


    modifier onlyAdmin{
        require(msg.sender == admin,"Can be used only by admin");
        _;
    }

    function deployPool(address priceFeedAddress, string memory poolName) external override onlyAdmin  {
        bytes32 salt = keccak256(abi.encodePacked(poolName));
        bytes memory bytecode = type(BruPool).creationCode;
        address poolAddress = Create2.deploy(0,salt,bytecode);
        BruPool(poolAddress).initialize(admin,priceFeedAddress,poolName);
        poolDetails.push(PoolDetails(poolAddress,poolName));
        emit PoolDeployed(poolName, poolAddress);
    }

    function getPoolAddress(uint poolIndex) external view override returns (address){
        return poolDetails[poolIndex].poolAddress;
    }

    function getPoolDetails() external view override returns (PoolDetails[] memory){
        return poolDetails;
    }

}