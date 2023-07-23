import { ethers } from "hardhat";
import fs from 'fs';

let addresses = JSON.parse(fs.readFileSync("./scripts/rinkeby/Address.json").toString())
async function main(){
    const [owner, addr1, addr2] = await ethers.getSigners()
    const token = await ethers.getContractAt("TestToken", addresses["TOKEN_ADDRESS"])
    const factory = await ethers.getContractAt("BruFactory", addresses["FACTORY_ADDRESS"])
    const stakePool = await ethers.getContractFactory('StakePool')
    let pool = await stakePool.deploy(factory.address,factory.address,factory.address);
    await pool.deployed();
    await pool.startLiquidityMiningInterval(0,7);
    await pool.updateLendAmountInInterval(0,1,owner.address,1250)
    await pool.updateLendAmountInInterval(0,1,addr1.address,1250)
    await pool.updateLendAmountInInterval(0,1,addr2.address,1250)
    await pool.updateLendAmountInInterval(0,1,addr1.address,1250)
    let interval = await pool.getLatestIntervalForPool(0)
    console.log(interval)
    await pool.endLiquidityMiningInterval(0);

    // await pool.updateLendAmountInInterval(
    //     0,
    //     1,
    //     owner.address,
        
    // ) 

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});