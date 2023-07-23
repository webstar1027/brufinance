//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import "prb-math/contracts/PRBMathUD60x18.sol";

import "./../interfaces/IBruPool.sol";
// import "./../interfaces/IBruPrice.sol";

contract BruPool is IBruPool, ERC1155 {
    //for handling floating point artihmetics
    using PRBMathUD60x18 for uint256;

    //for handling ID of btoken and nft
    uint256 tokenIdCounter;
    uint256 nftIdCounter = 101;

    //addresses
    address factory;
    address admin;
    address priceFeedAddress;

    // name of the pool
    string public override name;

    //variables for enabling/disabling functionality
    bool allowTransfer;
    bool allowBorrow;
    bool initialized;

    //variable used to divide time difference by (1 = 1 sec, 1hour = 3600, 1 day = 86400)
    uint public interval = 1;
    //determines the lock period
    uint public lockPeriod = 180; //3mins

    //Rate variables
    uint256 public STABLE_RATE = uint256(65).div(1000);
    uint256 VARIABLE_RATE;
    uint256 public BORROW_RATE = uint256(100).div(1000);
    uint256 public PLATFORM_FEES_RATE = uint256(1).div(10000);

    uint256 TOTAL_DEBT;
    uint256 public override BORROWING_LIMIT_PERCENTAGE = 600000000000000000;

    //Array for storing addresses of users.
    address[] addresses;

    //Array of tokens which can be used in this pool
    address[] tokenAddresses;

    //Storing nftIds of nfts which are borrowed
    string[] borrowedNftArray;

    // mapping which stores nft data
    mapping(string => NFT) public nft;

    //mapping for storing borrow details of NFT
    mapping(string => BorrowDetails) public borrowedNft;

    //mapping for storing expenses
    mapping(address => uint256[]) expenses;

    //Mapping for maintaing addresses of stablecoins allowed by the admin
    mapping(address => bool) allowedTokenAddresses;

    //mapping for storing amount supplied by the user across different token addresses
    mapping(address => mapping(address => uint256)) public lentAmount;

    //Mapping for maintaining addresses of stablecoins with indexes of ERC1155 Token ID
    mapping(address => uint256) token;


    //
    mapping(address => mapping(address => DepositDetails[])) depositDetails;
    // Balance that can be withdrawed by the user || tokenAddress -> userAddress -> amount
    mapping(address => mapping(address=>uint)) public withdrawableBalance;

    //Mapping to determine if user has any deposit with us
    mapping(address => bool) user;

    //bToken metadata

    mapping(uint256 => Token) bTokenMetaData;

    mapping(address => uint256) public timelock;

    //Mapping which stores end of day balance of the user
    mapping(address => EndOfDayBalance[]) EODBalanceArray;

    //Other expenses mapping
    mapping(string => Expenses) public totalExpense;

    //Struct used for storing NFT Data
    struct NFT {
        uint256 tokenId;
        string commodityId;
        uint256 quantity;
        uint256 value;
        bool borrowed;
        string data;
    }

    struct Token {
        string name;
        string symbol;
    }

    //Struct used in borrow

    //Struct used in Lending
    struct EndOfDayBalance {
        uint256 amount;
        uint256 day;
    }
    //Struct for other expenses

    struct Expenses {
        uint256 otherexpenses;
        uint256 interest;
    }

    struct DepositDetails{
        uint amount;
        uint time;
    }

    //modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Can be used only by admin");
        _;
    }

    modifier onlyAllowedTokens(address tokenAddress) {
        require(
            allowedTokenAddresses[tokenAddress] == true,
            "Token address should be allowed by the admin"
        );
        _;
    }

    // constructor of the Pool
    constructor() ERC1155("") {
        factory = msg.sender;
    }

    // used by the factory contract as soon as Pool is deployed
    function initialize(
        address adminAddress,
        address _priceFeedAddress,
        string memory poolName
    ) external override {
        require(msg.sender == factory, "Only Factory contract use this");
        admin = adminAddress;
        priceFeedAddress = _priceFeedAddress;
        name = poolName;
    }

    //Admin only functons

    function allowTokenAddress(
        address tokenAddress,
        string memory tokenName,
        string memory tokenSymbol
    ) external override onlyAdmin {
        require(
            allowedTokenAddresses[tokenAddress] == false,
            "Already allowed by admin"
        );
        allowedTokenAddresses[tokenAddress] = true;
        token[tokenAddress] = tokenIdCounter;
        bTokenMetaData[tokenIdCounter] = Token(tokenName, tokenSymbol);
        tokenAddresses.push(tokenAddress);
        unchecked {
            tokenIdCounter += 1;
        }
    }

    function changeTokenName(
        address tokenAddress,
        string memory tokenName,
        string memory tokenSymbol
    ) external override onlyAdmin {
        require(
            allowedTokenAddresses[tokenAddress] == true,
            "Token Address not supported by the pool"
        );
        bTokenMetaData[token[tokenAddress]] = Token(tokenName, tokenSymbol);
    }

    function getBTokenName(address tokenAddress)
        external
        view
        returns (Token memory)
    {
        return bTokenMetaData[token[tokenAddress]];
    }

    function changeStableInterestRate(uint256 _interestRate)
        external
        override
        onlyAdmin
    {
        STABLE_RATE = _interestRate.div(1000);
    }

    function changeVariableInterestRate(uint256 _interestRate)
        external
        override
        onlyAdmin
    {
        VARIABLE_RATE = _interestRate.div(1000);
    }

    function changeBorrowInterestRate(uint256 _interestRate)
        external
        override
        onlyAdmin
    {
        BORROW_RATE = _interestRate.div(1000);
    }

    function changePlatformFeesRate(uint256 _interestRate)
        external
        override
        onlyAdmin
    {
        PLATFORM_FEES_RATE = _interestRate.div(10000);
    }

    function changeInterval(uint time) external onlyAdmin{
        require(lockPeriod > 0);
        interval = time;
    }

    function changeLockPeriod(uint day) external onlyAdmin{
        require(lockPeriod > 0);
        lockPeriod = day;
    }

    function changeBorrowingLimit(uint256 percent) external override onlyAdmin {
        BORROWING_LIMIT_PERCENTAGE = percent.div(1000);
    }

    function enableBorrowing() external override onlyAdmin {
        allowBorrow = true;
    }

    function disableBorrowing() external override onlyAdmin {
        allowBorrow = false;
    }

    function enableTransferOfBTokens() external override onlyAdmin {
        allowTransfer = true;
    }

    function disableTransferOfBTokens() external override onlyAdmin {
        allowTransfer = false;
    }

    //

    // function addExpense(string memory nftId,uint256 amount) internal override onlyAdmin{
    //         totalExpense[nftId]+=amount;
    // }

    //overridden methods
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override(IBruPool, ERC1155) {
        require(allowTransfer == true, "Transfer of Btokens disabled");
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public override(IBruPool, ERC1155) {
        require(allowTransfer == true, "Transfer of Btokens disabled");
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function balanceOfLPToken(address userAddress, address tokenAddress)
        public
        view
        returns (uint256)
    {
        return balanceOf(userAddress, token[tokenAddress]);
    }

    // Borrow Functionalities

    function mintNft(
        address userAddress,
        string memory nftId,
        string memory commodityId,
        uint256 quantity,
        uint256 nftValue,
        string memory data
    ) external override onlyAdmin {
        uint256 tokenId = nftIdCounter;
        _mint(userAddress, tokenId, 1, "");
        nft[nftId] = NFT(tokenId, commodityId, quantity, nftValue, false, data);
        unchecked {
            nftIdCounter += 1;
        }
    }

    // function evaluateCurrentvalueOfAsset() external {
    //     for(uint i = 0; i< borrowedNftArray.length;i++){
    //         string memory commodityId = nft[borrowedNftArray[i]].commodityId;
    //         uint price = IBruPrice(priceAddress).asset(commodityId).price;
    //     }
    // }

    //borrow functionality

    function borrow(
        address userAddress,
        string memory nftId,
        address tokenAddress,
        uint256 tokenAmount
    ) external override {
        require(
            balanceOf(userAddress, nft[nftId].tokenId) == 1,
            "NFT is not owned by this address"
        );
        require(nft[nftId].borrowed == false, "Alreay borrowed on this NFT");
        require(
            IERC20(tokenAddress).balanceOf(address(this)) > tokenAmount,
            "Pool does not have enough lqiuidity"
        );
        require(
            tokenAmount <= (nft[nftId].value * 7) / 10,
            "Collateral provided is less for specified token amount"
        );
        IERC20(tokenAddress).transfer(userAddress, tokenAmount);
        nft[nftId].borrowed = true;
        borrowedNft[nftId] = BorrowDetails(tokenAmount, block.timestamp);
    }

    function repay(
        address userAddress,
        string memory nftId,
        uint256 tokenAmount,
        address tokenAddress
    ) external override {
        require(
            balanceOf(userAddress, nft[nftId].tokenId) == 1,
            "NFT is not owned by this address"
        );
        borrowInterest(nftId);
        uint256 platformFees = (tokenAmount * PLATFORM_FEES_RATE) / 10**18;
        uint256 totalPayablePrice = borrowedNft[nftId].borrowedAmount +
            platformFees +
            totalExpense[nftId].interest;
        require(nft[nftId].borrowed == true, "This NFT cannot be repaid for");
        require(
            tokenAmount <= totalPayablePrice,
            "Amount given greater than borrowed amount"
        );
        require(
            IERC20(tokenAddress).balanceOf(userAddress) >= platformFees,
            "Token balance should be atleast be greater than deposit amount "
        );

        IERC20(tokenAddress).transferFrom(
            userAddress,
            address(this),
            tokenAmount
        );
        

        //tokenAmount-=totalExpense[nftId];
        tokenAmount -= platformFees;
        if (tokenAmount >= totalExpense[nftId].interest) {
            tokenAmount -= totalExpense[nftId].interest;
            totalExpense[nftId].interest = 0;
            borrowedNft[nftId].borrowedAmount -= tokenAmount;
        } else {
            totalExpense[nftId].interest -= tokenAmount;
        }
        borrowedNft[nftId].time = block.timestamp;
        if (borrowedNft[nftId].borrowedAmount == 0) {
                
                nft[nftId].borrowed = false;
                borrowedNft[nftId] = BorrowDetails(0, 0);
            
        }
    }

    function borrowInterest(string memory nftId) public returns(uint) {
        uint256 borrowedDays = (block.timestamp - borrowedNft[nftId].time) /
            86400;
        totalExpense[nftId].interest =
            (borrowedNft[nftId].borrowedAmount * 10 * borrowedDays) /
            (365);
            return totalExpense[nftId].interest;
    }

    // Lend Functionalities
    // deposit logic
    function deposit(
        address userAddress,
        address tokenAddress,
        uint256 tokenAmount
    ) external override {
        require(
            allowedTokenAddresses[tokenAddress] == true,
            "Token Address not supported by the pool"
        );
        require(tokenAmount > 0, "Amount should be greater than zero");
        require(
            IERC20(tokenAddress).balanceOf(userAddress) >= tokenAmount,
            "Token balance should be atleast be greater than deposit amount "
        );
        uint256 platformFees = (tokenAmount * PLATFORM_FEES_RATE) / 10**18;
        require(
            IERC20(tokenAddress).balanceOf(userAddress) >= platformFees,
            "Token Amount ahould be greater than platform fees "
        );

        tokenAmount -= platformFees;

        if (user[userAddress] == false) {
            user[userAddress] = true;
            addresses.push(userAddress);

        }
        IERC20(tokenAddress).transferFrom(
            userAddress,
            address(this),
            tokenAmount
        );
       
        _mint(userAddress, token[tokenAddress], tokenAmount, "");
        
        depositDetails[tokenAddress][userAddress].push(DepositDetails(tokenAmount,block.timestamp));
        lentAmount[tokenAddress][userAddress] += tokenAmount;

        emit AmountChange(
            1,
            userAddress,
            tokenAddress,
            block.timestamp,
            tokenAmount
        );
    }
    function checkLock() external onlyAdmin{
        for (uint i = 0;i < tokenAddresses.length; i++){
            for(uint j = 0; j< addresses.length;j++){
                address currentTokenAddress = tokenAddresses[i];
                address currentUserAddress = addresses[j];
                DepositDetails[] memory  arr = depositDetails[currentTokenAddress][currentUserAddress];
                for (uint k = 0; k< arr.length; k++){
                    if(withdrawableNew(arr[k].time) == true){
                        withdrawableBalance[currentTokenAddress][currentUserAddress] += arr[k].amount;
                        delete depositDetails[currentTokenAddress][currentUserAddress][k];

                    }
                }
            }
        }
    }

    function withdrawableNew(uint time) internal view returns (bool) {
        uint256 currentTime = block.timestamp;
        uint256 depositedTime = time;
        uint256 timePassedFromDeposit = currentTime - depositedTime;
        if (timePassedFromDeposit / interval >= lockPeriod) {
            return true;
        } else {
            return false;
        }
    }
    function withdrawable(address userAddress) internal view returns (bool) {
        uint256 currentTime = block.timestamp;
        uint256 depositedTime = timelock[userAddress];
        uint256 timePassedFromDeposit = currentTime - depositedTime;
        if (timePassedFromDeposit / 86400 >= lockPeriod) {
            return true;
        } else {
            return false;
        }
    }

    //withdraw logic
    function withdraw(
        address userAddress,
        address tokenAddress,
        uint256 tokenAmount
    ) external override {
        require(
            allowedTokenAddresses[tokenAddress] == true,
            "Token Address not supported by the pool"
        );
        require(
            withdrawable(userAddress) == true,
            "Can only be withdrawed after certain time"
        );
        require(
            balanceOf(userAddress, token[tokenAddress]) >= tokenAmount,
            "Insufficient amount of tokens to withdraw"
        );
        require(
            IERC20(tokenAddress).balanceOf(address(this)) >= tokenAmount,
            " Less liquidity avaialble in the pool. Try again later "
        );
        require(tokenAmount <= withdrawableBalance[tokenAddress][userAddress],"token amount ahould be less than withdrawable amount");
        //if withdrawing all amount
        if (tokenAmount == balanceOf(userAddress, token[tokenAddress])) {
            uint256 interest = calculateInterest(userAddress);
            require(
                IERC20(tokenAddress).balanceOf(address(this)) >=
                    tokenAmount + interest,
                "Less liquidity avaialble in the pool"
            );
            IERC20(tokenAddress).transfer(userAddress, tokenAmount + interest);
            withdrawableBalance[tokenAddress][userAddress] = 0;
        } else {
            IERC20(tokenAddress).transfer(userAddress, tokenAmount);
            withdrawableBalance[tokenAddress][userAddress] -= tokenAmount;
        }

        _burn(userAddress, token[tokenAddress], tokenAmount);
        lentAmount[tokenAddress][userAddress] -= tokenAmount;

        emit AmountChange(
            2,
            userAddress,
            tokenAddress,
            block.timestamp,
            tokenAmount
        );
    }

    function calculateInterest(address userAddress)
        public
        view
        override
        returns (uint256)
    {
        uint256 product;
        for (uint256 j = 0; j < EODBalanceArray[userAddress].length; j++) {
            EndOfDayBalance memory a = EODBalanceArray[userAddress][j];
            product += a.amount * a.day;
        }
        uint256 interest = (product * STABLE_RATE) / (365 * 10**18);
        return interest;
    }

    function addEndOfDayBalance(address tokenAddress)
        external
        override
        onlyAdmin
    {
        for (uint256 i = 0; i < addresses.length; i++) {
            uint256 principalAmount = balanceOf(
                addresses[i],
                token[tokenAddress]
            );
            EndOfDayBalance[] memory b = EODBalanceArray[addresses[i]];
            if (b.length == 0) {
                EODBalanceArray[addresses[i]].push(
                    EndOfDayBalance(principalAmount, 1)
                );
            } else {
                uint256 lastElementIndex = b.length - 1;
                uint256 latestEntry = b[lastElementIndex].amount;
                if (latestEntry == principalAmount) {
                    EODBalanceArray[addresses[i]][lastElementIndex].day += 1;
                } else {
                    EODBalanceArray[addresses[i]].push(
                        EndOfDayBalance(principalAmount, 1)
                    );
                }
            }
        }
    }

    function depositInterest(address tokenAddress) external override onlyAdmin {
        for (uint256 i = 0; i < addresses.length; i++) {
            address userAddress = addresses[i];
            uint256 interest = calculateInterest(userAddress);
            _mint(addresses[i], token[tokenAddress], interest, "");
            emit AmountChange(
                3,
                userAddress,
                tokenAddress,
                block.timestamp,
                interest
            );
        }
    }
}
