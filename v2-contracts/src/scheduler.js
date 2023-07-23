import { schedule } from 'node-cron'
import Web3  from "web3"
import { readFileSync } from 'fs'
// import * as json from "./artifacts/contracts/core/BruPool.sol/BruPool.json"

const abi = JSON.parse(readFileSync("./artifacts/contracts/core/BruPool.sol/BruPool.json").toString()).abi
console.log(abi)
schedule('* 3 28-31 * *',async function(){
    if(endOfMonth()){
        depositInterest()
    }
})

let array = [31, 28, 31, 5, 31, 30, 31, 31, 30, 31, 30, 31]

const web3 = new Web3("http://127.0.0.1:8545/")

console.log(endOfMonth())
function endOfMonth() {
    let date = new Date()
    let day = date.getDate()
    let month = date.getMonth()

    // check for february
    if (month == 1) {
        let leapYear = checkYear(date.getFullYear())
        if (leapYear) {
            if (day == 29) {
                return true
            } else {
                return false
            }

        } else {
            if (day == 28) {
                return true
            } else {
                return false
            }
        }
    }

    // for other months
    if (array[month] == day) {
        return true
    } else {
        return false
    }
}

function checkYear(year) {
    if (year % 400 == 0)
        return true;
    if (year % 100 == 0)
        return false
    if (year % 4 == 0)
        return true;
    return false;
}


async function depositInterest() {
    const contract = new web3.eth.Contract(abi,'0x4F5d310De763b6993C43aaeEcA66485536212EA5')
    const result = await contract.methods.factory().call()
    console.log(result)
}
