const hardhat = require("hardhat");

async function main() {
  // We get the contract to deploy
  const Greeter = await ethers.getContractFactory("Comptroller");
  const greeter = await Greeter.deploy();
  await greeter.deployed();
  // await hardhat.hre.run(`verify ${greeter.address}`, { network: 'mumbai' });
  console.log("Comptroller deployed to:", greeter.address);

  const Greeter1 = await ethers.getContractFactory("InterestRateModel");
  const greeter1 = await Greeter1.deploy(0xf14039de, 0x8726bb89);
  await greeter1.deployed();
  console.log("InterestRateModel deployed to:", greeter1.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });