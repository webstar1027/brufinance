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

export declare namespace TokenVestingBru {
  export type VestingScheduleStruct = {
    initialized: PromiseOrValue<boolean>;
    beneficiary: PromiseOrValue<string>;
    cliff: PromiseOrValue<BigNumberish>;
    start: PromiseOrValue<BigNumberish>;
    duration: PromiseOrValue<BigNumberish>;
    slicePeriodSeconds: PromiseOrValue<BigNumberish>;
    revocable: PromiseOrValue<boolean>;
    amountTotal: PromiseOrValue<BigNumberish>;
    released: PromiseOrValue<BigNumberish>;
    revoked: PromiseOrValue<boolean>;
  };

  export type VestingScheduleStructOutput = [
    boolean,
    string,
    BigNumber,
    BigNumber,
    BigNumber,
    BigNumber,
    boolean,
    BigNumber,
    BigNumber,
    boolean
  ] & {
    initialized: boolean;
    beneficiary: string;
    cliff: BigNumber;
    start: BigNumber;
    duration: BigNumber;
    slicePeriodSeconds: BigNumber;
    revocable: boolean;
    amountTotal: BigNumber;
    released: BigNumber;
    revoked: boolean;
  };
}

export interface TokenVestingBruInterface extends utils.Interface {
  functions: {
    "addAddressToCategory(address,uint256)": FunctionFragment;
    "addtokenDistribution(uint256,uint256)": FunctionFragment;
    "categoryIdMapping(string)": FunctionFragment;
    "categoryMapping(uint256)": FunctionFragment;
    "computeNextVestingScheduleIdForHolder(address)": FunctionFragment;
    "computeReleasableAmount(bytes32)": FunctionFragment;
    "computeVestingScheduleIdForAddressAndIndex(address,uint256)": FunctionFragment;
    "createVestingSchedule(address,uint256,uint256,uint256,uint256,bool,uint256)": FunctionFragment;
    "createVestingScheduleForCategory(uint256,uint256,address)": FunctionFragment;
    "distributionMapping(uint256)": FunctionFragment;
    "existsMapping(uint256)": FunctionFragment;
    "getLastVestingScheduleForHolder(address)": FunctionFragment;
    "getToken()": FunctionFragment;
    "getVestingIdAtIndex(uint256)": FunctionFragment;
    "getVestingSchedule(bytes32)": FunctionFragment;
    "getVestingScheduleByAddressAndIndex(address,uint256)": FunctionFragment;
    "getVestingSchedulesCount()": FunctionFragment;
    "getVestingSchedulesCountByBeneficiary(address)": FunctionFragment;
    "getVestingSchedulesTotalAmount()": FunctionFragment;
    "getWithdrawableAmount()": FunctionFragment;
    "owner()": FunctionFragment;
    "release(bytes32,uint256)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "revoke(bytes32)": FunctionFragment;
    "setCategoryParams(uint256,string,address[],uint256,uint256,uint256,bool)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "withdraw(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "addAddressToCategory"
      | "addtokenDistribution"
      | "categoryIdMapping"
      | "categoryMapping"
      | "computeNextVestingScheduleIdForHolder"
      | "computeReleasableAmount"
      | "computeVestingScheduleIdForAddressAndIndex"
      | "createVestingSchedule"
      | "createVestingScheduleForCategory"
      | "distributionMapping"
      | "existsMapping"
      | "getLastVestingScheduleForHolder"
      | "getToken"
      | "getVestingIdAtIndex"
      | "getVestingSchedule"
      | "getVestingScheduleByAddressAndIndex"
      | "getVestingSchedulesCount"
      | "getVestingSchedulesCountByBeneficiary"
      | "getVestingSchedulesTotalAmount"
      | "getWithdrawableAmount"
      | "owner"
      | "release"
      | "renounceOwnership"
      | "revoke"
      | "setCategoryParams"
      | "transferOwnership"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addAddressToCategory",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "addtokenDistribution",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "categoryIdMapping",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "categoryMapping",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "computeNextVestingScheduleIdForHolder",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "computeReleasableAmount",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "computeVestingScheduleIdForAddressAndIndex",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "createVestingSchedule",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "createVestingScheduleForCategory",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "distributionMapping",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "existsMapping",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getLastVestingScheduleForHolder",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(functionFragment: "getToken", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getVestingIdAtIndex",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getVestingSchedule",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "getVestingScheduleByAddressAndIndex",
    values: [PromiseOrValue<string>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getVestingSchedulesCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getVestingSchedulesCountByBeneficiary",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "getVestingSchedulesTotalAmount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getWithdrawableAmount",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "release",
    values: [PromiseOrValue<BytesLike>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "revoke",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "setCategoryParams",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>,
      PromiseOrValue<string>[],
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<boolean>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "addAddressToCategory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addtokenDistribution",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "categoryIdMapping",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "categoryMapping",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "computeNextVestingScheduleIdForHolder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "computeReleasableAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "computeVestingScheduleIdForAddressAndIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createVestingSchedule",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "createVestingScheduleForCategory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "distributionMapping",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "existsMapping",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getLastVestingScheduleForHolder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getVestingIdAtIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVestingSchedule",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVestingScheduleByAddressAndIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVestingSchedulesCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVestingSchedulesCountByBeneficiary",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getVestingSchedulesTotalAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getWithdrawableAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "release", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revoke", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setCategoryParams",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "Released(uint256)": EventFragment;
    "Revoked()": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Released"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Revoked"): EventFragment;
}

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface ReleasedEventObject {
  amount: BigNumber;
}
export type ReleasedEvent = TypedEvent<[BigNumber], ReleasedEventObject>;

export type ReleasedEventFilter = TypedEventFilter<ReleasedEvent>;

export interface RevokedEventObject {}
export type RevokedEvent = TypedEvent<[], RevokedEventObject>;

export type RevokedEventFilter = TypedEventFilter<RevokedEvent>;

export interface TokenVestingBru extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: TokenVestingBruInterface;

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
    addAddressToCategory(
      walletAddress: PromiseOrValue<string>,
      _categoryId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addtokenDistribution(
      _categoryId: PromiseOrValue<BigNumberish>,
      _tokenPercentage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    categoryIdMapping(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    categoryMapping(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, BigNumber, BigNumber, BigNumber, boolean] & {
        categoryId: BigNumber;
        categoryName: string;
        cliff: BigNumber;
        duration: BigNumber;
        slicePeriodSeconds: BigNumber;
        revocable: boolean;
      }
    >;

    computeNextVestingScheduleIdForHolder(
      holder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    computeReleasableAmount(
      vestingScheduleId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    computeVestingScheduleIdForAddressAndIndex(
      holder: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    createVestingSchedule(
      _beneficiary: PromiseOrValue<string>,
      _start: PromiseOrValue<BigNumberish>,
      _cliff: PromiseOrValue<BigNumberish>,
      _duration: PromiseOrValue<BigNumberish>,
      _slicePeriodSeconds: PromiseOrValue<BigNumberish>,
      _revocable: PromiseOrValue<boolean>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    createVestingScheduleForCategory(
      _amount: PromiseOrValue<BigNumberish>,
      _start: PromiseOrValue<BigNumberish>,
      _beneficiary: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    distributionMapping(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        tokenAmountleft: BigNumber;
        tokenPercentage: BigNumber;
      }
    >;

    existsMapping(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    getLastVestingScheduleForHolder(
      holder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[TokenVestingBru.VestingScheduleStructOutput]>;

    getToken(overrides?: CallOverrides): Promise<[string]>;

    getVestingIdAtIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getVestingSchedule(
      vestingScheduleId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<[TokenVestingBru.VestingScheduleStructOutput]>;

    getVestingScheduleByAddressAndIndex(
      holder: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[TokenVestingBru.VestingScheduleStructOutput]>;

    getVestingSchedulesCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    getVestingSchedulesCountByBeneficiary(
      _beneficiary: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getVestingSchedulesTotalAmount(
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getWithdrawableAmount(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    release(
      vestingScheduleId: PromiseOrValue<BytesLike>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    revoke(
      vestingScheduleId: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setCategoryParams(
      CategoryId: PromiseOrValue<BigNumberish>,
      categoryName: PromiseOrValue<string>,
      memberAddresses: PromiseOrValue<string>[],
      cliff: PromiseOrValue<BigNumberish>,
      duration: PromiseOrValue<BigNumberish>,
      slicePeriodSeconds: PromiseOrValue<BigNumberish>,
      revocable: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  addAddressToCategory(
    walletAddress: PromiseOrValue<string>,
    _categoryId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addtokenDistribution(
    _categoryId: PromiseOrValue<BigNumberish>,
    _tokenPercentage: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  categoryIdMapping(
    arg0: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  categoryMapping(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, string, BigNumber, BigNumber, BigNumber, boolean] & {
      categoryId: BigNumber;
      categoryName: string;
      cliff: BigNumber;
      duration: BigNumber;
      slicePeriodSeconds: BigNumber;
      revocable: boolean;
    }
  >;

  computeNextVestingScheduleIdForHolder(
    holder: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<string>;

  computeReleasableAmount(
    vestingScheduleId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  computeVestingScheduleIdForAddressAndIndex(
    holder: PromiseOrValue<string>,
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  createVestingSchedule(
    _beneficiary: PromiseOrValue<string>,
    _start: PromiseOrValue<BigNumberish>,
    _cliff: PromiseOrValue<BigNumberish>,
    _duration: PromiseOrValue<BigNumberish>,
    _slicePeriodSeconds: PromiseOrValue<BigNumberish>,
    _revocable: PromiseOrValue<boolean>,
    _amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  createVestingScheduleForCategory(
    _amount: PromiseOrValue<BigNumberish>,
    _start: PromiseOrValue<BigNumberish>,
    _beneficiary: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  distributionMapping(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & {
      tokenAmountleft: BigNumber;
      tokenPercentage: BigNumber;
    }
  >;

  existsMapping(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<boolean>;

  getLastVestingScheduleForHolder(
    holder: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<TokenVestingBru.VestingScheduleStructOutput>;

  getToken(overrides?: CallOverrides): Promise<string>;

  getVestingIdAtIndex(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  getVestingSchedule(
    vestingScheduleId: PromiseOrValue<BytesLike>,
    overrides?: CallOverrides
  ): Promise<TokenVestingBru.VestingScheduleStructOutput>;

  getVestingScheduleByAddressAndIndex(
    holder: PromiseOrValue<string>,
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<TokenVestingBru.VestingScheduleStructOutput>;

  getVestingSchedulesCount(overrides?: CallOverrides): Promise<BigNumber>;

  getVestingSchedulesCountByBeneficiary(
    _beneficiary: PromiseOrValue<string>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getVestingSchedulesTotalAmount(overrides?: CallOverrides): Promise<BigNumber>;

  getWithdrawableAmount(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  release(
    vestingScheduleId: PromiseOrValue<BytesLike>,
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  revoke(
    vestingScheduleId: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setCategoryParams(
    CategoryId: PromiseOrValue<BigNumberish>,
    categoryName: PromiseOrValue<string>,
    memberAddresses: PromiseOrValue<string>[],
    cliff: PromiseOrValue<BigNumberish>,
    duration: PromiseOrValue<BigNumberish>,
    slicePeriodSeconds: PromiseOrValue<BigNumberish>,
    revocable: PromiseOrValue<boolean>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    amount: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    addAddressToCategory(
      walletAddress: PromiseOrValue<string>,
      _categoryId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    addtokenDistribution(
      _categoryId: PromiseOrValue<BigNumberish>,
      _tokenPercentage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    categoryIdMapping(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    categoryMapping(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, string, BigNumber, BigNumber, BigNumber, boolean] & {
        categoryId: BigNumber;
        categoryName: string;
        cliff: BigNumber;
        duration: BigNumber;
        slicePeriodSeconds: BigNumber;
        revocable: boolean;
      }
    >;

    computeNextVestingScheduleIdForHolder(
      holder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<string>;

    computeReleasableAmount(
      vestingScheduleId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    computeVestingScheduleIdForAddressAndIndex(
      holder: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    createVestingSchedule(
      _beneficiary: PromiseOrValue<string>,
      _start: PromiseOrValue<BigNumberish>,
      _cliff: PromiseOrValue<BigNumberish>,
      _duration: PromiseOrValue<BigNumberish>,
      _slicePeriodSeconds: PromiseOrValue<BigNumberish>,
      _revocable: PromiseOrValue<boolean>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    createVestingScheduleForCategory(
      _amount: PromiseOrValue<BigNumberish>,
      _start: PromiseOrValue<BigNumberish>,
      _beneficiary: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    distributionMapping(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & {
        tokenAmountleft: BigNumber;
        tokenPercentage: BigNumber;
      }
    >;

    existsMapping(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<boolean>;

    getLastVestingScheduleForHolder(
      holder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<TokenVestingBru.VestingScheduleStructOutput>;

    getToken(overrides?: CallOverrides): Promise<string>;

    getVestingIdAtIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    getVestingSchedule(
      vestingScheduleId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<TokenVestingBru.VestingScheduleStructOutput>;

    getVestingScheduleByAddressAndIndex(
      holder: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<TokenVestingBru.VestingScheduleStructOutput>;

    getVestingSchedulesCount(overrides?: CallOverrides): Promise<BigNumber>;

    getVestingSchedulesCountByBeneficiary(
      _beneficiary: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getVestingSchedulesTotalAmount(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getWithdrawableAmount(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    release(
      vestingScheduleId: PromiseOrValue<BytesLike>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    revoke(
      vestingScheduleId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    setCategoryParams(
      CategoryId: PromiseOrValue<BigNumberish>,
      categoryName: PromiseOrValue<string>,
      memberAddresses: PromiseOrValue<string>[],
      cliff: PromiseOrValue<BigNumberish>,
      duration: PromiseOrValue<BigNumberish>,
      slicePeriodSeconds: PromiseOrValue<BigNumberish>,
      revocable: PromiseOrValue<boolean>,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    withdraw(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "Released(uint256)"(amount?: null): ReleasedEventFilter;
    Released(amount?: null): ReleasedEventFilter;

    "Revoked()"(): RevokedEventFilter;
    Revoked(): RevokedEventFilter;
  };

  estimateGas: {
    addAddressToCategory(
      walletAddress: PromiseOrValue<string>,
      _categoryId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addtokenDistribution(
      _categoryId: PromiseOrValue<BigNumberish>,
      _tokenPercentage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    categoryIdMapping(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    categoryMapping(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    computeNextVestingScheduleIdForHolder(
      holder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    computeReleasableAmount(
      vestingScheduleId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    computeVestingScheduleIdForAddressAndIndex(
      holder: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    createVestingSchedule(
      _beneficiary: PromiseOrValue<string>,
      _start: PromiseOrValue<BigNumberish>,
      _cliff: PromiseOrValue<BigNumberish>,
      _duration: PromiseOrValue<BigNumberish>,
      _slicePeriodSeconds: PromiseOrValue<BigNumberish>,
      _revocable: PromiseOrValue<boolean>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    createVestingScheduleForCategory(
      _amount: PromiseOrValue<BigNumberish>,
      _start: PromiseOrValue<BigNumberish>,
      _beneficiary: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    distributionMapping(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    existsMapping(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getLastVestingScheduleForHolder(
      holder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getToken(overrides?: CallOverrides): Promise<BigNumber>;

    getVestingIdAtIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getVestingSchedule(
      vestingScheduleId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getVestingScheduleByAddressAndIndex(
      holder: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getVestingSchedulesCount(overrides?: CallOverrides): Promise<BigNumber>;

    getVestingSchedulesCountByBeneficiary(
      _beneficiary: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getVestingSchedulesTotalAmount(
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getWithdrawableAmount(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    release(
      vestingScheduleId: PromiseOrValue<BytesLike>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    revoke(
      vestingScheduleId: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setCategoryParams(
      CategoryId: PromiseOrValue<BigNumberish>,
      categoryName: PromiseOrValue<string>,
      memberAddresses: PromiseOrValue<string>[],
      cliff: PromiseOrValue<BigNumberish>,
      duration: PromiseOrValue<BigNumberish>,
      slicePeriodSeconds: PromiseOrValue<BigNumberish>,
      revocable: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdraw(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    addAddressToCategory(
      walletAddress: PromiseOrValue<string>,
      _categoryId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addtokenDistribution(
      _categoryId: PromiseOrValue<BigNumberish>,
      _tokenPercentage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    categoryIdMapping(
      arg0: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    categoryMapping(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    computeNextVestingScheduleIdForHolder(
      holder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    computeReleasableAmount(
      vestingScheduleId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    computeVestingScheduleIdForAddressAndIndex(
      holder: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    createVestingSchedule(
      _beneficiary: PromiseOrValue<string>,
      _start: PromiseOrValue<BigNumberish>,
      _cliff: PromiseOrValue<BigNumberish>,
      _duration: PromiseOrValue<BigNumberish>,
      _slicePeriodSeconds: PromiseOrValue<BigNumberish>,
      _revocable: PromiseOrValue<boolean>,
      _amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    createVestingScheduleForCategory(
      _amount: PromiseOrValue<BigNumberish>,
      _start: PromiseOrValue<BigNumberish>,
      _beneficiary: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    distributionMapping(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    existsMapping(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getLastVestingScheduleForHolder(
      holder: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getToken(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getVestingIdAtIndex(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVestingSchedule(
      vestingScheduleId: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVestingScheduleByAddressAndIndex(
      holder: PromiseOrValue<string>,
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVestingSchedulesCount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVestingSchedulesCountByBeneficiary(
      _beneficiary: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getVestingSchedulesTotalAmount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getWithdrawableAmount(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    release(
      vestingScheduleId: PromiseOrValue<BytesLike>,
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    revoke(
      vestingScheduleId: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setCategoryParams(
      CategoryId: PromiseOrValue<BigNumberish>,
      categoryName: PromiseOrValue<string>,
      memberAddresses: PromiseOrValue<string>[],
      cliff: PromiseOrValue<BigNumberish>,
      duration: PromiseOrValue<BigNumberish>,
      slicePeriodSeconds: PromiseOrValue<BigNumberish>,
      revocable: PromiseOrValue<boolean>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      amount: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
