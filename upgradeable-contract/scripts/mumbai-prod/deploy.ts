
import { ethers } from "hardhat";
import fs from 'fs';


async function main() {
  

  // We get the contract to deploy
    const [owner] = await ethers.getSigners()
    const mintAmount = '10000000000000000000000'
    // const depositAmount = '300000000000000000000'
    // const withdrawmount = '100000000000000000000'
  
//   const delegate = await Delegate.deploy()
//   const delegatev1 = await Delegatev1.deploy()
  

//   await delegate.deployed()
//   await delegatev1.deployed()
  const USDT = await ethers.getContractFactory("USDT")
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

  let addresses = {
    TOKEN_ADDRESS: usdt.address,
    FACTORY_ADDRESS: factory.address,
    ROUTER_ADDRESS: router.address
}
  console.log(addresses)
    save(addresses)
}

function save(addresses: Object) {
  fs.writeFileSync('./scripts/mumbai-prod/Address.json', JSON.stringify(addresses, null, '\t'))
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
