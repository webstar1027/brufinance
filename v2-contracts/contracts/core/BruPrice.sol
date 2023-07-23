// //SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8;

// import "./../interfaces/IBruPrice.sol";

// contract BruPrice is IBruPrice {
//     address admin;
    

//     mapping( string => Asset) public override asset;

//     constructor(){
//         admin= msg.sender;
//     }

//     function updatePrice( string memory id, uint price ) external override{
//         require(admin == msg.sender);
//         asset[id] = Asset(id,price);
//     }

//     function updatePrices(string[] memory ids, uint[] memory prices) external override {
//         require(admin == msg.sender);
//         require(ids.length == prices.length,"Length of the array sould be same");
//         for (uint i=0; i< ids.length; i++){
//             asset[ids[i]] = Asset(ids[i],prices[i]);

//         }
//     }
// }
