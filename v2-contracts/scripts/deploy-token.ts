import { ethers, web3 } from "hardhat";
import fs from 'fs';

const addresses = JSON.parse(fs.readFileSync('./Address.json').toString())

async function main(){
    const USDT = await ethers.getContractFactory("USDT");
    const factory = await ethers.getContractAt('BruFactory',addresses["FACTORY_ADDRESS"])
    const router = await ethers.getContractAt('Main',addresses["MAIN_ADDRESS"])

    const [owner, addr1] = await ethers.getSigners()
    const initialMintAmount = '10000000000000000000000'
    
    const token = await USDT.deploy(initialMintAmount)
    console.log(token.address)
    console.log(token.address)
    await factory.allowToken(token.address)
    const poolAddress = await router.poolFor(token.address)
    await token.approve(poolAddress,initialMintAmount)
    // await token.connect(addr1).approve(poolAddress,initialMintAmount)

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })