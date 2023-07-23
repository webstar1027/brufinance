//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IBruFactory.sol";
import "prb-math/contracts/PRBMathUD60x18.sol";

import "../tokens/BruToken.sol";

struct LiquidityMiningInterval {
    uint256 id;
    uint256 startTime;
    uint256 endTime;
    uint256 totalLendAmount;
    uint256 totalBorrowedAmount;
    bool isActive;
}

struct UserBalance {
    uint256 lendAmount;
    uint256 borrowedAmount;
}

struct UserIntervalDetails {
    mapping(address => bool) isLender;
    mapping(address => bool) isBorrower;
    address[] userAddresses;
}

// struct UserDetails{

// }

contract StakePool {
    using PRBMathUD60x18 for uint256;
    address internal factoryAddress;
    uint256 internal disburseTokenAmount;
    address internal tokenAddress;
    address internal stakedTokenAddress;
    bool internal pause;
    mapping(uint256 => uint256) internal intervalIds;
    mapping(uint256 => LiquidityMiningInterval) internal intervals;
    mapping(uint256 => mapping(address => UserBalance)) internal userBalance;
    mapping(uint256 => mapping(uint256 => UserIntervalDetails))
        internal userIntervalDetails;
    address[] internal userAddresses;
    uint256 tokenAccrualSpeed;
    mapping(address => bool) internal hasStaked;
    uint256 internal stakingInterest;

    constructor(
        address _factoryAddress,
        address _tokenAddress,
        address _stakedTokenAdress
    ) {
        stakingInterest = uint256(100).div(1000);
        factoryAddress = _factoryAddress;
        tokenAddress = _tokenAddress;
        stakedTokenAddress = _stakedTokenAdress;
        disburseTokenAmount = 10000000000000000000000;
    }

    function startLiquidityMiningInterval(
        uint256 poolIndex,
        uint256 durationInDays
    ) external {
        if (intervals[poolIndex].isActive == true) {
            revert("An interval is already active");
        }
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + durationInDays * 86400;
        intervals[poolIndex] = LiquidityMiningInterval(
            intervalIds[poolIndex],
            block.timestamp,
            endTime,
            0,
            0,
            true
        );
        intervalIds[poolIndex] += 1;
    }

    // funcion add

    function endLiquidityMiningInterval(uint256 poolIndex) external {
        intervals[poolIndex].isActive = false;
        disburseBruTokenToUsers(poolIndex);
    }

    function isIntervalActive(uint256 poolIndex) external view returns (bool) {
        if (intervals[poolIndex].isActive == true) {
            return true;
        } else {
            return false;
        }
    }

    function getLatestIntervalForPool(uint256 poolIndex)
        public
        view
        returns (LiquidityMiningInterval memory)
    {
        return intervals[poolIndex];
    }

    // function stake(uint256 tokenAmount) external {
    //     if (hasStaked[msg.sender] == false) {
    //         hasStaked[msg.sender] = true;
    //         userAddresses.push(msg.sender);
    //     }

    //     IERC20(tokenAddress).transferFrom(
    //         msg.sender,
    //         address(this),
    //         tokenAmount
    //     );
    //     BruToken(stakedTokenAddress).mint(msg.sender, tokenAmount);
    // }

    function updateLendAmountInInterval(
        uint256 poolIndex,
        uint256 _type,
        address _userAddress,
        uint256 amount
    ) external {
        uint256 intervalId = intervalIds[poolIndex] - 1;
        if (
            userIntervalDetails[poolIndex][intervalId].isBorrower[
                _userAddress
            ] ==
            false &&
            userIntervalDetails[poolIndex][intervalId].isLender[_userAddress] ==
            false
        ) {
            userIntervalDetails[poolIndex][intervalId].isLender[
                _userAddress
            ] = true;
            userIntervalDetails[poolIndex][intervalId].userAddresses.push(
                _userAddress
            );
        }
        if (
            userIntervalDetails[poolIndex][intervalId].isBorrower[
                _userAddress
            ] == true
        ) {
            userIntervalDetails[poolIndex][intervalId].isLender[
                _userAddress
            ] = true;
        }

        if (_type == 1) {
            userBalance[poolIndex][_userAddress].lendAmount += amount;
            intervals[poolIndex].totalLendAmount += amount;
        } else if (_type == 2) {
            userBalance[poolIndex][_userAddress].lendAmount -= amount;
            intervals[poolIndex].totalLendAmount -= amount;
        } else {
            revert("invalid type");
        }
    }

    //mod delta if delta < 0
    // function bondCurve(uint256 delta, uint256 poolBalance) internal {
    //     uint256 term2 = (disburseTokenAmount + delta)**3;
    //     if (0 < delta < 20) {
    //         tokenAccrualSpeed = term2 / 3 - poolBalance;
    //     } else if (delta > 50) {
    //         tokenAccrualSpeed = term2 / (3 * delta**2) - poolBalance;
    //     } else {
    //         tokenAccrualSpeed = term2 / (3 * delta**3) - poolBalance;
    //     }
    // }

    function updateBorrowAmountInInterval(
        uint256 poolIndex,
        uint256 _type,
        address _userAddress,
        uint256 amount
    ) external {
        uint256 intervalId = intervalIds[poolIndex] - 1;
        if (
            userIntervalDetails[poolIndex][intervalId].isBorrower[
                _userAddress
            ] ==
            false &&
            userIntervalDetails[poolIndex][intervalId].isLender[_userAddress] ==
            false
        ) {
            userIntervalDetails[poolIndex][intervalId].isBorrower[
                _userAddress
            ] = true;
            userIntervalDetails[poolIndex][intervalId].userAddresses.push(
                _userAddress
            );
        }
        if (
            userIntervalDetails[poolIndex][intervalId].isLender[
                _userAddress
            ] = true
        ) {
            userIntervalDetails[poolIndex][intervalId].isBorrower[
                _userAddress
            ] = true;
        }
        if (_type == 1) {
            userBalance[poolIndex][_userAddress].borrowedAmount += amount;
            intervals[poolIndex].totalBorrowedAmount += amount;
        } else if (_type == 2) {
            userBalance[poolIndex][_userAddress].borrowedAmount -= amount;
            intervals[poolIndex].totalBorrowedAmount -= amount;
        } else {
            revert("invalid type");
        }
    }

    function changeDisburseTokenAmount(uint256 tokenAmount) external {
        disburseTokenAmount = tokenAmount;
    }

    function disburseTokens() internal {
        PoolDetails[] memory poolDetails = IBruFactory(factoryAddress)
            .getAllPoolDetails();
        uint256 poolTokenAmount = disburseTokenAmount / poolDetails.length;
        for (uint256 i = 0; i < poolDetails.length; i++) {
            BruToken(tokenAddress).mint(
                poolDetails[i].proxyPoolAddress,
                poolTokenAmount
            );
        }
    }

    function disburseBruTokenToUsers(uint256 poolIndex) public {
        uint256 intervalId = intervals[poolIndex].id;
        address[] memory _userAddresses = userIntervalDetails[poolIndex][
            intervalId
        ].userAddresses;
        // PoolDetails[] memory poolDetails = IBruFactory(factoryAddress)
        //     .getAllPoolDetails();
        uint256 poolTokenAmount = disburseTokenAmount / 1;
        LiquidityMiningInterval memory interval = getLatestIntervalForPool(
            poolIndex
        );
        poolTokenAmount = poolTokenAmount / 2;
        for (uint256 i = 0; i < _userAddresses.length; i++) {
            uint256 bruTokenAmountForLend;
            uint256 bruTokenAmountForBorrow;
          
            if (interval.totalLendAmount > 0) {
                uint256 userPercentageInLend = (
                    userBalance[poolIndex][_userAddresses[i]].lendAmount
                ).div(interval.totalLendAmount);
                bruTokenAmountForLend =
                    (userPercentageInLend * poolTokenAmount) /
                    10**18;
            }

            if (interval.totalBorrowedAmount > 0) {
                uint256 userPercentageInBorrow = (
                    userBalance[poolIndex][_userAddresses[i]].borrowedAmount
                ).div(interval.totalBorrowedAmount);
                bruTokenAmountForBorrow =
                    (userPercentageInBorrow * poolTokenAmount) /
                    10**18;
            }
        }
    }

    function depositInterest() external {
        for (uint256 i = 0; i < userAddresses.length; i++) {
            uint256 currentBalance = BruToken(stakedTokenAddress).balanceOf(
                userAddresses[i]
            );
            uint256 interestAmount = (currentBalance * stakingInterest) /
                10**18;
            BruToken(tokenAddress).mint(userAddresses[i], interestAmount);
        }
    }
}
