import { ethers } from "hardhat";
import fs from 'fs';

const addresses = JSON.parse(fs.readFileSync('./scripts/rinkeby/Address.json').toString())

async function main() {
    const [owner] = await ethers.getSigners()
    const factory = await ethers.getContractAt('BruFactory', addresses['FACTORY_ADDRESS'])
    let poolDetails = await factory.getPoolDetails(0)
    console.log(poolDetails,"Pool details")
    let bondToken = await ethers.getContractAt("PoolToken",poolDetails.poolTokenAddress)
    let name = await bondToken.name()
    let symbol = await bondToken.symbol()
    console.log("bond name",name)
    console.log("bond symbol",symbol)

}




main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});