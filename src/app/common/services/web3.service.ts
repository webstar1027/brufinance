import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { share, subscribeOn } from 'rxjs/operators';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { JsonRpcPayload, JsonRpcResponse } from 'web3-core-helpers';
import { AbstractProvider } from 'web3-core/types'

declare let require: any;
declare let ethereum: any;
declare let window: any;

@Injectable({
  providedIn: 'root',
})

export declare class WalletConnectWeb3Provider extends WalletConnectProvider implements AbstractProvider {
	sendAsync(payload: JsonRpcPayload, callback: (error: Error | null, result?: JsonRpcResponse) => void): void;
}

export class Web3Service {
  private _subject = new Subject<any>();
  private web3: any;
  private accounts: string[] = [];
  public ready = false;
  public abi: any;
  private contract: any;
  // private contractAddress: string;
  private amount: number | undefined;
  public accountsSubject = new Subject<string[]>();
  public sc: any;
  environment: any;
  provider: any;

  constructor() { }


  public async enableAccounts(): Promise<any> {
    this.provider = window.ethereum;
    this.web3 = new Web3(this.provider);
    await this.provider.enable();
    this.accounts = await this.web3.eth.getAccounts();
    this.provider.on("accountsChanged", (accounts: string[]) => {
      console.log('wallet connect provider ',this.accounts);
      return this.accounts;
    });

    return this.accounts;
  }

  public async enableWallet(): Promise<any> {
    this.provider= new WalletConnectProvider({
      infuraId: "b8eb81a4d5a641959e281924bf72905e",
    });
    this.web3 = new Web3(this.provider as WalletConnectWeb3Provider)
    await this.provider.enable();
    this.accounts = await this.web3.eth.getAccounts();
    console.log(" ========== enable wallet =======")
    console.log(this.accounts);
    this.provider.on("accountsChanged", (accounts: string[]) => {
      console.log('wallet connect provider ',accounts);
      return accounts;
    });
    return this.accounts;
  }

  newEvent(event: any) {
    this._subject.next(event);
  }

  get events$() {
    return this._subject.asObservable();
  }
  
  /**
   *  Get web3 instance
   *  @return web3
   */
  public getWeb3() {
    return this.web3;
  }

  async checkConnection() {
    // if (typeof window.web3 !== 'undefined') {
    //   this.web3 = new Web3(window.web3.currentProvider);
    // } else {
    //   Web3.providers.HttpProvider.prototype.sendAsync =
    //     Web3.providers.HttpProvider.prototype.send;
    //   this.web3 = new Web3(
    //     new Web3.providers.HttpProvider(environment.baseURL)
    //   );
    // }
    console.log(this.provider);
   
    if (typeof this.provider !== 'undefined') {
      this.web3 = new Web3(this.provider);
      return this.web3.eth.getAccounts((err: any, accs: any) => {
        if (err != null) {
          console.error("An error occurred: " + err);
        }
        else if (accs.length == 0) {
          console.log("User is not logged in to MetaMask")
        }
        else {
          console.log("User is logged in to MetaMask")
        }
      });
    } else {
      return [];
    }
  }

  public connectWallet(): Observable<any> {
    return new Observable((subscriber) => {
      // setInterval(this.refreshAccounts, 500);
      // check if privacy mode is activated and request access
      this.enableWallet().then((accounts: any[]) => {
        console.log(" ========== service connectWallet =======")
        console.log(accounts);

        subscriber.next(accounts);
        //this.refreshAccounts();
      });
    }).pipe(share());
  }

  public bootstrapWeb3(): Observable<any> {
    return new Observable((subscriber) => {
      
      // setInterval(this.refreshAccounts, 500);
      // check if privacy mode is activated and request access
      this.enableAccounts().then((accounts: any[]) => {
        subscriber.next(accounts);
        this.refreshAccounts();
      });

      // this.abi = this.artifactsToContract(this.sc);
    }).pipe(share());
  }

  public refreshAccounts = () => {
    // if (typeof window.web3 !== 'undefined') {
    //   this.web3.eth.getAccounts((err: any, accs: any) => {
    //     // console.log('Observed new accounts accs',accs);
    //     // console.log(
    //     //   ' this.getProviderName ',
    //     //   this.web3.givenProvider.networkVersion
    //     // );
    //     // For MATIC Network *******************
    //     if (
    //       this.web3.givenProvider.networkVersion !== '80001' &&
    //       this.web3.givenProvider.networkVersion !== '4' &&
    //       this.web3.givenProvider.networkVersion !== '5777' &&
    //       this.web3.givenProvider.networkVersion !== '31337'
    //     ) {
    //       // if (this.web3.givenProvider.networkVersion !== '4') {
    //       let linkTestnet =
    //         'https://docs.binance.org/smart-chain/wallet/metamask.html#connect-your-metamask-with-binance-smart-chain';
    //       alert(
    //         'Connect your  MetaMask wallet to matic testnet network!  \n  \n '
    //       );
    //     }

    //     if (err != null) {
    //       console.warn('There was an error fetching your accounts.');
    //       return;
    //     }

    //     // accs = ethereum.request({ method: 'eth_accounts' });

    //     // Get the initial account balance so it can be displayed.
    //     if (accs.length === 0) {
    //       console.warn(
    //         "Couldn't get any accounts! Make sure your Ethereum client is configured correctly."
    //       );
    //       return;
    //     }

    //     if (
    //       !this.accounts ||
    //       this.accounts.length !== accs.length ||
    //       this.accounts[0] !== accs[0]
    //     ) {
    //       console.log('Observed new accounts', accs);

    //       this.accountsSubject.next(accs);
    //       // for (let i = 0; i < accs.length; i++) {
    //       //   this.accounts[i] = accs[i];
    //       // }
    //       this.accounts = accs;
    //       localStorage.setItem('userAccount', this.accounts[0]);
    //       console.log('Observed new accounts1', this.accounts);
    //     }
    //     // this.newEvent(this.accounts)
    //     // console.log('Observed new accounts2', this.accounts);
    //     this.ready = true;
    //   });
    // }
  };

  public artifactsToContract(sc: any) {
    console.log(`artifacts to contract ${sc}`);
    if (sc) {
      if (this.web3) {
        const instance = new this.web3.eth.Contract(environment.ABI.abi, sc);
        console.log(instance);
        return instance;
      }
    }
  }
  public artifactsToContractV1() {
    if (this.web3) {
      const instance = new this.web3.eth.Contract(environment.lendingABI, environment.lendingContractAddress);
      console.log(instance);
      return instance;
    }

  }
  public artifactsToContractV2() {
    if (this.web3) {
      const instance = new this.web3.eth.Contract(environment.borrowABI, environment.borrowContractAddress);
      console.log(instance);
      return instance;
    }

  }

  public artifactsToFactoryContract() {
    if (this.web3) {
      const instance = new this.web3.eth.Contract(environment.factoryABI, environment.factoryAddress);
      console.log(instance);
      return instance;
    }

  }
  public artifactsToTreasuryContract(TreasuryAddress: any) {
    if (this.web3) {
      const instance = new this.web3.eth.Contract(environment.TreasuryABI, TreasuryAddress);
      console.log(instance);
      return instance;
    }
  }

  public artifactsToRouterContract() {
    if (this.web3) {
      const instance = new this.web3.eth.Contract(environment.RouterABI, environment.RouterAddress);
      console.log(instance);
      return instance;
    }
  }
  public artifactsToIERCContract() {
    if (this.web3) {
      const instance = new this.web3.eth.Contract(environment.iercABI, environment.TokenAddress);
      console.log(instance);
      return instance;
    }

  }
  public artifactsToIERCContractPoolToken(poolTokenAddress:any) {
    if (this.web3) {

      const instance = new this.web3.eth.Contract(environment.PoolTokenABI, poolTokenAddress);
      console.log(instance);
      return instance;
    }

  }
  public artifactsToBTokenContract() {
    if (this.web3) {
      const instance = new this.web3.eth.Contract(environment.bTokenABI, environment.bTokenAddress);
      console.log(instance);
      return instance;
    }

  }

  public convertToSmallestUnit(amount: any) {
    return Web3.utils.toWei(amount.toString())
  }
  public convertToLargestUnit(amount: any) {
    return Web3.utils.fromWei(amount.toString(), 'ether')
  }

  public artifactsToContractWrt(sc: any) {
    if (sc) {
      if (this.web3) {
        const instance = new this.web3.eth.Contract(environment.ABI.abi, sc);
        console.log(`instance of contract is ready ${instance}`);
        return instance;
      }
    }
  }
  public artifactsToPoolContract(poolAddress: any) {
    if (this.web3) {
      const instance = new this.web3.eth.Contract(environment.PoolABI, poolAddress);
      console.log(instance);
      return instance;
    }
  }
  public artifactsToTokenContract(tokenAddress: any) {
    if (this.web3) {
      const instance = new this.web3.eth.Contract(environment.TokenABI, tokenAddress);
      console.log(instance);
      return instance;
    }
  }

  public getAccount() {
    // this.bootstrapWeb3();
    if (this.accounts.length === 0) {
      console.log(
        "Couldn't get any accounts! Make sure your Ethereum client is configured correctly."
      );
      return null;
    }
    console.log(
      'get account address web3 ---->>>>',
      this.accounts
    );
    return this.accounts[0];
  }

  public getProvider() {
    return this.web3.currentProvider;
  }

  public trasfer(receiver: any, sender: any, value: any) {
    return this.web3.eth.sendTransaction({
      to: receiver,
      from: sender,
      value: this.web3.utils.toWei(value, 'ether'),
    });
  }

  // public balanceOf(address: any) {
  //   return this.web3.eth.balanceOf(address).then((data: any) => {
  //     return this.web3.utils.fromWei(data, 'ether');
  //   });

  public getBalance(address: any) {
    return this.web3.eth.getBalance(address).then((data: any) => {
      console.log('MATIC balance of ', address);
      console.log('MATIC balance *********** ', data);
      return this.web3.utils.fromWei(data, 'ether');
    });
  }

  public totalSupply(sc: any) {
    sc = environment.ABI.networks[3].address;
    console.log(`OUTER FUNCTION   ${this.amount}`);
    console.log(`yes function is getting called!`);
    if (this.web3) {
      console.log(this.amount);
      console.log(environment.ABI.networks[3].address);
      return this.web3.eth.contract.methods.totalSupply().call(
        {
          from: this.getAccount(),
          to: sc,
        },
        function (err: any, res: any) {
          if (res) {
            console.log(res);
          } else {
            console.log(err);
          }
        }
      );
    }
  }

  public mintInternal(amount: any, sc: any) {
    this.amount = amount;
    sc = environment.ABI.networks[3].address;
    console.log(`OUTER FUNCTION   ${this.amount}`);
    console.log(`yes function is getting called!`);
    if (this.web3) {
      console.log(this.amount);
      console.log(environment.ABI.networks[3].address);
      return this.web3.eth.contract.methods.mintInternal().send(
        {
          from: this.getAccount(),
          to: sc,
          value: this.web3.toWei(this.amount, 'ether'),
        },
        function (err: any, res: any) {
          if (res) {
            console.log(res);
          } else {
            console.log(err);
          }
        }
      );
    }
  }

  public borrowInternal(amount: any) {
    this.amount = amount;
    console.log(`OUTER FUNCTION   ${this.amount}`);
    console.log(`yes function is getting called!`);
    if (this.web3) {
      console.log(this.amount);
      console.log(environment.ABI.networks[3].address);
      return this.web3.eth.contract.methods.borrowInternal().send(
        {
          from: this.getAccount(),
          to: environment.ABI.networks[3].address,
          value: this.web3.toWei(this.amount, 'ether'),
        },
        function (err: any, res: any) {
          if (res) {
            console.log(res);
          } else {
            console.log(err);
          }
        }
      );
    }
  }

  public repayBorrowInternal(amount: any, sc: any) {
    console.log(`OUTER FUNCTION   ${this.amount}`);
    console.log(`yes function is getting called!`);
    if (this.web3) {
      console.log(amount);
      console.log(environment.ABI.networks[3].address);
      return this.web3.eth.contract.methods.repayBorrowInternal().send(
        {
          from: this.getAccount(),
          to: sc,
          value: this.web3.toWei(amount, 'ether'),
        },
        function (err: any, res: any) {
          if (res) {
            console.log(res);
          } else {
            console.log(err);
          }
        }
      );
    }
  }

  public redeemInternal(amount: any) {
    // this.amount = amount;
    // console.log(`OUTER FUNCTION   ${this.amount}`);
    // console.log(`yes function is getting called!`);
    if (this.web3) {
      console.log(amount);
      console.log(environment.ABI.networks[3].address);
      return this.web3.eth.contract.methods.redeemInternal(amount).send(
        {
          from: this.getAccount(),
          to: environment.ABI.networks[3].address,
          value: amount,
          // this.web3.toWei(this.amount, 'wei')
        },
        function (err: any, res: any) {
          if (res) {
            console.log(res);
          } else {
            console.log(err);
          }
        }
      );
    }
  }
}
