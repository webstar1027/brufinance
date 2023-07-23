import { Component, OnInit } from '@angular/core';
import { NftService } from '../../../nft/services/nft.service';
import { finalize } from 'rxjs/operators';
import { ChainlinkAPIService } from 'src/app/common/services/chainlink-api.service';
import { TopCommodity } from '../../../../common/models/top-commodity';
import { Web3Service } from 'src/app/common/services/web3.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css'],
})
export class ConnectComponent implements OnInit {
  fetchedData: boolean = false;
  showSpinner: boolean = false;
  nfts: any[] = [];
  totalAssets: number = 0;
  totalAssetsValue: number = 0;
  totalAssetsValueMinted: number = 0;
  topCommodities: TopCommodity[] = [];
  networkId: string = '';
  redirectUrl: any;
  constructor(
    private nftService: NftService,
    private chainlinkService: ChainlinkAPIService,
    private web3Service: Web3Service,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.loadData();
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      const request = params['request'];
      this.redirectUrl = params['redirect'];
      if (request) {
        this.toastr.info('Please open Metamask to connect.');
      }
    });
    // this.web3Service.events$.forEach(event => console.log(event));
  }

  loadData(query: { skip?: Number; limit?: Number } = {}) {
    this.showSpinner = true;
    const skip = query.skip || this.nfts.length;
    const limit = query.limit || 10;

    this.nftService
      .getAllNfts({ skip, limit })
      .pipe(
        finalize(() => {
          this.fetchedData = true;
          this.showSpinner = false;
        })
      )
      .subscribe((response: any) => {
        this.totalAssets = response.totalAssets;
        this.totalAssetsValue = this.chainlinkService.roundOffDecimal(
          this.chainlinkService.convertInrToUsd(response.totalAssetsValue)
        );
        this.totalAssetsValueMinted = this.chainlinkService.roundOffDecimal(
          this.chainlinkService.convertInrToUsd(response.totalAssetsValueMinted)
        );
        this.topCommodities = response.topCommodities;
        this.nfts = [...this.nfts, ...response.data];
        // console.log(this.nfts)
      });
  }

  handleShowMore() {
    this.loadData();
  }

  connectMetamask() {
    this.web3Service.bootstrapWeb3().subscribe(
      (accounts: string[]) => {
        if (accounts.length === 0) {
          this.toastr.info('Please open Metamask to connect.');
        }
        let networkId = accounts[0] || '';
        if (networkId) {
          if (this.redirectUrl == 'lending') {
            this.router.navigateByUrl('/home/lending');
          } else if (this.redirectUrl == 'borrow') {
            this.router.navigateByUrl('/home/borrow');
          } else {
            this.router.navigateByUrl('/');
          }
        } else {
          this.router.navigateByUrl('/');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  walletConnect() {
    this.web3Service.connectWallet().subscribe(
      (accounts: string[]) => {
        console.log(" ========== conect component =======")
        console.log(accounts);
        if (accounts.length === 0) {
          this.toastr.info('Please open walletconnect to connect.');
        }
        let networkId = accounts[0] || '';
        if (networkId) {
          if (this.redirectUrl == 'lending') {
            this.router.navigateByUrl('/home/lending');
          } else if (this.redirectUrl == 'borrow') {
            this.router.navigateByUrl('/home/borrow');
          } else {
            this.router.navigateByUrl('/');
          }
        } else {
          this.router.navigateByUrl('/');
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  numberWithCommas(x: any) {
    let s = x.toString().trim().split('.');
    x = s[0];
    var lastThree = x.substring(x.length - 3);
    var otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers != '') {
      lastThree = ',' + lastThree;
    }
    if (s[1]) {
      if (s[1].length > 2) {
        return (
          otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + lastThree + '.00'
        );
      } else {
        return (
          otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
          lastThree +
          '.' +
          s[1]
        );
      }
    } else {
      return otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + lastThree;
    }
  }
}
