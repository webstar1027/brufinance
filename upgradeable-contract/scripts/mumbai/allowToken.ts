
import { ethers } from "hardhat";
import fs from 'fs';
import routerArtifact from "../../artifacts/contracts/BruRouter.sol/BruRouter.json";
import poolArtifact from "../../artifacts/contracts/core/BruPool.sol/BruPool.json";
const addresses = JSON.parse(fs.readFileSync('./scripts/mumbai/Address.json').toString())
async function main() {
    const [owner] = await ethers.getSigners()
    const router = await ethers.getContractAt(routerArtifact.abi,'0xD2688226CD29a4047caB48B16Ea8ef08c1F52c95');
    //const usdt = await ethers.getContractAt('USDT',addresses['TOKEN_ADDRESS'])
    
    const proxyPoolAddress = await router.getPoolAddress(0)
    console.log(proxyPoolAddress,"Pool Address")
    const pool = await ethers.getContractAt(poolArtifact.abi,proxyPoolAddress)
    await pool.allowTokenAddress("0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",'cUSD','cUSD')
  
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
