//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "prb-math/contracts/PRBMathUD60x18.sol";

import "../interfaces/IBruPool.sol";
import "../interfaces/IPoolToken.sol";
import "./StakePool.sol";
import "./BruAdmin.sol";
import "./AssetTreasury.sol";
import "../tokens/BruToken.sol";

struct EndOfDayBalance {
    uint256 amount;
    uint256 day;
}

struct BondDetails {
    uint256 bondId;
    address tokenAddress;
    uint256 bondTimestamp;
    uint256 interest;
    uint256 bondAmount;
    uint256 lockTimePeriod;
    uint256 day;
}

struct NFT {
    uint256 tokenId;
    string commodityId;
    uint256 quantity;
    uint256 value;
    bool borrowed;
    string dataHash;
    string data;
}

struct User {
    address userAddress;
    bool isLender;
    // EndOfDayBalance[] EODBalanceArray;
    BondDetails[] activeBonds; // non-mature bonds
    BondDetails[] inactiveBonds; // mature bonds
}

contract BruPool is BruAdmin, IBruPool, UUPSUpgradeable {
    //for handling floating point artihmetics
    using PRBMathUD60x18 for uint256;
    // name of the pool
    string public override name;
    // addresses

    //for handling ID of btoken and nft
    uint256 nftIdCounter;
    uint256 bondId;

    //important addresses
    address factory;
    address poolTokenAddress;
    address interestTokenAddress;
    address treasuryAddress;
    address stakeAddress;

    //Array for storing addresses of users.
    address[] internal addresses;

    // mapping which stores nft data
    mapping(string => NFT) public nft;

    //mapping for storing borrow details of NFT
    mapping(string => BorrowDetails) public borrowedNft;

    //mapping for storing expenses
    mapping(address => uint256[]) expenses;

    mapping(address => User) userInfo;

    //Mapping which stores end of day balance of the user
    mapping(address => EndOfDayBalance[]) EODBalanceArray;

    //Other expenses mapping
    mapping(string => Expenses) public totalExpense;

    mapping(uint256 => BondDetails) internal activeBonds;

    mapping(uint256 => address) internal bondOwner;

    //Struct used for storing NFT Data
    address bruTokenAddress;
    //Struct for other expenses

    struct Expenses {
        uint256 otherexpenses;
        uint256 interest;
    }

    function initialize(
        address adminAddress,
        address factoryAddress,
        address _poolTokenAddress,
        address _interestTokenAddress,
        address _treasuyAddress,
        
        string memory poolName
    ) external override {
        admin = adminAddress;
        factory = factoryAddress;
        name = poolName;
        rates.borrow = uint256(100).div(1000);
        platformFees.borrow = uint256(1).div(10000);
        platformFees.lend = uint256(1).div(10000);
        spread = uint256(30).div(1000);
        rates.lend = rates.borrow - spread;
        poolTokenAddress = _poolTokenAddress;
        interestTokenAddress = _interestTokenAddress;
        treasuryAddress = _treasuyAddress;
       
        nonWithdrawFees = 0;
        lockPeriod = 180;
    }

    // Borrow Functionalities

    function mintNft(
        uint256 tokenId,
        string memory nftId,
        string memory commodityId,
        uint256 quantity,
        uint256 value,
        string memory datahash,
        string memory data
    ) external override {
        require(nft[nftId].quantity == 0, "minted already");
        nft[nftId] = NFT(
            tokenId,
            commodityId,
            quantity,
            value,
            false,
            datahash,
            data
        );
    }

    // function liquidateAsset(string memory nftId, address userAddress)
    //     external
    //     onlyAdmin
    // {
    //     NFT memory asset = nft[nftId];
    //     AssetTreasury(treasuryAddress).safeTransferFrom(
    //         userAddress,
    //         address(this),
    //         asset.tokenId,
    //         1,
    //         ""
    //     );
    // }

    // function evaluateCurrentvalueOfAsset() external {
    //     for(uint i = 0; i< borrowedNftArray.length;i++){
    //         string memory commodityId = nft[borrowedNftArray[i]].commodityId;
    //         uint price = IBruPrice(priceAddress).asset(commodityId).price;
    //     }
    // }

    //borrow functionality
    function getUserActiveBonds(address userAddress)
        public
        view
        returns (BondDetails[] memory)
    {
        return userInfo[userAddress].activeBonds;
    }

    function getUserInactiveBonds(address userAddress)
        public
        view
        returns (BondDetails[] memory)
    {
        return (userInfo[userAddress].inactiveBonds);
    }

    function borrow(
        address userAddress,
        string memory nftId,
        address tokenAddress,
        uint256 tokenAmount
    ) external override {
        require(
            AssetTreasury(treasuryAddress).balanceOf(
                userAddress,
                nft[nftId].tokenId
            ) == 1,
            "1"
        );
        require(nft[nftId].borrowed == false, "Already borrowed on this NFT");
        require(
            IERC20(tokenAddress).balanceOf(address(this)) > tokenAmount,
            "Pool does not have enough liquidity"
        );
        require(
            tokenAmount <= (nft[nftId].value * 7) / 10,
            "Collateral provided is less for specified token amount"
        );

        nft[nftId].borrowed = true;
        borrowedNft[nftId] = BorrowDetails(tokenAmount, block.timestamp);
        // if (StakePool(stakeAddress).isIntervalActive(0) == true) {
        //     StakePool(stakeAddress).updateBorrowAmountInInterval(
        //         0,
        //         1,
        //         userAddress,
        //         tokenAmount
        //     );
        // }
        bool result = IERC20(tokenAddress).transfer(userAddress, tokenAmount);
        require(result, "transfer failed while borrowing");
        emit BorrowEvent(1, userAddress, block.timestamp, tokenAmount);
    }

    function repay(
        address userAddress,
        string memory nftId,
        uint256 tokenAmount,
        address tokenAddress
    ) external override {
        require(
            AssetTreasury(treasuryAddress).balanceOf(
                userAddress,
                nft[nftId].tokenId
            ) == 1,
            "1"
        );
        borrowInterest(nftId);
        uint256 amount = (tokenAmount * (10**18)) /
            (1000000000000000000 + platformFees.borrow);
        uint256 totalPayablePrice = borrowedNft[nftId].borrowedAmount +
            totalExpense[nftId].interest;
      
        require(nft[nftId].borrowed == true, "This NFT is not borrowed");
        require(
            amount <= totalPayablePrice,
            "Amount given greater than borrowed amount"
        );
       

        //tokenAmount-=totalExpense[nftId];
        if (amount >= totalExpense[nftId].interest) {
            amount -= totalExpense[nftId].interest;
            totalExpense[nftId].interest = 0;
            borrowedNft[nftId].borrowedAmount -= amount;
        } else {
            totalExpense[nftId].interest -= amount;
        }
        borrowedNft[nftId].time = block.timestamp;
        if (borrowedNft[nftId].borrowedAmount == 0) {
            nft[nftId].borrowed = false;
            borrowedNft[nftId] = BorrowDetails(0, 0);
        }

        bool result = IERC20(tokenAddress).transferFrom(
            userAddress,
            address(this),
            tokenAmount
        );

        require(result, "transfer failed while repaying");
        emit RepayEvent(1, userAddress, block.timestamp, tokenAmount);
    }

    function borrowInterest(string memory nftId) public returns (uint256) {
        uint256 borrowedDays = (block.timestamp - borrowedNft[nftId].time) /
            86400;
        totalExpense[nftId].interest +=
            (borrowedNft[nftId].borrowedAmount * rates.borrow * borrowedDays) /
            (365 * (10**18));
        return totalExpense[nftId].interest;
    }

    function updateInterest(string memory nftId) public {
        totalExpense[nftId].interest = totalExpense[nftId].interest / (10**18);
    }

    function deposit(
        address userAddress,
        address tokenAddress,
        uint256 tokenAmount
    ) external virtual override {
        require(
            allowedTokenAddresses[tokenAddress] == true,
            "Token Address not allowed"
        );
        require(tokenAmount > 0, "Token Amount less than one");
        require(
            IERC20(tokenAddress).balanceOf(userAddress) >= tokenAmount,
            "Insufficient Token Amount"
        );
        uint256 amount = (tokenAmount * (10**18)) /
            (1000000000000000000 + platformFees.lend);
        // uint256 platformFees = (tokenAmount * platformFees.lend) / 10**18;
        // require(
        //     IERC20(tokenAddress).balanceOf(userAddress) >= platformFees,
        //     "Token Amount is less than platform fees"
        // );

        // tokenAmount -= platformFees;
     
        if (userInfo[userAddress].isLender == false) {
            userInfo[userAddress].isLender = true;
            addresses.push(userAddress);
        }

        activeBonds[bondId] = BondDetails(
            bondId,
            tokenAddress,
            block.timestamp,
            rates.lend,
            amount,
            lockPeriod,
            0
        );

        bondOwner[bondId] = msg.sender;
        userInfo[userAddress].activeBonds.push(
            BondDetails(
                bondId,
                tokenAddress,
                block.timestamp,
                rates.lend,
                amount,
                lockPeriod,
                0
            )
        );
        bondId++;
        bool result = IERC20(tokenAddress).transferFrom(
            userAddress,
            address(this),
            tokenAmount
        );
        require(result, "Failed transfer while depositing");
        // if (StakePool(stakeAddress).isIntervalActive(0) == true) {
        //     StakePool(stakeAddress).updateLendAmountInInterval(
        //         0,
        //         1,
        //         userAddress,
        //         tokenAmount
        //     );
        // }
        IPoolToken(poolTokenAddress).mint(userAddress, amount);

        emit LendEvent(1, userAddress, block.timestamp, amount);
    }

    function createBond(
        address tokenAddress,
        uint256 time,
        uint256 rate,
        uint256 amount,
        uint256 lockPeriod
    ) internal view returns (BondDetails memory) {
        return
            BondDetails(
                bondId,
                tokenAddress,
                time,
                rate,
                amount,
                lockPeriod,
                0
            );
    }

    function transferBond(
        address from,
        address to,
        uint256 amount
    ) external override {
        require(
            userInfo[from].activeBonds.length != 0,
            "There are no bonds for the user"
        );
        for (uint256 i = 0; i < userInfo[from].activeBonds.length; i++) {
            BondDetails memory bond = createBond(
                userInfo[from].activeBonds[i].tokenAddress,
                block.timestamp,
                userInfo[from].activeBonds[i].interest,
                amount,
                1
            );
            if (userInfo[from].activeBonds[i].bondAmount > amount) {
                userInfo[from].activeBonds[i].bondAmount -= amount;
                activeBonds[bondId] = createBond(
                    userInfo[from].activeBonds[i].tokenAddress,
                    block.timestamp,
                    rates.lend,
                    amount,
                    1
                );
                bondOwner[bondId] = to;
                userInfo[to].activeBonds.push(
                    BondDetails(
                        bondId,
                        userInfo[from].activeBonds[i].tokenAddress,
                        block.timestamp,
                        rates.lend,
                        amount,
                        1,
                        0
                    )
                );
                //userBondsArray[to].push(BondDetails(userBondsArray[from][i].tokenAddress,block.timestamp,STABLE_RATE,amount));
                //should we transfer interest or not ?
                break;
            } else if (userInfo[from].activeBonds[i].bondAmount == amount) {
                activeBonds[bondId] = bond;
                bondOwner[bondId] = to;
                userInfo[to].activeBonds.push(bond);
                remove(i, from);
                break;
            } else {
                amount -= userInfo[from].activeBonds[i].bondAmount;
                activeBonds[bondId] = bond;
                bondOwner[bondId] = to;
                userInfo[to].activeBonds.push(bond);
                remove(i, from);
            }
            bondId++;
        }
    }

    function withdrawable(uint256 bondCreationTime, uint256 bondLockPeriod)
        internal
        view
        returns (bool)
    {
        uint256 currentTime = block.timestamp;
        uint256 timePassedFromDeposit = currentTime - bondCreationTime;
        if (timePassedFromDeposit >= bondLockPeriod) {
            return true;
        } else {
            return false;
        }
    }

    function getWithdrawableBalance(address userAddress)
        public
        view
        returns (uint256)
    {
        uint256 withdrawableBalance;
        BondDetails[] memory arr = userInfo[userAddress].activeBonds;
        for (uint256 i = 0; i < arr.length; i++) {
            if (
                withdrawable(arr[i].bondTimestamp, arr[i].lockTimePeriod) ==
                true
            ) {
                withdrawableBalance += arr[i].bondAmount;
            }
        }
        BondDetails[] memory bonds = userInfo[userAddress].inactiveBonds;
        for (uint256 i = 0; i < bonds.length; i++) {
            withdrawableBalance += bonds[i].bondAmount;
        }
       
        return withdrawableBalance;
    }

    function addToInactiveBonds(address userAddress) public {
    
        BondDetails[] memory arr = userInfo[userAddress].activeBonds;
        for (uint256 k = 0; k < arr.length; k++) {
            if (
                withdrawable(arr[k].bondTimestamp, arr[k].lockTimePeriod) ==
                true
            ) {
              
                userInfo[userAddress].inactiveBonds.push(
                    BondDetails(
                        arr[k].bondId,
                        arr[k].tokenAddress,
                        arr[k].bondTimestamp,
                        arr[k].interest,
                        arr[k].bondAmount,
                        arr[k].lockTimePeriod,
                        0
                    )
                );
             
                removeActiveBond(k, userAddress);
              
            }
        }
    }

    function deductFromInactiveBonds(address userAddress, uint256 tokenAmount)
        internal
    {
        uint256 removeCounter;
        BondDetails[] memory bonds = userInfo[userAddress].inactiveBonds;
        for (uint256 i = 0; i < bonds.length; i++) {
            if (tokenAmount == 0) {
                break;
            } else {
                if (bonds[i].bondAmount > tokenAmount) {
                    userInfo[userAddress]
                        .inactiveBonds[i]
                        .bondAmount -= tokenAmount;

                    bool result = IERC20(bonds[i].tokenAddress).transfer(
                        userAddress,
                        tokenAmount
                    );
                    require(result, "Failed transfer while withdrawing");
                    break;
                } else if (bonds[i].bondAmount == tokenAmount) {
                    //remove inactivebond[i]
                    removeCounter++;
                    // removeFromInactiveBond(i, userAddress);
                    bool result = IERC20(bonds[i].tokenAddress).transfer(
                        userAddress,
                        tokenAmount
                    );
                    require(result, "Failed transfer while withdrawing");
                } else {
                    tokenAmount -= bonds[i].bondAmount;
                    removeCounter++;
                    bool result = IERC20(bonds[i].tokenAddress).transfer(
                        userAddress,
                        tokenAmount
                    );
                    require(result, "Failed transfer while withdrawing");

                    // removeFromInactiveBond(i, userAddress);

                    //remove inactivebond[i]
                }
            }
        }
       
        for (uint256 i = 0; i < removeCounter; i++) {
            removeFromInactiveBond(i, userAddress);
        }
    }

    //withdraw logic
    function withdraw(address userAddress, uint256 tokenAmount)
        external
        virtual
        override
    {
        uint256 balance = IERC20(poolTokenAddress).balanceOf(userAddress);
        require(balance >= tokenAmount, "Insufficient amount ");

        require(
            getWithdrawableBalance(userAddress) >= tokenAmount,
            "Insufficient withdrawable tokens"
        );
        if (balance == tokenAmount) {
            delete userInfo[userAddress].activeBonds;
            userInfo[userAddress].isLender = false;
            depositInterest(userAddress);
        } else {
            addToInactiveBonds(userAddress);
            deductFromInactiveBonds(userAddress, tokenAmount);
        }

        IPoolToken(poolTokenAddress).burn(userAddress, tokenAmount);
        emit LendEvent(2, userAddress, block.timestamp, tokenAmount);
    }

    function calculateInterest(address userAddress) internal returns (uint256) {
        // uint256 product;
        // EndOfDayBalance[] memory arr = userInfo[userAddress].EODBalanceArray;
        // for (uint256 j = 0; j < arr.length; j++) {
        //     EndOfDayBalance memory a = arr[j];
        //     product += a.amount * a.day;
        // }
        // uint256 interest = (product * rates.lend) / (10**18) / 12;
        // return interest;
        uint256 userInterest;
        BondDetails[] memory bonds = userInfo[userAddress].activeBonds;
        for (uint256 j = 0; j < bonds.length; j++) {
            userInterest += (bonds[j].bondAmount *
                bonds[j].interest *
                bonds[j].day);
            userInfo[userAddress].activeBonds[j].day = 0;
        }
        uint256 interest = ((IERC20(interestTokenAddress).balanceOf(
            userAddress
        ) - nonWithdrawFees) * rates.lend) /
            (10**18) /
            12;
        bonds = userInfo[userAddress].inactiveBonds;
        for (uint256 j = 0; j < bonds.length; j++) {
            userInterest += (bonds[j].bondAmount *
                (rates.lend - nonWithdrawFees) *
                bonds[j].day);
            userInfo[userAddress].activeBonds[j].day = 0;
        }
        userInterest = userInterest / (10**18) / 365;
        return userInterest + interest;
    }

    function addEndOfDayBalance() external override onlyAdmin {
        for (uint256 i = 0; i < addresses.length; i++) {
            if (userInfo[addresses[i]].isLender == true) {
                for (
                    uint256 j = 0;
                    j < userInfo[addresses[i]].activeBonds.length;
                    j++
                ) {
                    userInfo[addresses[i]].activeBonds[j].day += 1;
                }

                for (
                    uint256 j = 0;
                    j < userInfo[addresses[i]].inactiveBonds.length;
                    j++
                ) {
                    userInfo[addresses[i]].inactiveBonds[j].day += 1;
                }
                // uint256 principalAmount = IERC20(poolTokenAddress).balanceOf(
                //     addresses[i]
                // ) + IERC20(interestTokenAddress).balanceOf(addresses[i]);
                // EndOfDayBalance[] memory b = userInfo[addresses[i]]
                //     .EODBalanceArray;
                // if (b.length == 0) {
                //     userInfo[addresses[i]].EODBalanceArray.push(
                //         EndOfDayBalance(principalAmount, 1)
                //     );
                // } else {
                //     uint256 lastElementIndex = b.length - 1;
                //     uint256 latestEntry = b[lastElementIndex].amount;
                //     if (latestEntry == principalAmount) {
                //         userInfo[addresses[i]]
                //             .EODBalanceArray[lastElementIndex]
                //             .day += 1;
                //     } else {
                //         userInfo[addresses[i]].EODBalanceArray.push(
                //             EndOfDayBalance(principalAmount, 1)
                //         );
                //     }
                // }
            }
        }
    }

    function depositInterest(address userAddress) internal {
        uint256 interest = calculateInterest(userAddress);
        // delete userInfo[userAddress].EODBalanceArray;
        IPoolToken(interestTokenAddress).mint(userAddress, interest);
        emit LendEvent(3, userAddress, block.timestamp, interest);
    }

    function depositInterestForAll() external override onlyAdmin {
        for (uint256 i = 0; i < addresses.length; i++) {
            if (userInfo[addresses[i]].isLender == true) {
                depositInterest(addresses[i]);
            }
        }
    }

    function redeemInterestToken(
        address userAddress,
        address requiredTokenAddress,
        uint256 tokenAmount
    ) external {
        require(
            IERC20(interestTokenAddress).balanceOf(userAddress) > 0 &&
                tokenAmount > 0,
            "Insufficient interest tokens to redeem"
        );
        // require(
        //     IERC20(poolTokenAddress).balanceOf(userAddress) > 0,
        //     " Insufficient underlying tokens"
        // );
        IPoolToken(interestTokenAddress).burn(userAddress, tokenAmount);
        bool result = IERC20(requiredTokenAddress).transfer(
            userAddress,
            tokenAmount
        );
        require(result, "Failed to redeem tokens");
    }

    function remove(uint256 index, address userAddress) public {
        userInfo[userAddress].activeBonds[index] = userInfo[userAddress]
            .activeBonds[userInfo[userAddress].activeBonds.length - 1];
        userInfo[userAddress].activeBonds.pop();
    }

    function removeActiveBond(uint256 index, address userAddress) internal {
        if (index == userInfo[userAddress].activeBonds.length - 1) {
            delete userInfo[userAddress].activeBonds;
        } else {
            for (
                uint256 i = index;
                i < userInfo[userAddress].activeBonds.length - 1;
                i++
            ) {
                userInfo[userAddress].activeBonds[i] = userInfo[userAddress]
                    .activeBonds[i + 1];
            }
            userInfo[userAddress].activeBonds.pop();
        }
    }

    function removeFromInactiveBond(uint256 index, address userAddress) public {
        if (index == userInfo[userAddress].inactiveBonds.length - 1) {
            delete userInfo[userAddress].inactiveBonds;
        } else {
           
            for (
                uint256 i = index;
                i < userInfo[userAddress].inactiveBonds.length - 1;
                i++
            ) {
                userInfo[userAddress].inactiveBonds[i] = userInfo[userAddress]
                    .inactiveBonds[i + 1];
            }
            userInfo[userAddress].inactiveBonds.pop();
        }
    }

    //upgrading implementation contract
    function _authorizeUpgrade(address newImplementation)
        internal
        view
        override
    {
        require(msg.sender == factory, "Only factory address allowed");
    }
}
