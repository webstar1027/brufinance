
import { ethers } from "hardhat";
import fs from 'fs';

const addresses = JSON.parse(fs.readFileSync('./scripts/mumbai-prod/Address.json').toString())

async function main() {
    const [owner] = await ethers.getSigners()
    const factory = await ethers.getContractAt('BruFactory',addresses['FACTORY_ADDRESS'])
    const usdt = await ethers.getContractAt('USDT',addresses['TOKEN_ADDRESS'])
    
    const proxyPoolAddress = await factory.getPoolAddress(0)
    const pool = await ethers.getContractAt("BruPool",proxyPoolAddress)
    await pool.allowTokenAddress(usdt.address,'bUSDT','bUSDT')
  
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
