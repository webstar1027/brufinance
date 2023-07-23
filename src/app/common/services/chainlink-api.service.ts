import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs/operators';
import Web3 from 'web3';

import { PriceConversions } from '../models/price-conversions';

interface USDConversionResponse {
  USD: number;
  ETH: number;
}
interface USDToMaticCOnversionReponse{
  MATIC:number;
}

@Injectable({
  providedIn: 'root',
})
export class ChainlinkAPIService {
  baseURL = '';
  wallet = '';
  walletS = '';
  chainlink: string;
  cryptoCompare: string;

  priceConversions: PriceConversions;

  constructor(private http: HttpClient) {
    this.baseURL = 'https://uat-backend.whrrl.in/';
    this.wallet = 'https://uat-warehouses.whrrl.in/api/mswc/';
    this.chainlink = 'https://bk.bru.finance/';
    this.walletS = 'https://uat-warehouses.whrrl.in/api/mswc/';
    this.cryptoCompare = environment.cryptoComparePriceURL;

    this.priceConversions = {
      ethUsd: 0,
      xagUsd: 0,
      xauUsd: 0,
      inrUsd: 0,
      usdEth: 0,
      maticUsd:0
    };
  }

  roundOffDecimal(value: number, decimal: number = 2) {
    return (
      Math.round((Number(value) + Number.EPSILON) * 10 ** decimal) /
      10 ** decimal
    );
  }

  convertUsdToInr(amount: number | string) {
    return Number(amount) / this.priceConversions.inrUsd;
  }

  convertInrToUsd(amount: number) {
    return Number(amount) * this.priceConversions.inrUsd;
  }

  convertUsdToEth(amount: number) {
    return Number(amount) * this.priceConversions.usdEth;
  }

  convertEthToWei(amount: number) {
    return Web3.utils.toWei(String(amount), 'ether');
  }

  nftData() {
    return this.http.get(this.baseURL + 'nft/nftData');
  }
  sendEth(to: any, value: any, int: any) {
    return this.http.get(this.walletS + `eth-send/${to}/${value}/${int}`);
  }
  balance(to: any) {
    return this.http.get(this.wallet + `eth-balance/${to}/`);
  }
  sendEthSave(data: any) {
    return this.http.post(this.wallet + 'eth-send-save', data);
  }
  ethUsdprice() {
    return this.http.get(this.wallet + 'band-price');
  }

  usdEthprice() {
    return this.http.get(this.wallet + 'band-price');
  }
  getXagPrice() {
    return this.http.get(this.wallet + 'xag-price');
  }

  getChainlinkPrice(data: any) {
    return this.http.post(this.chainlink, data);
  }

  getPriceEthUsd() {
    return this.http
      .get<USDConversionResponse>(this.cryptoCompare, {
        params: {
          fsym: 'ETH',
          tsyms: 'USD',
        },
      })
      .pipe(tap(({ USD }) => (this.priceConversions.ethUsd = USD)));
  }

  getPriceUsdEth() {
    return this.http
      .get<USDConversionResponse>(this.cryptoCompare, {
        params: {
          fsym: 'USD',
          tsyms: 'ETH',
        },
      })
      .pipe(tap(({ ETH }) => (this.priceConversions.usdEth = ETH)));
  }
  getPriceXagUsd() {
    return this.http.get(this.cryptoCompare, {
      params: {
        fsym: 'XAG',
        tsyms: 'USD',
      },
    });
  }

  getPriceXauUsd() {
    return this.http.get(this.cryptoCompare, {
      params: {
        fsym: 'XAU',
        tsyms: 'USD',
      },
    });
  }
  getPriceMaticUsd() {
    return this.http.get<USDToMaticCOnversionReponse>(this.cryptoCompare, {
      params: {
        fsym: 'USD',
        tsyms: 'MATIC',
      },
    }).pipe(tap(({ MATIC }) => (this.priceConversions.maticUsd = MATIC)));
  }

  getPriceInrUsd() {
    return this.http
      .get<USDConversionResponse>(this.cryptoCompare, {
        params: {
          fsym: 'INR',
          tsyms: 'USD',
        },
      })
      .pipe(tap(({ USD }) => (this.priceConversions.inrUsd = USD)));
  }
}
