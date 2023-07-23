//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

//Rates
struct Rates {
    uint256 borrow;
    uint256 lend;
}

//Platform Fees
struct PlatformFees {
    uint256 borrow;
    uint256 lend;
}

interface IBruAdmin {
    function admin() external returns (address);

    function allowTokenAddress(address tokenAddress) external;

    function enableBorrow() external;

    function disableBorrow() external;

    function changeStableInterestRate(uint256 _interestRate) external;

    function changeNonWithdrawFees(uint256 _interestRate) external;

    function changeBorrowPlatformFee(uint256 fee) external;

    function changeLendPlatformFee(uint256 fee) external;

    function changeSpread(uint256 _spread) external;

    function changeLockPeriod(uint256 time) external;

    function changeBorrowInterestRate(uint256 _interestRate) external;

}
