
import { ethers, web3 } from "hardhat";
import fs from 'fs';

async function main() {
    const [owner, addr1, addr2] = await ethers.getSigners();
    const mintAmount = '10000000000000000000000'
    const depositAmount = '1000000000000000000000'
    const nameOfPool = "Agri"
    const USDT = await ethers.getContractFactory("USDT");
    const Factory = await ethers.getContractFactory("BruFactory")
    const Router = await ethers.getContractFactory("BruRouter")
    const usdt = await USDT.deploy(mintAmount);
    console.log("USDT address is ", usdt.address)
    const ownerBalance = await usdt.balanceOf(owner.address);
    console.log("The USDT balance of user is", web3.utils.fromWei(ownerBalance.toString()))
    const factory = await Factory.deploy()
    await factory.deployPool(nameOfPool)
    console.log('Factory address is', factory.address)
    const router = await Router.deploy(factory.address)
    const poolAddress = await router.getPoolAddress(0)
    console.log(poolAddress)
    await usdt.approve(poolAddress, mintAmount)

    const pool = await ethers.getContractAt("BruPool",poolAddress)
    let result  = await pool.name()
    
    console.log(`\n Depositing ${web3.utils.fromWei(depositAmount).toString()} usdt token `)
    await router.deposit(0,usdt.address, depositAmount)
    
    // let tokenBalance = await pool.balanceOfLPToken(owner.address, usdt.address)
    // console.log(`Balance of BUSDT tokens ${web3.utils.fromWei(tokenBalance.toString())}`)

    // let ownerBalance1 = await usdt.connect(owner).balanceOf(owner.address);
    // console.log("\nThe USDT balance of user is", web3.utils.fromWei(ownerBalance1.toString()))
    // await pool.addEndOfDayBalance(usdt.address)
    // await pool.withdraw(owner.address,usdt.address, depositAmount)
    // ownerBalance1 = await usdt.connect(owner).balanceOf(owner.address);
    // console.log("\nThe USDT balance of user is", web3.utils.fromWei(ownerBalance1.toString()))
    
    // await pool.addEndOfDayBalance(usdt.address)
    // await pool.addEndOfDayBalance(usdt.address)
    // await pool.depositInterest(usdt.address);
    // tokenBalance = await pool.balanceOfLPToken(owner.address,usdt.address)
    // console.log(`After withdraw balance of BUSDT tokens ${web3.utils.fromWei(tokenBalance.toString())}`)
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
