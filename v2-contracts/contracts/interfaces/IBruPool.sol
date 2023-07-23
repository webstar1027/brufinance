//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;
struct BorrowDetails {
        uint256 borrowedAmount;
        uint256 time;
    }

interface IBruPool {
    //events

    event AmountChange(
        int8 _type,
        address indexed userAddress,
        address indexed tokenAddress,
        uint256 indexed timestamp,
        uint256 tokenAmount
    );

    event Threshold(string nftId, address userAddress);

    event Liquidation(string nftid, address userAddress);

    //public variables
    function name() external returns (string memory);

    function BORROWING_LIMIT_PERCENTAGE() external returns (uint256);

    // function borrowedNft(string memory) external returns(BorrowDetails memory);

    function initialize(address adminAddress,address _priceFeedAddress, string memory poolName) external;

    //Admin functionalties
    function allowTokenAddress(address tokenAddress,string memory tokenName,string memory tokenSymbol) external;
    function changeTokenName(address tokenAddress,string memory tokenName,string memory tokenSymbol) external;

    function changeStableInterestRate(uint256 _interestRate) external;

    function changeVariableInterestRate(uint256 _interestRate) external;

    function changePlatformFeesRate(uint256 _interestRate) external;

    function changeBorrowInterestRate(uint256 _interestRate) external;

    function changeBorrowingLimit(uint256 percent) external;

    function enableBorrowing() external;

    function disableBorrowing() external;

    function enableTransferOfBTokens() external;

    function disableTransferOfBTokens() external;

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) external;

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) external;

    //Minting functionlaities
    function mintNft(
        address userAddress,
        string memory nftId,
        string memory commodityId,
        uint quantity,
        uint256 nftValue,
        string memory nftData
    ) external;

    // Borrow functions
    function borrow(
        address userAddress,
        string memory nftId,
        address tokenAddress,
        uint256 tokenAmount
    ) external;

    function repay(
        address userAddress,
        string memory nftId,
        uint256 tokenAmount,
        address tokenAddress
    ) external;
    // lending functions
    function deposit(
        address userAddress,
        address tokenAddress,
        uint256 tokenAmount
    ) external;

    function withdraw(
        address userAddress,
        address tokenAddress,
        uint256 tokenAmount
    ) external;

    function calculateInterest(address userAddress)
        external
        view
        returns (uint256);

    //Lending admin external functions
    function addEndOfDayBalance(address tokenAddress) external;

    function depositInterest(address tokenAddress) external;
}
