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
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

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

export interface BruRouterInterface extends utils.Interface {
  functions: {
    "borrow(uint256,string,address,uint256)": FunctionFragment;
    "deposit(uint256,address,uint256)": FunctionFragment;
    "getAllPoolDetails()": FunctionFragment;
    "getPoolAddress(uint256)": FunctionFragment;
    "getPoolDetails(uint256)": FunctionFragment;
    "repay(uint256,string,address,uint256)": FunctionFragment;
    "withdraw(uint256,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "borrow"
      | "deposit"
      | "getAllPoolDetails"
      | "getPoolAddress"
      | "getPoolDetails"
      | "repay"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "borrow",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
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
    functionFragment: "repay",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(functionFragment: "borrow", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
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
  decodeFunctionResult(functionFragment: "repay", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {};
}

export interface BruRouter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: BruRouterInterface;

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
    borrow(
      poolIndex: PromiseOrValue<BigNumberish>,
      nftId: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    deposit(
      poolIndex: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
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

    repay(
      poolIndex: PromiseOrValue<BigNumberish>,
      nftId: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      poolIndex: PromiseOrValue<BigNumberish>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  borrow(
    poolIndex: PromiseOrValue<BigNumberish>,
    nftId: PromiseOrValue<string>,
    tokenAddress: PromiseOrValue<string>,
    tokenAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  deposit(
    poolIndex: PromiseOrValue<BigNumberish>,
    tokenAddress: PromiseOrValue<string>,
    tokenAmount: PromiseOrValue<BigNumberish>,
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

  repay(
    poolIndex: PromiseOrValue<BigNumberish>,
    nftId: PromiseOrValue<string>,
    tokenAddress: PromiseOrValue<string>,
    tokenAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    poolIndex: PromiseOrValue<BigNumberish>,
    tokenAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    borrow(
      poolIndex: PromiseOrValue<BigNumberish>,
      nftId: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    deposit(
      poolIndex: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
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

    repay(
      poolIndex: PromiseOrValue<BigNumberish>,
      nftId: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    withdraw(
      poolIndex: PromiseOrValue<BigNumberish>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    borrow(
      poolIndex: PromiseOrValue<BigNumberish>,
      nftId: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    deposit(
      poolIndex: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
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

    repay(
      poolIndex: PromiseOrValue<BigNumberish>,
      nftId: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdraw(
      poolIndex: PromiseOrValue<BigNumberish>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    borrow(
      poolIndex: PromiseOrValue<BigNumberish>,
      nftId: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    deposit(
      poolIndex: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
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

    repay(
      poolIndex: PromiseOrValue<BigNumberish>,
      nftId: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      poolIndex: PromiseOrValue<BigNumberish>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}