import { ethers,web3 } from "hardhat";
import fs from 'fs';

const addresses = JSON.parse(fs.readFileSync('./Address.json').toString())


async function main() {
    console.log(addresses)
    const [owner] = await ethers.getSigners()
    const mintAmount = '10000000000000000000000'
    const depositAmount = '300000000000000000000'
    const router = await ethers.getContractAt("BruRouter",'0xdfAD77bfd67C8e60c8bDA9F08f8304c9A3970034')
     const usdt = await ethers.getContractAt("USDT",'0x99Ca210160dA52CD33fdf728B5D14299Ba1E714F')
    
    const poolAddress = await router.getPoolAddress(0)
    console.log(poolAddress)

    const agripool = await ethers.getContractAt('BruPool',poolAddress)
    await usdt.approve(poolAddress,depositAmount)
    //  await router.deposit(0,usdt.address,depositAmount)
    let balance = await agripool.balanceOfLPToken(owner.address,usdt.address)
    console.log(web3.utils.fromWei(balance.toString()),balance)
    await agripool.checkLock()
    let wbalance = await agripool.withdrawableBalance(usdt.address,owner.address)
    console.log(web3.utils.fromWei(wbalance.toString()),"withdrawable balance")

    
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
