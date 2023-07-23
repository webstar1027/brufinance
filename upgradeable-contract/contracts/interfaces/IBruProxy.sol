//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

interface IBruProxy {
    function upgradeTo(address implementationAddress) external;
}
