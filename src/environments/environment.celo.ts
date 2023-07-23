import * as ABI from '../../contract_details/btoken.json';
import LABI from '../../contract_details/Lending.json';
import BABI from '../../contract_details/Borrow.json';
import IERC20 from '../../contract_details/IERC20.json';
import BToken from '../../contract_details/BToken1.json';
import RouterArtifact from "../../v2-contracts/artifacts/contracts/BruRouter.sol/BruRouter.json"
import PoolArtifact from "../../v2-contracts/artifacts/contracts/core/BruPool.sol/BruPool.json"

export const environment = {
    production: true,
    baseURL: 'https://betaBackend.bru.finance',
    cryptoComparePriceURL: 'https://min-api.cryptocompare.com/data/price',
    googleClientId:
        '602242376186-qsqghv1gcni9j1bvpu3f5fshafho7dco.apps.googleusercontent.com',
    facebookClientId: '258151686411272',
    RouterAddress: '0x3C0E5366e6Ca077877f636E145daC88ed6CC6D86',
    RouterABI: RouterArtifact.abi,
    PoolABI: PoolArtifact.abi,
    TokenAddress: '0x8caA3d049298A5E20A96226e300E00c65Dc728de',
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
