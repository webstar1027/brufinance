// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// import API from '../../contract_details/btoken.json';
import * as ABI from '../../contract_details/btoken.json';
import LABI from '../../contract_details/Lending.json';
import BABI from '../../contract_details/Borrow.json';
import IERC20 from '../../upgradeable-contract/artifacts/contracts/tokens/TestToken.sol/TestToken.json';
import BToken from '../../contract_details/BToken1.json';
import RouterArtifact from '../../upgradeable-contract/artifacts/contracts/BruRouter.sol/BruRouter.json';
import PoolArtifact from '../../upgradeable-contract/artifacts/contracts/core/BruPool.sol/BruPool.json';
import TreasuryArtifact from '../../upgradeable-contract/artifacts/contracts/core/AssetTreasury.sol/AssetTreasury.json';
import PoolTokenArtifact from '../../upgradeable-contract/artifacts/contracts/tokens/PoolToken.sol/PoolToken.json';
import FactoryArtifact from '../../upgradeable-contract/artifacts/contracts/core/BruFactory.sol/BruFactory.json';
import TokenArtifact from '../../upgradeable-contract/artifacts/contracts/tokens/TestToken.sol/TestToken.json';

export const environment = {
  production: false,
  // baseURL: 'http://localhost:3000',
  baseURL: 'https://uatbackend.bru.finance',
  cryptoComparePriceURL: 'https://min-api.cryptocompare.com/data/price',
  googleClientId:
    '602242376186-qsqghv1gcni9j1bvpu3f5fshafho7dco.apps.googleusercontent.com',
  facebookClientId: '258151686411272',
  // RouterAddress : '0xa3c552c713A68BA2E7e8838fb4C2D13cABDBfD03',
  RouterABI: RouterArtifact.abi,
  PoolABI: PoolArtifact.abi,
  TreasuryABI: TreasuryArtifact.abi,
  TokenABI: TokenArtifact.abi,
  PoolTokenABI: PoolTokenArtifact.abi,
  TokenAddress: '0xdAD510AcEEcfD4beBCF3F55e8b96f1043C0EaA5E',
  factoryAddress: '0x46d6003EF5d28B6CD414328cb4B809c9b53F52cc',
  RouterAddress: '0xC1709088bca13d4cD774432A2451dc6006FAC48e',
  // TokenAddress:"0x5B9042a9a3207b9dbED0D4E52384890048922760",
  // factoryAddress:'0x8c5233519393124F0DF5023afCA090B150af7eA8',
  factoryABI: FactoryArtifact.abi,
  ABI,
  lendingContractAddress: '0x6FFa0968A6A2851f76b8294E99C223E715829B44',
  tokenContractAddress: '0xdAD510AcEEcfD4beBCF3F55e8b96f1043C0EaA5E',
  bTokenAddress: '0x25B32f1bCe3842Ae3D8e7DDf344e6e9498f01A7c',
  borrowContractAddress: '0xd73C1AeE2326B02669b64813725EA5FfEFa0adb2',
  lendingABI: LABI,
  iercABI: IERC20.abi,
  bTokenABI: BToken,
  borrowABI: BABI,
};

// {
// 	"TOKEN_ADDRESS": "0xdAD510AcEEcfD4beBCF3F55e8b96f1043C0EaA5E",
// 	"FACTORY_ADDRESS": "0x46d6003EF5d28B6CD414328cb4B809c9b53F52cc",
// 	"ROUTER_ADDRESS": "0xC1709088bca13d4cD774432A2451dc6006FAC48e"
// }
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
