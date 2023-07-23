const hardhat = require("hardhat");

async function main() {
  // We get the contract to deploy
  // const Greeter = await ethers.getContractFactory("Comptroller");
  // const greeter = await Greeter.deploy(0x1E3B58E0624700, 0x10EFAA0B247880);

  const Greeter = await ethers.getContractFactory("BToken");
  const greeter = await Greeter.deploy('0x19f6566059da86690Ab62b581A058ba24E4f1fa4',
                                        '0x1585b2287d5AAb4f87F4a0afd00F61795aa2010c',
                                        2000000000000000000n,
                                        "BRUTOKEN",
                                        "BRU", 
                                        18);

  // await hardhat.hre.run(`verify ${greeter.address}`, { network: 'mumbai' });

  console.log("Greeter deployed to:", greeter.address);
  console.log(greeter.functions.redeemInternal)
  greeter.functions.redeemInternal(3000000000000000n).then((err, res)=>{
    console.log(res);
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });