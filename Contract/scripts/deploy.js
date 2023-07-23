const { parseEther } = require('ethers/lib/utils');
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  nftContract = await ethers.getContractFactory('MyDiamondTeamFrok');
  nftContract = await nftContract.deploy();
  await nftContract.deployed();
  console.log("MyDiamondTeamFrok contract address:", nftContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });