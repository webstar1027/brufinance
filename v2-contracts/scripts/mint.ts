import { ethers, web3 } from "hardhat";


async function main() {
    const tokenAddress = '0x99Ca210160dA52CD33fdf728B5D14299Ba1E714F'
    const [owner] = await ethers.getSigners()
    const nftPrice = '10000000000000000000000'
    const router = await ethers.getContractAt('BruRouter', '0xdfAD77bfd67C8e60c8bDA9F08f8304c9A3970034')
    const usdt = await ethers.getContractAt('USDT', tokenAddress)


    const poolAddress = await router.getPoolAddress(0)
    const agripool = await ethers.getContractAt('BruPool', poolAddress)
    console.log(poolAddress)
    // await agripool.allowTokenAddress(usdt.address,'bUSDT','bUSDT')
    await usdt.mint(poolAddress, '100000000000000000000000000000000000000')
    await usdt.mint(owner.address, '100000000000000000000000000000000000000')
    let value = await usdt.balanceOf(poolAddress)
    console.log(owner.address, value)
    var nftJson = { "nftId": "625e89ca366e932d4258c94f", "commodity": "SOYABEEN", "commodityId": "5f5f0f5edeed643fcc3428af", "quantity": 9900, "nftPrice": 366300, "pool": 1, "dataHash": "ppCI3L9q2cEs2UWJ/agwon6VVl6dcSSBBCNa9E0Dq0o=" }
    let mintResult = await agripool.mintNft(owner.address, nftJson.nftId, nftJson.commodityId, nftJson.quantity, nftPrice, JSON.stringify(nftJson))
    console.log(mintResult)
    // let borrowResult = await router.borrow(0,nftJson.nftId,tokenAddress,'30000000000000000000')
    // console.log(borrowResult)
    // await usdt.approve(poolAddress,'10000000000000000000')
    // let repayResult = await router.repay(0,nftJson.nftId,tokenAddress,'10000000000000000000')
    // console.log(repayResult)
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })