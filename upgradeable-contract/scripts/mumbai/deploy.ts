
import { ethers } from "hardhat";
import fs from 'fs';


async function main() {


  // We get the contract to deploy
  const [owner] = await ethers.getSigners()
  const mintAmount = '10000000000000000000000'
  const depositAmount = '300000000000000000000'
  // const withdrawmount = '100000000000000000000'
  const USDT = await ethers.getContractFactory("TestToken");
  const Factory =  await ethers.getContractFactory("BruFactory");
  const Router = await ethers.getContractFactory("BruRouter");
  const Pool = await ethers.getContractFactory('BruPool');
 const usdt = await USDT.deploy(mintAmount)
  await usdt.deployed()
  const factory = await Factory.deploy()

  await factory.deployed()
  let pool = await Pool.deploy()
  await pool.deployed()
  let k = await factory.deployProxyPool("IndiaAgro", pool.address);
  k.wait();

  
  const router = await Router.deploy(factory.address)
//  const treasuryAddressArray = await factory.getPoolDetails();

//   console.log(treasuryAddressArray,"treasury Address");
let poolAddress = await router.getPoolAddress(0);
console.log(poolAddress);
// usdt.mint(owner.address,'100000000000000000000');
  //   let proxyInstance = Delegate.attach(proxyPoolAddress)
//  let tokenAddress = await pool1.poolTokenAddress()
 // console.log(tokenAddress)
//  const pool1 = await ethers.getContractAt('BruPool', poolAddress);
//   await pool1.allowTokenAddress(usdt.address);
//   await usdt.approve(poolAddress,"1000");
//   console.log("approval done");

    let addresses = {
    TOKEN_ADDRESS: usdt.address,
    FACTORY_ADDRESS: factory.address,
    ROUTER_ADDRESS: router.address
  }
  console.log("Addresses of contracts",addresses)
//   await router.deposit(0,usdt.address,"100");
//   let routertx = await router.withdraw(
//     0,
//     usdt.address,
//      "20"
//  )
// console.log(routertx);
const treasuryAddressArray1 = await factory.getPoolDetails();
console.log(treasuryAddressArray1);


await usdt.mint(poolAddress,"1000000000000000000000");
 // const poolAddress = router.getPoolAddress(0);
  //  const pool1 = await ethers.getContractAt('BruPool', poolAddress);
   //usdt.mint(poolAddress,"1000000000000000000000000000");
    //  const treasuryContract = await ethers.getContractAt('AssetTreasury',treasuryAddressArray[0].treasuryAddress);
    // console.log(treasuryContract);
     
  //     var nftJson = { "nftId": "6272b4c8ad8c64b289b6516e", "commodity": "SOYABEEN", "commodityId": "5f5f0f5edeed643fcc3428af", "quantity": 9900, "nftPrice": 366300, "pool": 1, "dataHash": "ppCI3L9q2cEs2UWJ/agwon6VVl6dcSSBBCNa9E0Dq0o=" }
  //     let mintResult = await treasuryContract.mintNft(owner.address, nftJson.nftId, nftJson.commodityId, nftJson.quantity, nftJson.nftPrice,nftJson.dataHash, JSON.stringify(nftJson));
  //    let nftResult = await pool1.nft(nftJson.nftId);
  //   // var nftJson1 = { "nftId": "6272b4c8ad8c64b289b6516e1", "commodity": "SOYABEEN", "commodityId": "5f5f0f5edeed643fcc3428af", "quantity": 9900, "nftPrice": 366300, "pool": 1, "dataHash": "ppCI3L9q2cEs2UWJ/agwon6VVl6dcSSBBCNa9E0Dq0o=" }
  //   // let mintResult1 = await treasuryContract.mintNft(owner.address, nftJson.nftId, nftJson.commodityId, nftJson.quantity, nftJson.nftPrice,nftJson.dataHash, JSON.stringify(nftJson));
  //   // let nftResult1 = await pool1.nft(nftJson.nftId);
  //    let Borrow = await router.borrow(0,
  //    "6272b4c8ad8c64b289b6516e",
  //     usdt.address,
  //     "100");
  //    let borrowResult = await pool1.borrowedNft(nftJson.nftId);
  //    console.log(borrowResult,"borrowed result");
    
  //     let approval = await usdt.approve(poolAddress,"80");
  //     let Repay = await router.repay(0,  "6272b4c8ad8c64b289b6516e",usdt.address,"50");
  // console.log("repay successful");
  

    

  // await usdt.approve(proxyPoolAddress,depositAmount)
  // await router.deposit(0,usdt.address,depositAmount)
  // let result = await pool1.getBruTokenBalance(owner.address)
  // console.log("LP token balance",ethers.utils.formatEther(result.toString()))
  
}
function save(addresses: Object) {
  fs.writeFileSync('./scripts/localhost/Address.json', JSON.stringify(addresses, null, '\t'))
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
