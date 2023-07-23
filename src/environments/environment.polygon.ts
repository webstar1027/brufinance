// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// import API from '../../contract_details/btoken.json';
import * as ABI from '../../contract_details/btoken.json';
import LABI from '../../contract_details/Lending.json';
import BABI from '../../contract_details/Borrow.json';
import IERC20 from '../../contract_details/IERC20.json';
import BToken from '../../contract_details/BToken1.json';
import RouterArtifact from "../../upgradeable-contract/artifacts/contracts/BruRouter.sol/BruRouter.json"
import PoolArtifact from "../../upgradeable-contract/artifacts/contracts/core/BruPool.sol/BruPool.json"
// import TokenArtifact from "../../upgradeable-contract/artifacts/contracts/tokens/USDT.sol/USDT.json"


export const environment = {
  production: false,
  baseURL: 'https://v2backend.bru.finance',
  cryptoComparePriceURL: 'https://min-api.cryptocompare.com/data/price',
  googleClientId:
    '602242376186-qsqghv1gcni9j1bvpu3f5fshafho7dco.apps.googleusercontent.com',
  facebookClientId: '258151686411272',
  RouterAddress: '0xee8Ad880e65B3C6944813649FA3E9979f13CBB77',
  RouterABI: RouterArtifact.abi,
  PoolABI: PoolArtifact.abi,
  // TokenABI: TokenArtifact.abi,
  TokenAddress: '0x37805F8868DA7731a1eDb198312f1BCA147dD3E9',
  ABI,
  lendingContractAddress: "0x6FFa0968A6A2851f76b8294E99C223E715829B44",
  tokenContractAddress: "0x98e0490B7BB2fec50527C8F2D0420B53e60E2540",
  bTokenAddress: "0x25B32f1bCe3842Ae3D8e7DDf344e6e9498f01A7c",
  borrowContractAddress: "0xd73C1AeE2326B02669b64813725EA5FfEFa0adb2",
  lendingABI: LABI,
  iercABI: IERC20,
  bTokenABI: BToken,
  borrowABI: BABI

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
