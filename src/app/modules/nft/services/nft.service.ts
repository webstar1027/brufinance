import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Web3Service } from '../../../common/services/web3.service';
import { environment } from '../../../../environments/environment';
import { ChainlinkAPIService } from 'src/app/common/services/chainlink-api.service';

@Injectable({
  providedIn: 'root',
})
export class NftService {
  wallet = '';
  amount: any;
  wamount: any;
  nftid: any;
  BTKNAmount: any;
  constructor(
    private http: HttpClient,
    private web3Service: Web3Service,
    private dataS: ChainlinkAPIService
  ) {
    this.wallet = 'https://uat-warehouses.whrrl.in/api/mswc/';
    this.web3Service.getAccount();
  }

  getAllNfts(params: {}) {
    return this.http.get(environment.baseURL + '/api/v1/nfts/nftData', {
      params,
    });
  }

  getHash(depositApplicationId:any,nftId:any){
    return this.http.post(environment.baseURL+ '/api/v1/nfts/hash',{depositApplicationId,nftId},{
      headers:{
        'content-Type':'application/json'
      }
    })
  }

  lockAsset(depositApplicationId:any){
    return this.http.post(environment.baseURL+ '/api/v1/nfts/hash',{depositApplicationId},{
      headers:{
        'content-Type':'application/json'
      }
    })
  }

  updateNft(nftId: string, obj: object) {
    return this.http.patch(
      environment.baseURL + '/api/v1/nfts/nftData/' + nftId,
      obj
    );
  }

  ethBalance(to: any) {
    return this.http.get(this.wallet + `eth-balance/${to}/`);
  }

  getBalance(sc: any) {
    const account = this.web3Service.getAccount();
    console.log('get BTK balance of ', account);
    return this.web3Service
      .artifactsToContract(sc)
      .methods.balanceOf(account)
      .call(
        {
          from: account,
          to: sc,
        },
        function (err: any, res: any) {
          if (res) {
            console.log('****************');
            console.log(res);
          } else {
            console.log(err);
          }
        }
      );
  }

  getExchangeRate(sc : any) {
    const account = this.web3Service.getAccount();
    return this.web3Service
    .artifactsToContract(sc)
    .methods.exchangeRateStored()
    .call(
      {
        from: account,
        to: sc,
      },
      function (err: any, res: any) {
        if (res) {
          console.log('****************');
          console.log(res);
        } else {
          console.log(err);
        }
      }
    );
  }

  getTotalDeposit(sc : any) {
    const account = this.web3Service.getAccount();
    console.log('get ETH balance of ', account);
    return this.web3Service
      .artifactsToContract(sc)
      .methods.balanceOf(account)
      .call(
        {
          from: account,
          to: sc,
        },
        function (err: any, res: any) {
          if (res) {
            console.log('****************');
            console.log(res);
          } else {
            console.log(err);
          }
        }
      );
  }

  balance(address: any) {
    console.log('(((((((((((((((');
    return this.web3Service.getBalance(address);
  }

  totalSupply(sc: any) {
    return this.web3Service
      .artifactsToContract(sc)
      .methods.totalSupply()
      .call(
        {
          from: this.web3Service.getAccount(),
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
  // sc = environment.ABI.networks[3].address;
  mintInternal(amount: any, sc: any): Promise<any> {
    this.amount = amount;
    return this.web3Service
      .artifactsToContract(sc)
      .methods.mintInternal()
      .send(
        {
          from: this.web3Service.getAccount(),
          to: sc,
          value: this.amount * 1000000000000000000,
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

  borrowInternal(amount: any, nftid: any, sc: any): Promise<any> {
    this.web3Service.sc = sc;
    this.amount = BigInt(amount);
    this.nftid = nftid;
    return this.web3Service
      .artifactsToContract(sc)
      .methods.borrowInternal(this.amount)
      .send(
        { from: this.web3Service.getAccount(), to: sc },
        function (err: any, res: any) {
          if (res) {
            console.log(res);
          } else {
            console.log(err);
          }
        }
      );
  }

  repayBorrowInternal(amount: any, nftid: any, sc: any): Promise<any> {
    this.nftid = nftid;
    return this.web3Service
      .artifactsToContract(sc)
      .methods.repayBorrowInternal()
      .send(
        {
          from: this.web3Service.getAccount(),
          to: sc,
          value: amount,
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

  redeemInternal(amount: any, sc: any): Promise<any> {
    // this.wamount = amount;
    // console.log("wamount ", this.wamount);
    console.log(amount)
    const res = this.web3Service
      .artifactsToContract(sc)
      .methods.redeemInternal(amount)
      .send(
        {
          from: this.web3Service.getAccount(),
          to: sc,
        },
        function (err: any, res: any) {
          if (res) {
            console.log("==============res============", res);
          } else {
            console.log('==========error============', err);
          }
        }
      );
      console.log("-----events-------------",this.web3Service.artifactsToContract(sc).events.Test1())
      this.web3Service.artifactsToContract(sc).events.Test1((err: any, event: any)=>{
        console.log("=====Test1===========",err, event);
      })
      // console.log(res)
    return res;
  }
}
