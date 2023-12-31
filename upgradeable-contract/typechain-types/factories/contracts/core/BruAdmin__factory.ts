/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  BruAdmin,
  BruAdminInterface,
} from "../../../contracts/core/BruAdmin";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "prod1",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "denominator",
        type: "uint256",
      },
    ],
    name: "PRBMath__MulDivOverflow",
    type: "error",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "allowTokenAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_interestRate",
        type: "uint256",
      },
    ],
    name: "changeBorrowInterestRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "changeBorrowPlatformFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "changeLendPlatformFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "time",
        type: "uint256",
      },
    ],
    name: "changeLockPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_interestRate",
        type: "uint256",
      },
    ],
    name: "changeNonWithdrawFees",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_spread",
        type: "uint256",
      },
    ],
    name: "changeSpread",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_interestRate",
        type: "uint256",
      },
    ],
    name: "changeStableInterestRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "disableBorrow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "enableBorrow",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "lockPeriod",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "platformFees",
    outputs: [
      {
        internalType: "uint256",
        name: "borrow",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lend",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rates",
    outputs: [
      {
        internalType: "uint256",
        name: "borrow",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lend",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610746806100206000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c80633fd8b02f1161008c578063bd7aa39211610066578063bd7aa392146101ad578063c25cf1d0146101c0578063f851a440146101d3578063fbc39093146101fe57600080fd5b80633fd8b02f1461017557806343f48fbd1461018c57806396748a1f1461019a57600080fd5b80631c119308116100c85780631c1193081461013f5780632696a2c21461015257806331d72f651461016557806339c3274e1461016d57600080fd5b80630914387b146100ef578063194a4e7e146101045780631ab4b0f51461012c575b600080fd5b6101026100fd366004610685565b610211565b005b600754600854610112919082565b604080519283526020830191909152015b60405180910390f35b61010261013a366004610685565b610256565b61010261014d366004610685565b610292565b610102610160366004610685565b6102ce565b61010261030a565b610102610343565b61017e60095481565b604051908152602001610123565b600554600654610112919082565b6101026101a836600461065c565b610382565b6101026101bb366004610685565b61047b565b6101026101ce366004610685565b6104b8565b6000546101e6906001600160a01b031681565b6040516001600160a01b039091168152602001610123565b61010261020c366004610685565b610537565b6000546001600160a01b031633146102445760405162461bcd60e51b815260040161023b9061069e565b60405180910390fd5b610250816103e8610573565b60025550565b6000546001600160a01b031633146102805760405162461bcd60e51b815260040161023b9061069e565b61028c816103e8610573565b60065550565b6000546001600160a01b031633146102bc5760405162461bcd60e51b815260040161023b9061069e565b6102c8816103e8610573565b60055550565b6000546001600160a01b031633146102f85760405162461bcd60e51b815260040161023b9061069e565b61030481612710610573565b60085550565b6000546001600160a01b031633146103345760405162461bcd60e51b815260040161023b9061069e565b6000805460ff60a01b19169055565b6000546001600160a01b0316331461036d5760405162461bcd60e51b815260040161023b9061069e565b6000805460ff60a01b1916600160a01b179055565b6000546001600160a01b031633146103ac5760405162461bcd60e51b815260040161023b9061069e565b6001600160a01b03811660009081526003602052604090205460ff16156104155760405162461bcd60e51b815260206004820152601860248201527f416c726561647920616c6c6f7765642062792061646d696e0000000000000000604482015260640161023b565b6001600160a01b03166000818152600360205260408120805460ff191660019081179091556004805491820181559091527f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b0180546001600160a01b0319169091179055565b6000546001600160a01b031633146104a55760405162461bcd60e51b815260040161023b9061069e565b600181905560055461028c9082906106d5565b6000546001600160a01b031633146104e25760405162461bcd60e51b815260040161023b9061069e565b600081116105325760405162461bcd60e51b815260206004820181905260248201527f74696d652073686f756c642062652067726561746572207468616e207a65726f604482015260640161023b565b600955565b6000546001600160a01b031633146105615760405162461bcd60e51b815260040161023b9061069e565b61056d81612710610573565b60075550565b600061058883670de0b6b3a76400008461058f565b9392505050565b6000808060001985870985870292508281108382030391505080600014156105ca578382816105c0576105c06106fa565b0492505050610588565b8381106105f457604051631dcf306360e21b8152600481018290526024810185905260440161023b565b600084868809600260036001881981018916988990049182028318808302840302808302840302808302840302808302840302808302840302918202909203026000889003889004909101858311909403939093029303949094049190911702949350505050565b60006020828403121561066e57600080fd5b81356001600160a01b038116811461058857600080fd5b60006020828403121561069757600080fd5b5035919050565b60208082526019908201527f43616e2062652075736564206f6e6c792062792061646d696e00000000000000604082015260600190565b6000828210156106f557634e487b7160e01b600052601160045260246000fd5b500390565b634e487b7160e01b600052601260045260246000fdfea2646970667358221220b6a26f147a62193a2d12b269cc315e736dbdf22f53931ef31ed4f78b64361f1364736f6c63430008070033";

type BruAdminConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BruAdminConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class BruAdmin__factory extends ContractFactory {
  constructor(...args: BruAdminConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<BruAdmin> {
    return super.deploy(overrides || {}) as Promise<BruAdmin>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): BruAdmin {
    return super.attach(address) as BruAdmin;
  }
  override connect(signer: Signer): BruAdmin__factory {
    return super.connect(signer) as BruAdmin__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BruAdminInterface {
    return new utils.Interface(_abi) as BruAdminInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BruAdmin {
    return new Contract(address, _abi, signerOrProvider) as BruAdmin;
  }
}
