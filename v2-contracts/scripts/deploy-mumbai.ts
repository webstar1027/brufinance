import { ethers, web3 } from "hardhat";
import fs from 'fs';


async function main() {
    let [owner] =await  ethers.getSigners()
    const mintAmount = '10000000000000000000000'
    const depositAmount = '100000000000000000000'
    const usdt = await ethers.getContractAt("USDT",'0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0')
    const factory = await ethers.getContractAt("BruFactory",'0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82')
    const router = await ethers.getContractAt("BruRouter",'0x9A676e781A523b5d0C0e43731313A708CB607508')
    // const Factory = await ethers.getContractFactory("BruFactory")
    // const Router = await ethers.getContractFactory("BruRouter")
    // const USDT = await ethers.getContractFactory("USDT")
    // let poolName = "IndiaAgro"
    // const usdt = await USDT.deploy(mintAmount);
    // console.log(usdt.address)
    // const factory = await Factory.deploy()
    // const router = await Router.deploy(factory.address);
    

    // await factory.deployPool(router.address,poolName)
    // // await factory.deployPool(router.address,"gold")
    // let addresses = {
    //     TOKEN_ADDRESS: usdt.address,
    //     FACTORY_ADDRESS: factory.address,
    //     ROUTER_ADDRESS: router.address
    // }
    // console.log(addresses)
    const poolAddress = await router.getPoolAddress(0)
    console.log(poolAddress)

    const agripool = await ethers.getContractAt('BruPool',poolAddress)
    // await agripool.allowTokenAddress(usdt.address,'bUSDT','bUSDT')

    await usdt.approve(poolAddress,depositAmount)
    await router.deposit(0,usdt.address,depositAmount)
    let balance = await agripool.balanceOfLPToken(owner.address,usdt.address)
    console.log(web3.utils.fromWei(balance.toString()),balance)
    await agripool.checkLock()
    let wbalance = await agripool.withdrawableBalance(usdt.address,owner.address)
    console.log(wbalance)
    // await agripool.addEndOfDayBalance(usdt.address)
    // const interest = await agripool.calculateInterest('0xeAc166E85474CC0489D564bA0ead4b45f36578Ca')
    // console.log(interest)
    

    // save(addresses)
}

function save(addresses: Object) {
    fs.writeFileSync('./Address.json', JSON.stringify(addresses, null, '\t'))
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })