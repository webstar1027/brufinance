import { ethers } from "hardhat";
import fs from 'fs';

let addresses = JSON.parse(fs.readFileSync("./scripts/rinkeby/Address.json").toString())
async function main() {
    const mintAmount = '100000000000000000000000'
    const depositAmount = '3000000000000000000000'
    const accounts = await ethers.getSigners();
    const deployer = accounts[0];
    const token = await ethers.getContractAt("TestToken", addresses["TOKEN_ADDRESS"])
    const factory = await ethers.getContractAt("BruFactory", addresses["FACTORY_ADDRESS"])

    const poolDetails = await factory.getPoolDetails(0);
    console.log(poolDetails)
    let poolToken = await ethers.getContractAt("PoolToken", poolDetails['poolTokenAddress'])
    let interestToken = await ethers.getContractAt("InterestToken", poolDetails['interestTokenAddress'])
    let router = await ethers.getContractAt("BruRouter", addresses["ROUTER_ADDRESS"])

    let agripool = await ethers.getContractAt("BruPool", poolDetails.proxyPoolAddress)
    await agripool.changeLockPeriod(180)
    let lockperiod = await agripool.lockPeriod();
    console.log(lockperiod);
    let fees = await agripool.platformFees()
    console.log("platform feees",fees)
    
    await token.approve(poolDetails.proxyPoolAddress, mintAmount);
   console.log("Depositing 3000 tokens first time")
   await agripool.allowTokenAddress(token.address)
//    let minttx = token.mint(poolDetails.proxyPoolAddress,"10000000000000000000000");
    // let balance = await token.balanceOf(poolDetails.proxyPoolAddress);
    // console.log("usdt balance",balance);
    
    await router.deposit(0, token.address, depositAmount)
    // console.log("Depositing 3000 tokens second time")

    // await router.deposit(0, token.address, depositAmount)
//     let poolTokenBalance = await poolToken.balanceOf(deployer.address)
//     console.log("Bru Bond balance before withdrawal ", ethers.utils.formatUnits(poolTokenBalance, 18))
//     let bonds = await agripool.getUserActiveBonds(deployer.address)
//     console.log("----------------Bond Array before withdrawal-----------------",)
//     formatBonds(bonds)
//   //  let deployerNonce = await ethers.provider.getTransactionCount(deployer.address);
//     await router.withdraw(0,"30000000000", {
//         // gasPrice: 20000000000,
//         // gasLimit: 400000,
//         //nonce:deployerNonce
//     })
    // poolTokenBalance = await poolToken.balanceOf(deployer.address)
    // console.log("Bru Bond balance after withdrawal ", ethers.utils.formatUnits(poolTokenBalance, 18))
    // let inactiveBonds = await agripool.getUserInactiveBonds(deployer.address)
    // console.log("----------------------Bond Array after withdrawal -----------------------")
    // formatBonds(inactiveBonds);
    // // await agripool.allowTokenAddress(token.address)
    // await token.approve(poolDetails.proxyPoolAddress, mintAmount)
    // console.log("Depositing 3000 tokens")
    // await router.deposit(0, token.address, 0, depositAmount)
    // console.log("Depositing another set of 3000 tokens")
    // await agripool.changeStableInterestRate(100);
    // await agripool.addLockPeriod(172800);
    // await router.deposit(0, token.address, 0, depositAmount)
    // let poolTokenBalance = await poolToken.balanceOf(owner.address)
    // console.log("Pool token Balance", ethers.utils.formatEther(poolTokenBalance))
    // let bonds = await agripool.getUserActiveBonds(owner.address)
    // formatBonds(bonds)
    // console.log(addresses)
    // await agripool.addEndOfDayBalance();
    // console.log("Depositing interest after one day")
    // await agripool.depositInterestForAll();
    // let balanceOfToken = await interestToken.balanceOf(owner.address);
    // console.log("Interest amount",ethers.utils.formatEther(balanceOfToken))
}
function formatBonds(bonds: any) {
    for (let i of bonds) {
        console.log("Bond Amount", ethers.utils.formatUnits(i.bondAmount, 18))
        console.log("Interest Rate", ethers.utils.formatUnits(i.interest, 18))
    }
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


