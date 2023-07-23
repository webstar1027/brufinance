/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../common";
import type {
  BruFactory,
  BruFactoryInterface,
} from "../../../contracts/core/BruFactory";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "poolIndex",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "implementationAddress",
        type: "address",
      },
    ],
    name: "ImplementationContractUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "poolName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "poolTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "interestTokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "proxyPoolAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "implementationAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "treasuryAddress",
        type: "address",
      },
    ],
    name: "ProxyPoolDeployed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "poolName",
        type: "string",
      },
      {
        internalType: "address",
        name: "proxyPoolAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "implementationAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "poolTokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "interestTokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "treasuryAddress",
        type: "address",
      },
    ],
    name: "addPoolDetails",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllPoolDetails",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "poolName",
            type: "string",
          },
          {
            internalType: "address",
            name: "poolTokenAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "interestTokenAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "proxyPoolAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "implementationPoolAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "treasuryAddress",
            type: "address",
          },
        ],
        internalType: "struct PoolDetails[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolIndex",
        type: "uint256",
      },
    ],
    name: "getPoolAddress",
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
        internalType: "uint256",
        name: "poolIndex",
        type: "uint256",
      },
    ],
    name: "getPoolDetails",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "poolName",
            type: "string",
          },
          {
            internalType: "address",
            name: "poolTokenAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "interestTokenAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "proxyPoolAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "implementationPoolAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "treasuryAddress",
            type: "address",
          },
        ],
        internalType: "struct PoolDetails",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "poolIndex",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "newImplementationAddress",
        type: "address",
      },
    ],
    name: "upgradeImplementationContractAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newImplementation",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

const _bytecode =
  "0x60a06040523060601b60805234801561001757600080fd5b5060805160601c61147e610052600039600081816103aa015281816103ea015281816105e30152818161062301526106b6015261147e6000f3fe6080604052600436106100855760003560e01c80634f1ef286116100595780634f1ef2861461012b57806352d1902d1461013e578063650af55b146101615780638129fc1c14610181578063b8764c39146101a557600080fd5b8062a5ae211461008a578063271b07e5146100c75780633659cfe6146100e95780634bf487031461010b575b600080fd5b34801561009657600080fd5b506100aa6100a53660046110e9565b6101d2565b6040516001600160a01b0390911681526020015b60405180910390f35b3480156100d357600080fd5b506100dc610264565b6040516100be91906111dc565b3480156100f557600080fd5b50610109610104366004610fb0565b61039f565b005b34801561011757600080fd5b50610109610126366004611046565b61047f565b610109610139366004610fcb565b6105d8565b34801561014a57600080fd5b506101536106a9565b6040519081526020016100be565b34801561016d57600080fd5b5061010961017c366004611102565b61075c565b34801561018d57600080fd5b50610109600080546001600160a01b03191633179055565b3480156101b157600080fd5b506101c56101c03660046110e9565b6108d2565b6040516100be9190611336565b6003546000906101e490600190611349565b82111561022e5760405162461bcd60e51b8152602060048201526013602482015272141bdbdb08191bd95cc81b9bdd08195e1a5cdd606a1b60448201526064015b60405180910390fd5b60038281548110610241576102416113d5565b60009182526020909120600360069092020101546001600160a01b031692915050565b60606003805480602002602001604051908101604052809291908181526020016000905b8282101561039657838290600052602060002090600602016040518060c00160405290816000820180546102bb9061139a565b80601f01602080910402602001604051908101604052809291908181526020018280546102e79061139a565b80156103345780601f1061030957610100808354040283529160200191610334565b820191906000526020600020905b81548152906001019060200180831161031757829003601f168201915b50505091835250506001828101546001600160a01b039081166020808501919091526002850154821660408501526003850154821660608501526004850154821660808501526005909401541660a09092019190915291835292019101610288565b50505050905090565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156103e85760405162461bcd60e51b81526004016102259061129e565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316610431600080516020611402833981519152546001600160a01b031690565b6001600160a01b0316146104575760405162461bcd60e51b8152600401610225906112ea565b61046081610a63565b6040805160008082526020820190925261047c91839190610abd565b50565b6040805160c0810182528781526001600160a01b038086166020808401919091528582169383019390935287811660608301528681166080830152831660a08201526003805460018101825560009190915281518051929360069092027fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b019261050c9284920190610e85565b5060208201516001820180546001600160a01b03199081166001600160a01b03938416179091556040808501516002850180548416918516919091179055606085015160038501805484169185169190911790556080850151600485018054841691851691909117905560a0909401516005909301805490911692909116919091179055517ffbc09b8df7b3898f1cca5b5171086a40c816969e00cbb249c113cce143d9c3e6906105c8908890869086908a908a908890611251565b60405180910390a1505050505050565b306001600160a01b037f00000000000000000000000000000000000000000000000000000000000000001614156106215760405162461bcd60e51b81526004016102259061129e565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031661066a600080516020611402833981519152546001600160a01b031690565b6001600160a01b0316146106905760405162461bcd60e51b8152600401610225906112ea565b61069982610a63565b6106a582826001610abd565b5050565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146107495760405162461bcd60e51b815260206004820152603860248201527f555550535570677261646561626c653a206d757374206e6f742062652063616c60448201527f6c6564207468726f7567682064656c656761746563616c6c00000000000000006064820152608401610225565b5060008051602061140283398151915290565b6000546001600160a01b031633146107b65760405162461bcd60e51b815260206004820152601960248201527f43616e2062652075736564206f6e6c792062792061646d696e000000000000006044820152606401610225565b6000600383815481106107cb576107cb6113d5565b906000526020600020906006020160030160009054906101000a90046001600160a01b031690508160038481548110610806576108066113d5565b60009182526020909120600690910201600490810180546001600160a01b0319166001600160a01b03938416179055604051631b2ce7f360e11b81528483169181019190915290821690633659cfe690602401600060405180830381600087803b15801561087357600080fd5b505af1158015610887573d6000803e3d6000fd5b5050604080518681526001600160a01b03861660208201527f328606f54a99f9496e292013b9695b31c172d9bee688bfa1948d612afb51af38935001905060405180910390a1505050565b6040805160c081018252606080825260006020830181905292820183905281018290526080810182905260a081019190915260035461091390600190611349565b8211156109585760405162461bcd60e51b8152602060048201526013602482015272141bdbdb08191bd95cc81b9bdd08195e1a5cdd606a1b6044820152606401610225565b6003828154811061096b5761096b6113d5565b90600052602060002090600602016040518060c00160405290816000820180546109949061139a565b80601f01602080910402602001604051908101604052809291908181526020018280546109c09061139a565b8015610a0d5780601f106109e257610100808354040283529160200191610a0d565b820191906000526020600020905b8154815290600101906020018083116109f057829003601f168201915b505050918352505060018201546001600160a01b03908116602083015260028301548116604083015260038301548116606083015260048301548116608083015260059092015490911660a09091015292915050565b6000546001600160a01b0316331461047c5760405162461bcd60e51b815260206004820152601c60248201527f4f6e6c7920666163746f7279206164647265737320616c6c6f776564000000006044820152606401610225565b7f4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd91435460ff1615610af557610af083610c3c565b505050565b826001600160a01b03166352d1902d6040518163ffffffff1660e01b815260040160206040518083038186803b158015610b2e57600080fd5b505afa925050508015610b5e575060408051601f3d908101601f19168201909252610b5b9181019061102d565b60015b610bc15760405162461bcd60e51b815260206004820152602e60248201527f45524331393637557067726164653a206e657720696d706c656d656e7461746960448201526d6f6e206973206e6f74205555505360901b6064820152608401610225565b6000805160206114028339815191528114610c305760405162461bcd60e51b815260206004820152602960248201527f45524331393637557067726164653a20756e737570706f727465642070726f786044820152681a58589b195555525160ba1b6064820152608401610225565b50610af0838383610cd8565b6001600160a01b0381163b610ca95760405162461bcd60e51b815260206004820152602d60248201527f455243313936373a206e657720696d706c656d656e746174696f6e206973206e60448201526c1bdd08184818dbdb9d1c9858dd609a1b6064820152608401610225565b60008051602061140283398151915280546001600160a01b0319166001600160a01b0392909216919091179055565b610ce183610d03565b600082511180610cee5750805b15610af057610cfd8383610d43565b50505050565b610d0c81610c3c565b6040516001600160a01b038216907fbc7cd75a20ee27fd9adebab32041f755214dbc6bffa90cc0225b39da2e5c2d3b90600090a250565b6060610d68838360405180606001604052806027815260200161142260279139610d6f565b9392505050565b60606001600160a01b0384163b610dd75760405162461bcd60e51b815260206004820152602660248201527f416464726573733a2064656c65676174652063616c6c20746f206e6f6e2d636f6044820152651b9d1c9858dd60d21b6064820152608401610225565b600080856001600160a01b031685604051610df291906111c0565b600060405180830381855af49150503d8060008114610e2d576040519150601f19603f3d011682016040523d82523d6000602084013e610e32565b606091505b5091509150610e42828286610e4c565b9695505050505050565b60608315610e5b575081610d68565b825115610e6b5782518084602001fd5b8160405162461bcd60e51b8152600401610225919061123e565b828054610e919061139a565b90600052602060002090601f016020900481019282610eb35760008555610ef9565b82601f10610ecc57805160ff1916838001178555610ef9565b82800160010185558215610ef9579182015b82811115610ef9578251825591602001919060010190610ede565b50610f05929150610f09565b5090565b5b80821115610f055760008155600101610f0a565b600067ffffffffffffffff80841115610f3957610f396113eb565b604051601f8501601f19908116603f01168101908282118183101715610f6157610f616113eb565b81604052809350858152868686011115610f7a57600080fd5b858560208301376000602087830101525050509392505050565b80356001600160a01b0381168114610fab57600080fd5b919050565b600060208284031215610fc257600080fd5b610d6882610f94565b60008060408385031215610fde57600080fd5b610fe783610f94565b9150602083013567ffffffffffffffff81111561100357600080fd5b8301601f8101851361101457600080fd5b61102385823560208401610f1e565b9150509250929050565b60006020828403121561103f57600080fd5b5051919050565b60008060008060008060c0878903121561105f57600080fd5b863567ffffffffffffffff81111561107657600080fd5b8701601f8101891361108757600080fd5b61109689823560208401610f1e565b9650506110a560208801610f94565b94506110b360408801610f94565b93506110c160608801610f94565b92506110cf60808801610f94565b91506110dd60a08801610f94565b90509295509295509295565b6000602082840312156110fb57600080fd5b5035919050565b6000806040838503121561111557600080fd5b8235915061112560208401610f94565b90509250929050565b6000815180845261114681602086016020860161136e565b601f01601f19169290920160200192915050565b6000815160c0845261116f60c085018261112e565b6020848101516001600160a01b039081169187019190915260408086015182169087015260608086015182169087015260808086015182169087015260a09485015116949093019390935250919050565b600082516111d281846020870161136e565b9190910192915050565b6000602080830181845280855180835260408601915060408160051b870101925083870160005b8281101561123157603f1988860301845261121f85835161115a565b94509285019290850190600101611203565b5092979650505050505050565b602081526000610d68602083018461112e565b60c08152600061126460c083018961112e565b6001600160a01b0397881660208401529587166040830152509285166060840152908416608083015290921660a090920191909152919050565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b19195b1959d85d1958d85b1b60a21b606082015260800190565b6020808252602c908201527f46756e6374696f6e206d7573742062652063616c6c6564207468726f7567682060408201526b6163746976652070726f787960a01b606082015260800190565b602081526000610d68602083018461115a565b60008282101561136957634e487b7160e01b600052601160045260246000fd5b500390565b60005b83811015611389578181015183820152602001611371565b83811115610cfd5750506000910152565b600181811c908216806113ae57607f821691505b602082108114156113cf57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052604160045260246000fdfe360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc416464726573733a206c6f772d6c6576656c2064656c65676174652063616c6c206661696c6564a264697066735822122039fe07077461cd3a7b05488a76ffd079c12cd84ac62dc90bdd45003f4c74a87264736f6c63430008070033";

type BruFactoryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BruFactoryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class BruFactory__factory extends ContractFactory {
  constructor(...args: BruFactoryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<BruFactory> {
    return super.deploy(overrides || {}) as Promise<BruFactory>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): BruFactory {
    return super.attach(address) as BruFactory;
  }
  override connect(signer: Signer): BruFactory__factory {
    return super.connect(signer) as BruFactory__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BruFactoryInterface {
    return new utils.Interface(_abi) as BruFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BruFactory {
    return new Contract(address, _abi, signerOrProvider) as BruFactory;
  }
}