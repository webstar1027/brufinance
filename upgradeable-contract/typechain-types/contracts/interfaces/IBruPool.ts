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

export interface IBruPoolInterface extends utils.Interface {
  functions: {
    "addEndOfDayBalance()": FunctionFragment;
    "borrow(address,string,address,uint256)": FunctionFragment;
    "deposit(address,address,uint256)": FunctionFragment;
    "depositInterestForAll()": FunctionFragment;
    "initialize(address,address,address,address,address,string)": FunctionFragment;
    "mintNft(uint256,string,string,uint256,uint256,string,string)": FunctionFragment;
    "name()": FunctionFragment;
    "repay(address,string,uint256,address)": FunctionFragment;
    "transferBond(address,address,uint256)": FunctionFragment;
    "withdraw(address,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addEndOfDayBalance"
      | "borrow"
      | "deposit"
      | "depositInterestForAll"
      | "initialize"
      | "mintNft"
      | "name"
      | "repay"
      | "transferBond"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addEndOfDayBalance",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "borrow",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "deposit",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "depositInterestForAll",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialize",
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
    functionFragment: "mintNft",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "repay",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transferBond",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "addEndOfDayBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "borrow", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "deposit", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "depositInterestForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "initialize", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mintNft", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "repay", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferBond",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "BorrowEvent(int8,address,uint256,uint256)": EventFragment;
    "LendEvent(int8,address,uint256,uint256)": EventFragment;
    "RepayEvent(int8,address,uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "BorrowEvent"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "LendEvent"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RepayEvent"): EventFragment;
}

export interface BorrowEventEventObject {
  _type: number;
  userAddress: string;
  timestamp: BigNumber;
  tokenAmount: BigNumber;
}
export type BorrowEventEvent = TypedEvent<
  [number, string, BigNumber, BigNumber],
  BorrowEventEventObject
>;

export type BorrowEventEventFilter = TypedEventFilter<BorrowEventEvent>;

export interface LendEventEventObject {
  _type: number;
  userAddress: string;
  timestamp: BigNumber;
  tokenAmount: BigNumber;
}
export type LendEventEvent = TypedEvent<
  [number, string, BigNumber, BigNumber],
  LendEventEventObject
>;

export type LendEventEventFilter = TypedEventFilter<LendEventEvent>;

export interface RepayEventEventObject {
  _type: number;
  userAddress: string;
  timestamp: BigNumber;
  tokenAmount: BigNumber;
}
export type RepayEventEvent = TypedEvent<
  [number, string, BigNumber, BigNumber],
  RepayEventEventObject
>;

export type RepayEventEventFilter = TypedEventFilter<RepayEventEvent>;

export interface IBruPool extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IBruPoolInterface;

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
    addEndOfDayBalance(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    borrow(
      userAddress: PromiseOrValue<string>,
      nftId: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    deposit(
      userAddress: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    depositInterestForAll(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    initialize(
      adminAddress: PromiseOrValue<string>,
      factoryAddress: PromiseOrValue<string>,
      poolTokenAddress: PromiseOrValue<string>,
      interestTokenAddress: PromiseOrValue<string>,
      treasuyAddress: PromiseOrValue<string>,
      poolName: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    mintNft(
      tokenId: PromiseOrValue<BigNumberish>,
      nftId: PromiseOrValue<string>,
      commodityId: PromiseOrValue<string>,
      quantity: PromiseOrValue<BigNumberish>,
      nftValue: PromiseOrValue<BigNumberish>,
      dataHash: PromiseOrValue<string>,
      nftData: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    name(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    repay(
      userAddress: PromiseOrValue<string>,
      nftId: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferBond(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      userAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addEndOfDayBalance(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  borrow(
    userAddress: PromiseOrValue<string>,
    nftId: PromiseOrValue<string>,
    tokenAddress: PromiseOrValue<string>,
    tokenAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  deposit(
    userAddress: PromiseOrValue<string>,
    tokenAddress: PromiseOrValue<string>,
    tokenAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  depositInterestForAll(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  initialize(
    adminAddress: PromiseOrValue<string>,
    factoryAddress: PromiseOrValue<string>,
    poolTokenAddress: PromiseOrValue<string>,
    interestTokenAddress: PromiseOrValue<string>,
    treasuyAddress: PromiseOrValue<string>,
    poolName: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  mintNft(
    tokenId: PromiseOrValue<BigNumberish>,
    nftId: PromiseOrValue<string>,
    commodityId: PromiseOrValue<string>,
    quantity: PromiseOrValue<BigNumberish>,
    nftValue: PromiseOrValue<BigNumberish>,
    dataHash: PromiseOrValue<string>,
    nftData: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  name(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  repay(
    userAddress: PromiseOrValue<string>,
    nftId: PromiseOrValue<string>,
    tokenAmount: PromiseOrValue<BigNumberish>,
    tokenAddress: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferBond(
    from: PromiseOrValue<string>,
    to: PromiseOrValue<string>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    userAddress: PromiseOrValue<string>,
    tokenAmount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addEndOfDayBalance(overrides?: CallOverrides): Promise<void>;

    borrow(
      userAddress: PromiseOrValue<string>,
      nftId: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    deposit(
      userAddress: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    depositInterestForAll(overrides?: CallOverrides): Promise<void>;

    initialize(
      adminAddress: PromiseOrValue<string>,
      factoryAddress: PromiseOrValue<string>,
      poolTokenAddress: PromiseOrValue<string>,
      interestTokenAddress: PromiseOrValue<string>,
      treasuyAddress: PromiseOrValue<string>,
      poolName: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    mintNft(
      tokenId: PromiseOrValue<BigNumberish>,
      nftId: PromiseOrValue<string>,
      commodityId: PromiseOrValue<string>,
      quantity: PromiseOrValue<BigNumberish>,
      nftValue: PromiseOrValue<BigNumberish>,
      dataHash: PromiseOrValue<string>,
      nftData: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    name(overrides?: CallOverrides): Promise<string>;

    repay(
      userAddress: PromiseOrValue<string>,
      nftId: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferBond(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    withdraw(
      userAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "BorrowEvent(int8,address,uint256,uint256)"(
      _type?: null,
      userAddress?: PromiseOrValue<string> | null,
      timestamp?: PromiseOrValue<BigNumberish> | null,
      tokenAmount?: null
    ): BorrowEventEventFilter;
    BorrowEvent(
      _type?: null,
      userAddress?: PromiseOrValue<string> | null,
      timestamp?: PromiseOrValue<BigNumberish> | null,
      tokenAmount?: null
    ): BorrowEventEventFilter;

    "LendEvent(int8,address,uint256,uint256)"(
      _type?: null,
      userAddress?: PromiseOrValue<string> | null,
      timestamp?: PromiseOrValue<BigNumberish> | null,
      tokenAmount?: null
    ): LendEventEventFilter;
    LendEvent(
      _type?: null,
      userAddress?: PromiseOrValue<string> | null,
      timestamp?: PromiseOrValue<BigNumberish> | null,
      tokenAmount?: null
    ): LendEventEventFilter;

    "RepayEvent(int8,address,uint256,uint256)"(
      _type?: null,
      userAddress?: PromiseOrValue<string> | null,
      timestamp?: PromiseOrValue<BigNumberish> | null,
      tokenAmount?: null
    ): RepayEventEventFilter;
    RepayEvent(
      _type?: null,
      userAddress?: PromiseOrValue<string> | null,
      timestamp?: PromiseOrValue<BigNumberish> | null,
      tokenAmount?: null
    ): RepayEventEventFilter;
  };

  estimateGas: {
    addEndOfDayBalance(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    borrow(
      userAddress: PromiseOrValue<string>,
      nftId: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    deposit(
      userAddress: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    depositInterestForAll(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    initialize(
      adminAddress: PromiseOrValue<string>,
      factoryAddress: PromiseOrValue<string>,
      poolTokenAddress: PromiseOrValue<string>,
      interestTokenAddress: PromiseOrValue<string>,
      treasuyAddress: PromiseOrValue<string>,
      poolName: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    mintNft(
      tokenId: PromiseOrValue<BigNumberish>,
      nftId: PromiseOrValue<string>,
      commodityId: PromiseOrValue<string>,
      quantity: PromiseOrValue<BigNumberish>,
      nftValue: PromiseOrValue<BigNumberish>,
      dataHash: PromiseOrValue<string>,
      nftData: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    name(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    repay(
      userAddress: PromiseOrValue<string>,
      nftId: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferBond(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdraw(
      userAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addEndOfDayBalance(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    borrow(
      userAddress: PromiseOrValue<string>,
      nftId: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    deposit(
      userAddress: PromiseOrValue<string>,
      tokenAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    depositInterestForAll(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    initialize(
      adminAddress: PromiseOrValue<string>,
      factoryAddress: PromiseOrValue<string>,
      poolTokenAddress: PromiseOrValue<string>,
      interestTokenAddress: PromiseOrValue<string>,
      treasuyAddress: PromiseOrValue<string>,
      poolName: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    mintNft(
      tokenId: PromiseOrValue<BigNumberish>,
      nftId: PromiseOrValue<string>,
      commodityId: PromiseOrValue<string>,
      quantity: PromiseOrValue<BigNumberish>,
      nftValue: PromiseOrValue<BigNumberish>,
      dataHash: PromiseOrValue<string>,
      nftData: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    name(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    repay(
      userAddress: PromiseOrValue<string>,
      nftId: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      tokenAddress: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferBond(
      from: PromiseOrValue<string>,
      to: PromiseOrValue<string>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      userAddress: PromiseOrValue<string>,
      tokenAmount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
