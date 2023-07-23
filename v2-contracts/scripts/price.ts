import { ethers, web3 } from "hardhat";

async function main(){
    const [owner] = await ethers.getSigners();
    const mintAmount = '10000000000000000000000'
    const Price = await ethers.getContractFactory('BruPrice');
    
    const price = await Price.deploy()
    console.log(price.address,"Address of price contract")
    await price.updatePrice("IndiaAgro",mintAmount)
    let result = await price.asset("IndiaAgro")
    console.log(result)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
