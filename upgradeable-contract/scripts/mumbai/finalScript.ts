
import { ethers } from "hardhat";
import fs from 'fs';
;
async function main() {
  

    const [owner,owner1] = await ethers.getSigners()
    const mintAmount = '100000000000000000000'
  const USDT = await ethers.getContractFactory("USDT")
  console.log("USD deploy");
  
  const Factory = await ethers.getContractFactory("BruFactory")
  const Router = await ethers.getContractFactory("BruRouter")
  const Pool = await ethers.getContractFactory('BruPool')
  const usdt = await USDT.deploy(mintAmount)
  await usdt.deployed()
  const factory = await Factory.deploy()
  
  await factory.deployed()
  let pool = await Pool.deploy()
  await pool.deployed()
  await factory.deployProxyPool("IndiaAgro",pool.address)
  const router = await Router.deploy(factory.address)
  console.log(pool.admin());
  let poolAddress = await router.getPoolAddress(0);
  const pool1 = await ethers.getContractAt("BruPool",poolAddress);
  
//step 1 
let InitialBalance = await usdt.balanceOf(owner.address);
console.log("initialBalance of USDT of user-----------------",InitialBalance);

let Approval = usdt.approve(poolAddress,"100");
console.log("Allowed pool to have 100 USDT from user-----------------------")

let DepositFirst = router.deposit(0,usdt.address,"100");
console.log("deposited 100--------------------");
let PostDepositBalance =await usdt.balanceOf(owner.address);
console.log("Post Deposit Balance of USDT of user--------------------",PostDepositBalance);

let ActiveBond = await pool1.activeBonds(0);
console.log("active bond created after user deposition------------------",ActiveBond);

let Bondtransfer = await pool1.bondTransfer("50",owner.address,owner1.address);

 console.log("Bond transfer done");
 let Bond1OfUser1 = await pool1.userBondsArray(owner.address,0);
// let Bond1OfUser11 = Bond1OfUser1[0];
 let Bond1OfUser2 = await pool1.activeBonds(1);
 console.log(Bond1OfUser1,"bond of user 1 after transfer");
 console.log(Bond1OfUser2,"bond of user 2 after transfer");
 
 let BalanceBeforeWithdraw =await usdt.balanceOf(owner.address);
 console.log("brutoken balance before withdraw",BalanceBeforeWithdraw);
 await delay(5000);
 await pool1.withdraw(
   owner.address,
   usdt.address,
    "100"
)
 let BalancePostWithdraw =await usdt.balanceOf(owner.address);
 console.log("brutoken balance after withdraw",BalancePostWithdraw);
 
 
 
// await pool1.bondTransfer("50",owner.address,owner1.address);
// //await pool1.bondTransfer("50",owner.address,owner1.address);
// let p3 = await pool1.activeBonds(1);
// //let p4 = await pool1.activeBonds(2);

// console.log(p3);

// console.log("withdraw successful",await usdt.balanceOf(owner.address));
//console.log(p4,"bond for user2 second");
let addresses = {
    TOKEN_ADDRESS: usdt.address,
    FACTORY_ADDRESS: factory.address,
    ROUTER_ADDRESS: router.address
}
    save(addresses)
}

function save(addresses: Object) {
  fs.writeFileSync('./scripts/mumbai/Address.json', JSON.stringify(addresses, null, '\t'))
}

function delay(delayInms:any) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
