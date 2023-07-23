//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;

struct BorrowDetails {
    uint256 borrowedAmount;
    uint256 time;
}

interface IBruPool {
    event LendEvent(
        int8 _type,
        address indexed userAddress,
        uint256 indexed timestamp,
        uint256 tokenAmount
    );

    event BorrowEvent(
        int8 _type,
        address indexed userAddress,
        uint256 indexed timestamp,
        uint256 tokenAmount
    );

    event RepayEvent(
        int8 _type,
        address indexed userAddress,
        uint256 indexed timestamp,
        uint256 tokenAmount
    );

    function name() external returns (string memory);

    // function borrowedNft(string memory) external returns(BorrowDetails memory);

    function initialize(
        address adminAddress,
        address factoryAddress,
        address poolTokenAddress,
        address interestTokenAddress,
        address treasuyAddress,
       
        string memory poolName
    ) external;

    //     //Admin functionalties

    //Minting functionlaities
    function mintNft(
        uint256 tokenId,
        string memory nftId,
        string memory commodityId,
        uint256 quantity,
        uint256 nftValue,
        string memory dataHash,
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

    function deposit(
        address userAddress,
        address tokenAddress,
        uint256 tokenAmount
    ) external;

    function transferBond(
        address from,
        address to,
        uint256 amount
    ) external;

    function withdraw(address userAddress, uint256 tokenAmount) external;


    //Lending admin external functions
    function addEndOfDayBalance() external;

    function depositInterestForAll() external;
}
