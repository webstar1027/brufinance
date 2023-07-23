// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./token/ERC20/ERC20.sol";

contract bToken is ERC20 {
    address public owner;

    constructor() ERC20("BToken", "BTKN") {
        _mint(msg.sender, 100000000000000000000000000);
        owner = msg.sender;
    }

    function approveBTokenSpender(address spender, uint256 amount)
        public
        returns (bool)
    {
        return approve(spender, amount);
    }

    function mintBTokens(address to, uint256 tokens) external {
        require(msg.sender == owner);
        _mint(to, tokens);
    }

    function burnBTokens(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function allowanceForBTokens(address account, address spenders)
        public
        view
        returns (uint256)
    {
        return allowance(account, spenders);
    }

    function increaseAllowanceForBTokens(address spender, uint256 addedValue)
        public
        returns (bool)
    {
        return increaseAllowance(spender, addedValue);
    }

    function decreaseAllowanceForBTokens(
        address spender,
        uint256 subtractedValue
    ) public returns (bool) {
        return decreaseAllowance(spender, subtractedValue);
    }

    function transferBTokens(address recipient, uint256 amount)
        public
        returns (bool)
    {
        return transfer(recipient, amount);
    }

    function transferBTokensFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public returns (bool) {
        return transferFrom(sender, recipient, amount);
    }
}
