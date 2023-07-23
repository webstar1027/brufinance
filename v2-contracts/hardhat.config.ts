import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-web3"
import "dotenv/config"

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  
  solidity: {
    blockGasLimit: 0x1fffffffffffff,
    version:"0.8.7",
    allowUnlimitedContractSize:true,
    settings:{
      allowUnlimitedContractSize:true,
      optimizer: {
        enabled: true,
        runs: 200
      },
      blockGasLimit: 0x1fffffffffffff,
     
    }
  },
  networks:{
    allowUnlimitedContractSize:true,
    ganache:{
      url:'HTTP://127.0.0.1:7545'
    },
    mumbai: {
      url: "https://matic-mumbai.chainstacklabs.com",
      accounts: [process.env.PRIVATE_KEY],
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize:true

    }
  }
};
