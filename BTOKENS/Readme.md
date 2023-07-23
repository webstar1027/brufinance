
1. InterestRateModel contract address : 0xd70AB618DCc94cc02AC4DFE1D069BCFfB3184B83
2. Comptroller contract address:        0x1265B2d68A623150744b0A081Ff6527c61cA92C0


make file named `secret.js` in the BTOKENS dir

    ```
        module.exports = {
            privateKey: 'YOUR_WALLET_PRIVATEKEY'
        }
    ```

```
npx hardhat verify --network matic 0xBA686347c07050d11bD2e8393EAd3e278238Bd4C '0xd70AB618DCc94cc02AC4DFE1D069BCFfB3184B83' '0x1265B2d68A623150744b0A081Ff6527c61cA92C0' 0 'BToken' 'BToken' 18
```