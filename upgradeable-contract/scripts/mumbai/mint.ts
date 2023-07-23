import { ethers } from "hardhat";
import fs from 'fs';
const addresses = JSON.parse(fs.readFileSync('./scripts/mumbai/Address.json').toString())


async function main() {
    const tokenAddress = '0x59b670e9fA9D0A427751Af201D676719a970857b'
    const [owner] = await ethers.getSigners()
    const nftPrice = '10000000000000000000000'
    const router = await ethers.getContractAt('BruRouter', addresses['ROUTER_ADDRESS'])
    const usdt = await ethers.getContractAt('USDT', addresses['TOKEN_ADDRESS'])


    // const poolAddress = await router.getPoolAddress(0)
    // console.log(poolAddress)
    // const agripool = await ethers.getContractAt('BruPool', poolAddress)
    // console.log('Agripool Address',poolAddress)
    // await agripool.allowTokenAddress(usdt.address,'bUSDT','bUSDT')
    // const period = await agripool.lockPeriod()
    // console.log(period)
    // await usdt.mint(poolAddress, '100000000000000000000000000000000000000')
    // await usdt.mint(owner.address, '100000000000000000000000000000000000000')
    // let value = await usdt.balanceOf(poolAddress)
    // console.log(owner.address, value)
    await router.deposit(0,tokenAddress,"100000000000");
    // var nftJson = { "nftId": "6272b4c8ad8c64b289b6516h", "commodity": "SOYABEEN", "commodityId": "5f5f0f5edeed643fcc3428af", "quantity": 9900, "nftPrice": 366300, "pool": 1, "dataHash": "ppCI3L9q2cEs2UWJ/agwon6VVl6dcSSBBCNa9E0Dq0o=" }
    // var nftJson1 = { "nftId": "6272b4c8ad8c64b289b651i", "commodity": "SOYABEEN", "commodityId": "5f5f0f5edeed643fcc3428af", "quantity": 9900, "nftPrice": 366300, "pool": 1, "dataHash": "ppCI3L9q2cEs2UWJ/agwon6VVl6dcSSBBCNa9E0Dq0o=" }
    // var nftJson2 = { "nftId": "6272b4c8ad8c64b289b6516j", "commodity": "SOYABEEN", "commodityId": "5f5f0f5edeed643fcc3428af", "quantity": 9900, "nftPrice": 366300, "pool": 1, "dataHash": "ppCI3L9q2cEs2UWJ/agwon6VVl6dcSSBBCNa9E0Dq0o=" }
    //  let mintResult = await agripool.mintNft(owner.address, nftJson.nftId, nftJson.commodityId, nftJson.quantity, nftPrice, JSON.stringify(nftJson))
    // await agripool.mintNft(owner.address, nftJson1.nftId, nftJson1.commodityId, nftJson1.quantity, nftPrice, JSON.stringify(nftJson1))

    // await agripool.mintNft(owner.address, nftJson2.nftId, nftJson2.commodityId, nftJson2.quantity, nftPrice, JSON.stringify(nftJson2))
    
    // let nft = await agripool.nft(nftJson.nftId)
    // console.log(nft)

    // nft = await agripool.nft(nftJson1.nftId)
    // console.log(nft)

    // nft = await agripool.nft(nftJson2.nftId)
    // console.log(nft)
    
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })