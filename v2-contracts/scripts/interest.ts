import { ethers, web3 } from "hardhat";


async function main() {
    const tokenAddress = '0x99Ca210160dA52CD33fdf728B5D14299Ba1E714F'
    const [owner] = await ethers.getSigners()
    const nftPrice = '10000000000000000000000'
    const router = await ethers.getContractAt('BruRouter', '0x5f3F9597EeF2b51a7D3291841017b594c0D05e3b')
    const usdt = await ethers.getContractAt('USDT', tokenAddress)


    const poolAddress = await router.getPoolAddress(0)
    const agripool = await ethers.getContractAt('BruPool', poolAddress)
    console.log(poolAddress)
    await agripool.addEndOfDayBalance(tokenAddress)
    const interest = await agripool.calculateInterest('0x148e772046B59f5A61ea0F0322110eCE5f6bb146')
    console.log(interest)
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })