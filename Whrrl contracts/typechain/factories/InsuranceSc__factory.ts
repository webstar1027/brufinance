/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { InsuranceSc, InsuranceScInterface } from "../InsuranceSc";

const _abi = [
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balances",
    outputs: [
      {
        internalType: "uint256",
        name: "freeTokens",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lienTokens",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "walletType",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "farmerAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "grainDetail",
    outputs: [
      {
        internalType: "string",
        name: "otherDetails",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "commodity",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expiryDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "repaymentLoanAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "marketValueAtTheTimeDepositPerUnit",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalMarketValue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deliveredToken",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lienToken",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "lienStatus",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "totalLoanAmount",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "whrStatus",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "insuranceDetails",
    outputs: [
      {
        internalType: "string",
        name: "componyName",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "policeId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "fromDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endDate",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "status",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isAudit",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "isInsurance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "numberOfCmaAudits",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "numberOfLoans",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "string",
        name: "_componyName",
        type: "string",
      },
      {
        internalType: "bytes32",
        name: "_policeId",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_fromDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_endDate",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "_status",
        type: "bool",
      },
    ],
    name: "updateInsurance",
    outputs: [
      {
        internalType: "bool",
        name: "done",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "valuePerToken",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405260008060146101000a81548160ff021916908360ff16021790555060008060156101000a81548160ff021916908360ff160217905550600060015534801561004b57600080fd5b50610a4a8061005b6000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c8063a8fa8e5211610071578063a8fa8e5214610370578063b7b58b7f1461038e578063c6be2371146103d8578063d022c638146103fa578063e390a1b81461041e578063fe4e8be414610440576100a9565b806304f53549146100ae57806327e235e3146100d25780636337fd011461013e57806364494699146102455780638da5cb5b14610326575b600080fd5b6100b66104ea565b604051808260ff1660ff16815260200191505060405180910390f35b610114600480360360208110156100e857600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506104fd565b604051808481526020018381526020018260ff1660ff168152602001935050505060405180910390f35b61022b600480360360c081101561015457600080fd5b810190808035906020019064010000000081111561017157600080fd5b82018360208201111561018357600080fd5b803590602001918460018302840111640100000000831117156101a557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050919291929080359060200190929190803590602001909291908035906020019092919080359060200190929190803515159060200190929190505050610534565b604051808215151515815260200191505060405180910390f35b61024d610711565b60405180806020018e81526020018d81526020018c81526020018b81526020018a8152602001898152602001888152602001878152602001868152602001851515151581526020018481526020018360ff1660ff16815260200182810382528f818151815260200191508051906020019080838360005b838110156102df5780820151818401526020810190506102c4565b50505050905090810190601f16801561030c5780820380516001836020036101000a031916815260200191505b509e50505050505050505050505050505060405180910390f35b61032e610817565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61037861083d565b6040518082815260200191505060405180910390f35b610396610843565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103e0610868565b604051808215151515815260200191505060405180910390f35b61040261087b565b604051808260ff1660ff16815260200191505060405180910390f35b61042661088e565b604051808215151515815260200191505060405180910390f35b6104486108a1565b604051808060200187815260200186815260200185815260200184815260200183151515158152602001828103825288818151815260200191508051906020019080838360005b838110156104aa57808201518184015260208101905061048f565b50505050905090810190601f1680156104d75780820380516001836020036101000a031916815260200191505b5097505050505050505060405180910390f35b600060159054906101000a900460ff1681565b60026020528060005260406000206000915090508060000154908060010154908060020160009054906101000a900460ff16905083565b6000338073ffffffffffffffffffffffffffffffffffffffff16600360029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16146105fa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260168152602001807f53656e646572206e6f7420617574686f72697a65642e0000000000000000000081525060200191505060405180910390fd5b60016004600c0160009054906101000a900460ff1660ff1614610685576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260188152602001807f746f6b656e206973206e6f7420616374697665206e6f772e000000000000000081525060200191505060405180910390fd5b876011600001908051906020019061069e929190610970565b508660116001018190555085601160020181905550846011600301819055508360116004018190555082601160050160006101000a81548160ff0219169083151502179055506001600360006101000a81548160ff02191690831515021790555060019150819150509695505050505050565b6004806000018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156107ab5780601f10610780576101008083540402835291602001916107ab565b820191906000526020600020905b81548152906001019060200180831161078e57829003601f168201915b50505050509080600101549080600201549080600301549080600401549080600501549080600601549080600701549080600801549080600901549080600a0160009054906101000a900460ff169080600b01549080600c0160009054906101000a900460ff1690508d565b600360029054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60015481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600360009054906101000a900460ff1681565b600060149054906101000a900460ff1681565b600360019054906101000a900460ff1681565b6011806000018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561093b5780601f106109105761010080835404028352916020019161093b565b820191906000526020600020905b81548152906001019060200180831161091e57829003601f168201915b5050505050908060010154908060020154908060030154908060040154908060050160009054906101000a900460ff16905086565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106109b157805160ff19168380011785556109df565b828001600101855582156109df579182015b828111156109de5782518255916020019190600101906109c3565b5b5090506109ec91906109f0565b5090565b610a1291905b80821115610a0e5760008160009055506001016109f6565b5090565b9056fea265627a7a723158209d20b0a0a327f1eb881a1d47f24dd3fb7e696e636cf14410858dde33cc38f8a564736f6c634300050e0032";

export class InsuranceSc__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<InsuranceSc> {
    return super.deploy(overrides || {}) as Promise<InsuranceSc>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): InsuranceSc {
    return super.attach(address) as InsuranceSc;
  }
  connect(signer: Signer): InsuranceSc__factory {
    return super.connect(signer) as InsuranceSc__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): InsuranceScInterface {
    return new utils.Interface(_abi) as InsuranceScInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): InsuranceSc {
    return new Contract(address, _abi, signerOrProvider) as InsuranceSc;
  }
}
