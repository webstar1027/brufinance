// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract BruProxy is ERC1967Proxy  {

    constructor(address _implementationAddress) ERC1967Proxy(_implementationAddress,"") {
    }

}