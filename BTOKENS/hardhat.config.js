/*
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-waffle")
require("hardhat-typechain");
require("@nomiclabs/hardhat-etherscan");
const secret = require("./secret.js")

module.exports = {
    defaultNetwork: "matic", 
    solidity: {
        compilers: [{ version: "0.8.0", settings: {optimizer : { enabled: true, runs: 1}} }],
    },
    etherscan: {
        apiKey: 'ZJPGT4IXI35YXJ8DGF8AUV9HQHESYYEA2D'
    },
    networks: {
      hardhat: {
      },
      matic: {
        url: `https://rpc-mumbai.maticvigil.com/`,
        accounts: [secret.privateKey]
      },
    }
};
