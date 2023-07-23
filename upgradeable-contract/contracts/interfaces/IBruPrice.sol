//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;
struct Asset {
    string id;
    uint256 price;
}

interface IBruPrice {

    function updatePrice(string memory id, uint256 price) external;

    function updatePrices(string[] memory ids, uint256[] memory prices)
        external;
}
