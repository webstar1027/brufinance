const { ethers, waffle, network} = require("hardhat");
const { expect } = require("chai");

describe('Token testing', function () {
  let nftContract;
  
  describe("Deployment", function () {
    it("Should have the correct owner", async function () {
        const [owner] = await ethers.getSigners();  
    })

    it("MyDiamondTeamFrok deploy", async function () {
        const [owner] = await ethers.getSigners();  
        nftContract = await ethers.getContractFactory('MyDiamondTeamFrok');
        nftContract = await nftContract.deploy();
        await nftContract.deployed();
        console.log("MyDiamondTeamFrok contract address:", nftContract.address);
    })
 })
});