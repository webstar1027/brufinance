import { ethers } from "hardhat";
import fs from 'fs';

let addresses = JSON.parse(fs.readFileSync("./scripts/rinkeby/Address.json").toString())
async function main() {
    const [owner] = await ethers.getSigners()
    console.log(addresses["FACTORY_ADDRESS"])
    // break from here
    const token = await ethers.getContractAt("TestToken",addresses["TOKEN_ADDRESS"])
    const factory = await ethers.getContractAt("BruFactory",addresses["FACTORY_ADDRESS"])
    
    const poolDetails = await factory.getPoolDetails(0);
    console.log(poolDetails)
    let poolToken = await ethers.getContractAt("PoolToken",poolDetails['poolTokenAddress'])
    let interestToken = await ethers.getContractAt("InterestToken",poolDetails['interestTokenAddress'])
    let Router = await ethers.getContractFactory("BruRouter")

    await poolToken.setPoolAddress(poolDetails.proxyPoolAddress)
    await interestToken.setPoolAddress(poolDetails.proxyPoolAddress)
    const router = await Router.deploy(addresses["FACTORY_ADDRESS"])
    await router.deployed()

    addresses["ROUTER_ADDRESS"]  = router.address
    save(addresses)
    let agripool = await ethers.getContractAt("BruPool", poolDetails.proxyPoolAddress)
    await agripool.allowTokenAddress(token.address)
    // await usdt.approve(poolDetails.proxyPoolAddress, mintAmount)
    // console.log("Depositing 3000 tokens")
    // await router.deposit(0, usdt.address, 0, depositAmount)
    // console.log("Depositing another set of 3000 tokens")
    // await agripool.changeStableInterestRate(100);
    // await agripool.addLockPeriod(172800);
    // await router.deposit(0, usdt.address, 0, transferAmount)
    // let poolTokenBalance = await poolToken.balanceOf(owner.address)
    // console.log("Pool token Balance", ethers.utils.formatEther(poolTokenBalance))
    
    // console.log(addresses)
    // await agripool.addEndOfDayBalance();
    // console.log("Depositing interest after one day")
    // await agripool.depositInterestForAll();
    // let balanceOfToken = await interestToken.balanceOf(owner.address);
    // console.log("Interest amount",ethers.utils.formatEther(balanceOfToken))
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
function save(addresses: Object) {
    fs.writeFileSync('./scripts/rinkeby/Address.json', JSON.stringify(addresses, null, '\t'))
}

