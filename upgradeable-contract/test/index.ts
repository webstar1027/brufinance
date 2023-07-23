import { getContractFactory } from "@nomiclabs/hardhat-ethers/types";
import { Contract, ContractFactory } from "ethers";
import { ethers } from "hardhat";

describe("test via proxy", function () {
  let Proxy: ContractFactory, proxy: Contract,proxy1: Contract;
  let Delegate: ContractFactory, delegate: Contract;
  const stratName = "test";

  before(async function () {

    Delegate = await ethers.getContractFactory("Delegate");
    delegate = await Delegate.deploy();
    await delegate.deployed();
    Proxy = await ethers.getContractFactory("PoolProxy");
    proxy = await Proxy.deploy(delegate.address);
    await proxy.deployed();
    proxy1 = await ethers.getContractAt("Delegate",proxy.address)
    

    // await proxy.addStrategy(stratName, delegate.address);
  });

  it("should display", async function () {
    const [owner] = await ethers.getSigners();
    let version =  await proxy.version();
    console.log(version)
  });
});