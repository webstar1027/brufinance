//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../interfaces/IPoolToken.sol";
import "../interfaces/IBruPool.sol";

contract InterestToken is IPoolToken, ERC20 {
    address internal poolAddress;
    address internal admin;
    bool allowTransfer;
    string private _name;

    event NameChanged(string newName, address by);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyPool() {
        require(msg.sender == poolAddress, "Only Pool");
        _;
    }

    constructor(
        string memory tokenName,
        string memory symbol
    ) ERC20(tokenName, symbol) {
        admin = msg.sender;
    }

    function name() public view override returns (string memory) {
        return _name;
    }

    function changeName(string memory tokenName) public override onlyAdmin {
        _name = tokenName;
        emit NameChanged(tokenName, msg.sender);
    }

    function changeTransferStatus() external onlyAdmin {
        if (allowTransfer == true){
            allowTransfer = false;
        } else {
            allowTransfer = true;
        }
    }

    function mint(address userAddress, uint256 mintamount)
        public
        override
        onlyPool
    {
        _mint(userAddress, mintamount);
    }

    function burn(address userAddress, uint256 mintamount)
        public
        override
        onlyPool
    {
        _burn(userAddress, mintamount);
    }

    function setPoolAddress(address _poolAddress) external override onlyAdmin {
        poolAddress = _poolAddress;
    }

    function transfer(address to, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        super.transfer(to, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    
}
