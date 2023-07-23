import { ethers } from "hardhat";
import fs from 'fs';

let addresses = JSON.parse(fs.readFileSync("./scripts/rinkeby/Address.json").toString())
async function main() {
    const mintAmount = '1000000000000000000000000000000000000000000000000000'
    const depositAmount = '3000000000000000000000'

    const [owner] = await ethers.getSigners()
    const token = await ethers.getContractAt("TestToken", addresses["TOKEN_ADDRESS"])
    const factory = await ethers.getContractAt("BruFactory", addresses["FACTORY_ADDRESS"])

    const poolDetails = await factory.getPoolDetails(0);
    console.log(poolDetails)
    let poolToken = await ethers.getContractAt("PoolToken", poolDetails['poolTokenAddress'])
    let interestToken = await ethers.getContractAt("InterestToken", poolDetails['interestTokenAddress'])
    let router = await ethers.getContractAt("BruRouter", addresses["ROUTER_ADDRESS"])
    
    let agripool = await ethers.getContractAt("BruPool", poolDetails.proxyPoolAddress)
    await token.approve(poolDetails.proxyPoolAddress,mintAmount)
    // let bonds = await agripool.getUserActiveBonds(owner.address)
    // // await agripool.changeLockPeriod(180)
    // let lockperios = await agripool.lockPeriod()
    // console.log(lockperios)
    // formatBonds(bonds)
    // await router.withdraw(0,"500",{
    //     gasLimit: 100000,
    //   })
    // let balanceOfToken = await interestToken.balanceOf(owner.address);
    // console.log("Interest amount",ethers.utils.formatEther(balanceOfToken))
}
function formatBonds(bonds: any) {
    for (let i of bonds) {
        console.log("Bond Amount", ethers.utils.formatUnits(i.bondAmount, 18))
        console.log("Interest Rate", ethers.utils.formatUnits(i.interest, 18))
        console.log("Bond timestamp",new Date(i.bondTimestamp*1000))
    }
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});