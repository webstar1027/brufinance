import Web3 from "web3";
import fs from 'fs'

const addresses = JSON.parse(fs.readFileSync('./../Address.json').toString())

const factoryAbi = JSON.parse(fs.readFileSync("./../artifacts/contracts/core/BruFactory.sol/BruFactory.json").toString()).abi

const poolAbi = JSON.parse(fs.readFileSync("./../artifacts/contracts/core/BruPool.sol/BruPool.json").toString()).abi

const web3 = new Web3("HTTP://127.0.0.1:7545")

let address = '0x26D4819A93cD73eaD6ece1546f3B5C295A6D6b6D';
let tokenAddress = '0x7d46b95dA4f2AED520A1Aa97c60ff3d38a165D92';

getTransactions(tokenAddress, address)


async function getTransactions(tokenAddress, address){
    let contract = new web3.eth.Contract(factoryAbi,addresses["FACTORY_ADDRESS"])
    const poolAddress = await contract.methods.getPool(tokenAddress).call()
    contract = new web3.eth.Contract(poolAbi,poolAddress)
    
    const result = await contract.getPastEvents('AmountChange',{
        filter:{ _address:address },
        fromBlock: 0,
        toBlock: 'latest'
    })
    
    for (let i of result ){
        let value = i["returnValues"]
        let tamount = t
        if(value._type == 1){
            console.log(`Address : ${value._address}, deposited ${web3.utils.fromWei(value.tokenAmount)} tokens on ${ new Date(value.timestamp*1000).toUTCString() }  `)

        } else if (value._type == 2){
            console.log(`Address : ${value._address}, withdrawed ${web3.utils.fromWei(value.tokenAmount)} tokens on ${ new Date(value.timestamp*1000).toUTCString() }  `)

        } else {
            console.log(`Address : ${value._address}, interest tokens credited ${web3.utils.fromWei(value.tokenAmount)} on ${ new Date(value.timestamp*1000).toUTCString() }  `)

        }
    }
}

