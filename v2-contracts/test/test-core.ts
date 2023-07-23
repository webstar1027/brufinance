import { expect,assert } from 'chai'
import { ethers,web3 } from "hardhat"
describe("USDT contract", function () {
    it("Deployment should assign the total supply of tokens to the owner", async function () {
      const [owner] = await ethers.getSigners();
    const mintAmount = '10000000000000000000000'
    const depositAmount = '1000000000000000000000'
    const USDT = await ethers.getContractFactory("USDT");
    const Factory = await ethers.getContractFactory("BruFactory")
    const Router = await ethers.getContractFactory("Main")
    const usdt = await USDT.deploy(mintAmount);
    console.log("USDT address is ", usdt.address)
    const ownerBalance = await usdt.balanceOf(owner.address);
    console.log("The USDT balance of user is", web3.utils.fromWei(ownerBalance.toString()))
    const factory = await Factory.deploy()
    await factory.allowToken(usdt.address)
    console.log('Factory address is', factory.address)
    const INIT_CODE_HASH = await factory.INIT_CODE_HASH()
    console.log("Init Code Hash is ", INIT_CODE_HASH)
    const router = await Router.deploy(factory.address, INIT_CODE_HASH);
    console.log("Router address is ", router.address)
    const pooladdress = await router.poolFor(usdt.address)
    console.log("USDT Pool address", pooladdress)
    await usdt.approve(pooladdress, mintAmount)
    console.log(`\n Depositing ${web3.utils.fromWei(depositAmount).toString()} usdt token `)
    await router.deposit(usdt.address, depositAmount)

    console.log(`\n Second deposit of ${web3.utils.fromWei(depositAmount).toString()} token `)
    await router.deposit(usdt.address, depositAmount)

    const ownerBalance1 = await usdt.connect(owner).balanceOf(owner.address);
    console.log("\nThe USDT balance of user is", web3.utils.fromWei(ownerBalance1.toString()))
    const pool = await ethers.getContractAt("BruPool", pooladdress);
    let b = await pool.balanceOf(owner.address)
    console.log("\nBalance of btoken ", web3.utils.fromWei(b.toString()))
    let d = await pool.getDepositDetails(owner.address)
    console.log(d)
    await pool.depositInterest();
    // d = await pool.getDepositDetails(owner.address)
    // // console.log(d)
    // b = await pool.balanceOf(owner.address)
    // console.log("Balance of btoken ", web3.utils.fromWei(b.toString()))

    });
  });