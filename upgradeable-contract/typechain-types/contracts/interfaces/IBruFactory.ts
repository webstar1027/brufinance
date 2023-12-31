/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export type PoolDetailsStruct = {
  poolName: PromiseOrValue<string>;
  poolTokenAddress: PromiseOrValue<string>;
  interestTokenAddress: PromiseOrValue<string>;
  proxyPoolAddress: PromiseOrValue<string>;
  implementationPoolAddress: PromiseOrValue<string>;
  treasuryAddress: PromiseOrValue<string>;
};

export type PoolDetailsStructOutput = [
  string,
  string,
  string,
  string,
  string,
  string
] & {
  poolName: string;
  poolTokenAddress: string;
  interestTokenAddress: string;
  proxyPoolAddress: string;
  implementationPoolAddress: string;
  treasuryAddress: string;
};

export interface IBruFactoryInterface extends utils.Interface {
  functions: {
    "addPoolDetails(string,address,address,address,address,address)": FunctionFragment;
    "getAllPoolDetails()": FunctionFragment;
    "getPoolAddress(uint256)": FunctionFragment;
    "getPoolDetails(uint256)": FunctionFragment;
    "initialize()": FunctionFragment;
    "upgradeImplementationContractAddress(uint256,address)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addPoolDetails"
      | "getAllPoolDetails"
      | "getPoolAddress"
      | "getPoolDetails"
      | "initialize"
      | "upgradeImplementationContractAddress"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addPoolDetails",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "getAllPoolDetails",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolAddress",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getPoolDetails",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeImplementationContractAddress",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;

  decodeFunctionResult(
    functionFragment: "addPoolDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAllPoolDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getPoolDetails",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "upgradeImplementationContractAddress",
    data: BytesLike
  ): Result;

  events: {
    "ImplementationContractUpgraded(uint256,address)": EventFragment;
    "ProxyPoolDeployed(string,address,address,address,address,address)": EventFragment;
  };

  getEvent(
    nameOrSignatureOrTopic: "ImplementationContractUpgraded"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ProxyPoolDeployed"): EventFragment;
}

export interface ImplementationContractUpgradedEventObject {
  poolIndex: BigNumber;
  implementationAddress: string;
}
export type ImplementationContractUpgradedEvent = TypedEvent<
  [BigNumber, string],
  ImplementationContractUpgradedEventObject
>;

export type ImplementationContractUpgradedEventFilter =
  TypedEventFilter<ImplementationContractUpgradedEvent>;

export interface ProxyPoolDeployedEventObject {
  poolName: string;
  poolTokenAddress: string;
  interestTokenAddress: string;
  proxyPoolAddress: string;
  implementationAddress: string;
  treasuryAddress: string;
}
export type ProxyPoolDeployedEvent = TypedEvent<
  [string, string, string, string, string, string],
  ProxyPoolDeployedEventObject
>;

export type ProxyPoolDeployedEventFilter =
  TypedEventFilter<ProxyPoolDeployedEvent>;

export interface IBruFactory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IBruFactoryInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    addPoolDetails(
      poolName: PromiseOrValue<string>,
      proxyPoolAddress: PromiseOrValue<string>,
      implementationAddress: PromiseOrValue<string>,
      poolTokenAddress: PromiseOrValue<string>,
      interestTokenAddress: PromiseOrValue<string>,
      treasuryAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getAllPoolDetails(
      overrides?: CallOverrides
    ): Promise<[PoolDetailsStructOutput[]]>;

    getPoolAddress(
      poolIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getPoolDetails(
      poolIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[PoolDetailsStructOutput]>;

    initialize(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    upgradeImplementationContractAddress(
      poolIndex: PromiseOrValue<BigNumberish>,
      implementationAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addPoolDetails(
    poolName: PromiseOrValue<string>,
    proxyPoolAddress: PromiseOrValue<string>,
    implementationAddress: PromiseOrValue<string>,
    poolTokenAddress: PromiseOrValue<string>,
    interestTokenAddress: PromiseOrValue<string>,
    treasuryAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getAllPoolDetails(
    overrides?: CallOverrides
  ): Promise<PoolDetailsStructOutput[]>;

  getPoolAddress(
    poolIndex: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  getPoolDetails(
    poolIndex: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<PoolDetailsStructOutput>;

  initialize(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  upgradeImplementationContractAddress(
    poolIndex: PromiseOrValue<BigNumberish>,
    implementationAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addPoolDetails(
      poolName: PromiseOrValue<string>,
      proxyPoolAddress: PromiseOrValue<string>,
      implementationAddress: PromiseOrValue<string>,
      poolTokenAddress: PromiseOrValue<string>,
      interestTokenAddress: PromiseOrValue<string>,
      treasuryAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    getAllPoolDetails(
      overrides?: CallOverrides
    ): Promise<PoolDetailsStructOutput[]>;

    getPoolAddress(
      poolIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    getPoolDetails(
      poolIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PoolDetailsStructOutput>;

    initialize(overrides?: CallOverrides): Promise<void>;

    upgradeImplementationContractAddress(
      poolIndex: PromiseOrValue<BigNumberish>,
      implementationAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "ImplementationContractUpgraded(uint256,address)"(
      poolIndex?: null,
      implementationAddress?: null
    ): ImplementationContractUpgradedEventFilter;
    ImplementationContractUpgraded(
      poolIndex?: null,
      implementationAddress?: null
    ): ImplementationContractUpgradedEventFilter;

    "ProxyPoolDeployed(string,address,address,address,address,address)"(
      poolName?: null,
      poolTokenAddress?: null,
      interestTokenAddress?: null,
      proxyPoolAddress?: null,
      implementationAddress?: null,
      treasuryAddress?: null
    ): ProxyPoolDeployedEventFilter;
    ProxyPoolDeployed(
      poolName?: null,
      poolTokenAddress?: null,
      interestTokenAddress?: null,
      proxyPoolAddress?: null,
      implementationAddress?: null,
      treasuryAddress?: null
    ): ProxyPoolDeployedEventFilter;
  };

  estimateGas: {
    addPoolDetails(
      poolName: PromiseOrValue<string>,
      proxyPoolAddress: PromiseOrValue<string>,
      implementationAddress: PromiseOrValue<string>,
      poolTokenAddress: PromiseOrValue<string>,
      interestTokenAddress: PromiseOrValue<string>,
      treasuryAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getAllPoolDetails(overrides?: CallOverrides): Promise<BigNumber>;

    getPoolAddress(
      poolIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPoolDetails(
      poolIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    initialize(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    upgradeImplementationContractAddress(
      poolIndex: PromiseOrValue<BigNumberish>,
      implementationAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addPoolDetails(
      poolName: PromiseOrValue<string>,
      proxyPoolAddress: PromiseOrValue<string>,
      implementationAddress: PromiseOrValue<string>,
      poolTokenAddress: PromiseOrValue<string>,
      interestTokenAddress: PromiseOrValue<string>,
      treasuryAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getAllPoolDetails(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getPoolAddress(
      poolIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPoolDetails(
      poolIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    initialize(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    upgradeImplementationContractAddress(
      poolIndex: PromiseOrValue<BigNumberish>,
      implementationAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
