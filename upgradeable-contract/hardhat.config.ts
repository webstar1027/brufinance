import * as dotenv from "dotenv";
// import * as utility from "hardhat-web3-utility";

import { HardhatUserConfig, task, } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-web3";

import "hardhat-gas-reporter";
import "solidity-coverage";
import '@openzeppelin/hardhat-upgrades';
import 'hardhat-contract-sizer';

// utility.config();
dotenv.config();

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

const config: HardhatUserConfig = {
  solidity: {

    version: "0.8.7",
    settings: {
      
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      //  blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
    },
    ropsten: {
      // blockGasLimit: 0x1fffffffffffff,
      // allowUnlimitedContractSize:true,
      url: process.env.ROPSTEN_URL || "",
      allowUnlimitedContractSize: true,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY, "2d97d83236bd4a4b77093bf6eb73d5707786768ace7de2eae0a69ec79d70102d"] : []
      // mumbai: {
      //   url: "https://matic-mumbai.chainstacklabs.com",
      //   //accounts:process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY,process.env.PRIVATE_KEY1] : [],
      // },
    },
    mumbai: {
      url: "https://matic-mumbai.chainstacklabs.com",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gas: 8000000,
      gasPrice: 30000000000
    },
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/11f0a36ad46a4fbd9f9ddaa16d9534d2",
      // gas: 2100000,
      // gasPrice: 8000000000,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    },
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : []
    }

  }, 
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
    // only: [':ERC20$'],
  }
  // gasReporter: {
  //   enabled: process.env.REPORT_GAS !== undefined,
  //   currency: "USD",
  // },
  // etherscan: {
  //   apiKey: process.env.ETHERSCAN_API_KEY,
  // },
};

export default config;
