//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BruToken is ERC20 {
    uint256 public MAX_SUPPLY = 62500000000000000000000000;

    constructor() ERC20("BruTestToken", "BruTestToken") {}

    function mint(address account, uint256 amount) external {
        if (MAX_SUPPLY >= totalSupply() + amount) {
            _mint(account, amount);
        }
    }
}
