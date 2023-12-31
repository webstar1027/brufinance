/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  TestToken,
  TestTokenInterface,
} from "../../../contracts/tokens/TestToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "initialSupply",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "approveTokensForTransfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_address",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040526000196005553480156200001757600080fd5b5060405162000e4238038062000e428339810160408190526200003a9162000248565b604080518082018252600a8152692aa9a2102a32ba3432b960b11b6020808301918252835180850190945260048452631554d11560e21b9084015281519192916200008891600391620001a2565b5080516200009e906004906020840190620001a2565b505050620000b33382620000ba60201b60201c565b50620002c6565b6001600160a01b038216620001155760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640160405180910390fd5b806002600082825462000129919062000262565b90915550506001600160a01b038216600090815260208190526040812080548392906200015890849062000262565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b828054620001b09062000289565b90600052602060002090601f016020900481019282620001d457600085556200021f565b82601f10620001ef57805160ff19168380011785556200021f565b828001600101855582156200021f579182015b828111156200021f57825182559160200191906001019062000202565b506200022d92915062000231565b5090565b5b808211156200022d576000815560010162000232565b6000602082840312156200025b57600080fd5b5051919050565b600082198211156200028457634e487b7160e01b600052601160045260246000fd5b500190565b600181811c908216806200029e57607f821691505b60208210811415620002c057634e487b7160e01b600052602260045260246000fd5b50919050565b610b6c80620002d66000396000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c806340c10f191161008c5780639dc29fac116100665780639dc29fac146101d0578063a457c2d7146101e3578063a9059cbb146101f6578063dd62ed3e1461020957600080fd5b806340c10f191461018c57806370a082311461019f57806395d89b41146101c857600080fd5b806318160ddd116100c857806318160ddd1461014557806323b872dd14610157578063313ce5671461016a578063395093511461017957600080fd5b806306fdde03146100ef578063095ea7b31461010d578063147bf2c614610130575b600080fd5b6100f761021c565b6040516101049190610a61565b60405180910390f35b61012061011b366004610a37565b6102ae565b6040519015158152602001610104565b61014361013e3660046109a6565b6102c6565b005b6002545b604051908152602001610104565b6101206101653660046109fb565b6102d6565b60405160128152602001610104565b610120610187366004610a37565b6102fa565b61014361019a366004610a37565b61031c565b6101496101ad3660046109a6565b6001600160a01b031660009081526020819052604090205490565b6100f7610326565b6101436101de366004610a37565b610335565b6101206101f1366004610a37565b61033f565b610120610204366004610a37565b6103bf565b6101496102173660046109c8565b6103cd565b60606003805461022b90610ae5565b80601f016020809104026020016040519081016040528092919081815260200182805461025790610ae5565b80156102a45780601f10610279576101008083540402835291602001916102a4565b820191906000526020600020905b81548152906001019060200180831161028757829003601f168201915b5050505050905090565b6000336102bc8185856103f8565b5060019392505050565b6102d2816005546102ae565b5050565b6000336102e485828561051d565b6102ef858585610597565b506001949350505050565b6000336102bc81858561030d83836103cd565b6103179190610ab6565b6103f8565b6102d28282610765565b60606004805461022b90610ae5565b6102d28282610844565b6000338161034d82866103cd565b9050838110156103b25760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f77604482015264207a65726f60d81b60648201526084015b60405180910390fd5b6102ef82868684036103f8565b6000336102bc818585610597565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6001600160a01b03831661045a5760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b60648201526084016103a9565b6001600160a01b0382166104bb5760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b60648201526084016103a9565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b600061052984846103cd565b9050600019811461059157818110156105845760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e636500000060448201526064016103a9565b61059184848484036103f8565b50505050565b6001600160a01b0383166105fb5760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f206164604482015264647265737360d81b60648201526084016103a9565b6001600160a01b03821661065d5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b60648201526084016103a9565b6001600160a01b038316600090815260208190526040902054818110156106d55760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e7420657863656564732062604482015265616c616e636560d01b60648201526084016103a9565b6001600160a01b0380851660009081526020819052604080822085850390559185168152908120805484929061070c908490610ab6565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8460405161075891815260200190565b60405180910390a3610591565b6001600160a01b0382166107bb5760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f20616464726573730060448201526064016103a9565b80600260008282546107cd9190610ab6565b90915550506001600160a01b038216600090815260208190526040812080548392906107fa908490610ab6565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b6001600160a01b0382166108a45760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b60648201526084016103a9565b6001600160a01b038216600090815260208190526040902054818110156109185760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b60648201526084016103a9565b6001600160a01b0383166000908152602081905260408120838303905560028054849290610947908490610ace565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90602001610510565b80356001600160a01b03811681146109a157600080fd5b919050565b6000602082840312156109b857600080fd5b6109c18261098a565b9392505050565b600080604083850312156109db57600080fd5b6109e48361098a565b91506109f26020840161098a565b90509250929050565b600080600060608486031215610a1057600080fd5b610a198461098a565b9250610a276020850161098a565b9150604084013590509250925092565b60008060408385031215610a4a57600080fd5b610a538361098a565b946020939093013593505050565b600060208083528351808285015260005b81811015610a8e57858101830151858201604001528201610a72565b81811115610aa0576000604083870101525b50601f01601f1916929092016040019392505050565b60008219821115610ac957610ac9610b20565b500190565b600082821015610ae057610ae0610b20565b500390565b600181811c90821680610af957607f821691505b60208210811415610b1a57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052601160045260246000fdfea2646970667358221220963166e5b4960008cf94a9e8998f7d140e7ff41fa15559efa2a6fd93977fdf3e64736f6c63430008070033";

type TestTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestToken__factory extends ContractFactory {
  constructor(...args: TestTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    initialSupply: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TestToken> {
    return super.deploy(initialSupply, overrides || {}) as Promise<TestToken>;
  }
  override getDeployTransaction(
    initialSupply: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(initialSupply, overrides || {});
  }
  override attach(address: string): TestToken {
    return super.attach(address) as TestToken;
  }
  override connect(signer: Signer): TestToken__factory {
    return super.connect(signer) as TestToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestTokenInterface {
    return new utils.Interface(_abi) as TestTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestToken {
    return new Contract(address, _abi, signerOrProvider) as TestToken;
  }
}
