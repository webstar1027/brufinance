import { ethers } from "hardhat";
import fs from 'fs';

async function main() {
    const mintAmount = '100000000000000000000000'
    const [owner] = await ethers.getSigners()
    // const accounts = await ethers.getSigners();
    // const deployer = accounts[0];

    const USDT = await ethers.getContractFactory("TestToken")
    const BruProxyFactory = await ethers.getContractFactory("BruProxy")
    const BruProxyPool = await ethers.getContractFactory("BruProxy")

    const Factory = await ethers.getContractFactory("BruFactory")
    const Router = await ethers.getContractFactory("BruRouter")
    let Pool = await ethers.getContractFactory("BruPool")
    let Treasury = await ethers.getContractFactory('AssetTreasury')
    let PoolToken = await ethers.getContractFactory('PoolToken')
    let InterestToken = await ethers.getContractFactory("InterestToken")

    // let treasury = await Treasury.deploy()
    // await treasury.deployed()

    let poolToken = await PoolToken.deploy("BruBonds - IndiaAgro", "BruBonds - IndiaAgro");
    await poolToken.deployed()

    let interestToken = await InterestToken.deploy("InterestToken - IndiaAgro", "InterestToken - IndiaAgro")
    await interestToken.deployed()

    console.log(poolToken.address)
    // console.log(interestToken.address)

    const usdt = await USDT.deploy(mintAmount)
    await usdt.deployed()

    console.log(owner.address)
    const factory = await Factory.deploy()
    await factory.deployed()

    const proxyFactory = await BruProxyFactory.deploy(factory.address)
    await proxyFactory.deployed()

    const proxy = await ethers.getContractAt("BruFactory", proxyFactory.address)

    let pool = await Pool.deploy()
    await pool.deployed()

    let proxyPool = await BruProxyPool.deploy(pool.address)
    await proxyPool.deployed()
    await proxy.initialize()
    
    const proxyPool1 = await ethers.getContractAt("BruPool", proxyPool.address)
    let treasury = await Treasury.deploy(proxyPool.address)
    await treasury.deployed()
    await proxyPool1.initialize(owner.address,
        proxyFactory.address,
        poolToken.address,
        interestToken.address,
        treasury.address,
        "IndiaAgro")
        
    await proxy.addPoolDetails("IndiaAgro", proxyPool.address, pool.address, poolToken.address, interestToken.address, treasury.address)

    let addresses = {
        TOKEN_ADDRESS: usdt.address,
        FACTORY_ADDRESS: proxy.address,
    }
    console.log({
        poolName: "IndiaAgro",
        poolTokenAddress: poolToken.address,
        interestTokenAddress: interestToken.address,
        proxyPoolAddress: proxyPool.address,
        implementationPoolAddress: pool.address,
        treasuryAddress: treasury.address
    })
    console.log(addresses)
    save(addresses)
    // break from here
    // const USDT = await ethers.getContractAt("TestToken",'0x55e51D2FA39850ae376dA543A98BA801414eC807')
    // const proxy = await ethers.getContractAt("BruFactory",'0xF0FC2AA712710EeC5DDD6dee32c3Ccd0dc558497')

    // const poolDetails = await proxy.getPoolDetails(0);
    // await poolToken.setPoolAddress(poolDetails.proxyPoolAddress)
    // await interestToken.setPoolAddress(poolDetails.proxyPoolAddress)
    // const router = await Router.deploy(proxy.address)

    // let agripool = await ethers.getContractAt("BruPool", poolDetails.proxyPoolAddress)
    // await agripool.allowTokenAddress(usdt.address)
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
