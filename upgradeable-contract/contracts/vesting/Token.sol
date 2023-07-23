// contracts/Token.sol
// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Token is ERC20 {
    uint256 public initialTokenSupply;
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        initialTokenSupply = initialSupply;
        _mint(msg.sender, initialSupply);
    }
    function getInitialSupply() public view returns (uint256){
        return initialTokenSupply;
    }
}
