import { ethers } from "hardhat";
import fs from 'fs';
const addresses = JSON.parse(fs.readFileSync('./scripts/mumbai-prod/Address.json').toString())


async function main() {
    const tokenAddress = '0x59b670e9fA9D0A427751Af201D676719a970857b'
    const [owner] = await ethers.getSigners()
    const nftPrice = '10000000000000000000000'
    const router = await ethers.getContractAt('BruRouter', addresses['ROUTER_ADDRESS'])
    const usdt = await ethers.getContractAt('USDT', addresses['TOKEN_ADDRESS'])


    const poolAddress = await router.getPoolAddress(0)
    console.log(poolAddress)
    // const agripool = await ethers.getContractAt('BruPool', poolAddress)
    // console.log('Agripool Address',poolAddress)
    // // await agripool.allowTokenAddress(usdt.address,'bUSDT','bUSDT')
    // await usdt.mint(poolAddress, '100000000000000000000000000000000000000')
    // await usdt.mint(owner.address, '100000000000000000000000000000000000000')
    // let value = await usdt.balanceOf(poolAddress)
    // console.log(owner.address, value)
    // var nftJson = { "nftId": "6272b4c8ad8c64b289b6516d", "commodity": "Sorghum", "commodityId": "5f02c0b869e6cd2702248ec1", "quantity": 15000, "nftPrice": 450000, "pool": 1, "dataHash": "S5Ziv4Iq1gtgIqNge6tyf4piCtjj8a+N1VQ+XEWmcDU=" }
    // let mintResult = await agripool.mintNft(owner.address, nftJson.nftId, nftJson.commodityId, nftJson.quantity, nftPrice, JSON.stringify(nftJson))
    // console.log(mintResult)
    
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })