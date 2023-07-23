
import { ethers, web3 } from "hardhat";
import fs from 'fs';

async function main() {
    let [owner] =await  ethers.getSigners()
    const mintAmount = '10000000000000000000000'
    const depositAmount = '100000000000000000000'
    const Factory = await ethers.getContractFactory("BruFactory")
    const Router = await ethers.getContractFactory("BruRouter")
    const USDT = await ethers.getContractFactory("USDT")
    let poolName = "IndiaAgro"
    const usdt = await USDT.deploy(mintAmount);
    console.log(usdt.address)
    const factory = await Factory.deploy()
    const router = await Router.deploy(factory.address);
     await factory.deployPool(router.address,poolName)
    let addresses = {
        TOKEN_ADDRESS: usdt.address,
        FACTORY_ADDRESS: factory.address,
        ROUTER_ADDRESS: router.address
    }
    // const poolAddress = await router.getPoolAddress(0)
    // console.log(poolAddress)

    // const agripool = await ethers.getContractAt('BruPool',poolAddress)
    // await agripool.allowTokenAddress(usdt.address,'bUSDT','bUSDT')
    console.log(addresses)
    save(addresses)
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
