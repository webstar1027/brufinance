const hardhat = require("hardhat");

async function main() {
  // We get the contract to deploy
  const Greeter = await ethers.getContractFactory("Comptroller");
  const greeter = await Greeter.deploy();
  await greeter.deployed();
  // await hardhat.hre.run(`verify ${greeter.address}`, { network: 'mumbai' });
  console.log("Greeter deployed to:", greeter.address);

  const Greeter1 = await ethers.getContractFactory("Comptroller");
  const greeter1 = await Greeter1.deploy();
  await greeter1.deployed();
  console.log("Greeter deployed to:", greeter1.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });