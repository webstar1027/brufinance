//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDT is ERC20 {
    uint256 MAX_INT = 2**256 - 1;

    constructor(uint256 initialSupply) ERC20("USD Tether", "USDT") {
        _mint(msg.sender, initialSupply);
    }

    function mint(address _address, uint256 amount) public {
        _mint(_address, amount);
    }

    function burn(address _address, uint256 amount) public {
        _burn(_address, amount);
    }

    function approveTokensForTransfer(address _address) public {
        approve(_address, MAX_INT);
    }
}
