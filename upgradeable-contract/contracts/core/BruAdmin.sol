//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

import "prb-math/contracts/PRBMathUD60x18.sol";

import "./../interfaces/IBruAdmin.sol";

//Admin functionality contract

contract BruAdmin is IBruAdmin {
    //for floating point arithmetics
    using PRBMathUD60x18 for uint256;

    //Admin address
    address public override admin;

    //variables for enabling/disabling functionality
    bool internal allowBorrow;
    // //variable used to divide time difference by (1 = 1 sec, 1hour = 3600, 1 day = 86400)
    // uint256 public override interval = 1;
    // //determines the lock period
    // uint256 public override lockPeriod = 180; //3mins

    // determines the lending rate
    uint256 internal spread;

    uint256 internal nonWithdrawFees;

    // Mapping for maintaing addresses of stablecoins allowed by the admin
    mapping(address => bool) internal allowedTokenAddresses;

    //Array of tokens which can be used in this pool
    address[] internal tokenAddresses;

    Rates public rates;

    PlatformFees public platformFees;

    uint256 public lockPeriod;
    //Pool Limits
    struct PoolBorrowLimits {
        mapping(address => uint256) limit;
    }

    //admin modifier
    modifier onlyAdmin() {
        require(msg.sender == admin, "Can be used only by admin");
        _;
    }

    function allowTokenAddress(address tokenAddress)
        external
        override
        onlyAdmin
    {
        require(
            allowedTokenAddresses[tokenAddress] == false,
            "Already allowed by admin"
        );
        allowedTokenAddresses[tokenAddress] = true;
        tokenAddresses.push(tokenAddress);
    }

    function enableBorrow() external override onlyAdmin {
        allowBorrow = true;
    }

    function disableBorrow() external override onlyAdmin{
        allowBorrow = false;
    }

    function changeStableInterestRate(uint256 _interestRate)
        external
        override
        onlyAdmin
    {
        rates.lend = _interestRate.div(1000);
    }

    function changeNonWithdrawFees(uint256 _interestRate)
        external
        override
        onlyAdmin
    {
        nonWithdrawFees = _interestRate.div(1000);
    }

    function changeBorrowInterestRate(uint256 _interestRate)
        external
        override
        onlyAdmin
    {
        rates.borrow = _interestRate.div(1000);
    }

    function changeBorrowPlatformFee(uint256 fee) external override onlyAdmin {
        platformFees.borrow = fee.div(10000);
    }

    function changeLendPlatformFee(uint256 fee) external override onlyAdmin {
        platformFees.lend = fee.div(10000);
    }

    // function changeInterval(uint256 time) external override onlyAdmin {
    //     require(time > 0, "Time should be greater than zero");
    //     interval = time;
    // }

    function changeLockPeriod(uint256 time) external override onlyAdmin {
        require(time > 0, "time should be greater than zero");
        lockPeriod = time;
    }

    function changeSpread(uint256 _spread) external override onlyAdmin {
        spread = _spread;
        rates.lend = rates.borrow - spread;
    }
}
