import { Component, OnInit } from '@angular/core';
import { NftService } from '../../services/nft.service';
import { finalize } from 'rxjs/operators';
import { ChainlinkAPIService } from 'src/app/common/services/chainlink-api.service';
import { TopCommodity } from '../../../../common/models/top-commodity';
import { Web3Service } from 'src/app/common/services/web3.service';

@Component({
  selector: 'app-nft-list',
  templateUrl: './nft-list.component.html',
  styleUrls: ['./nft-list.component.css'],
})
export class NftListComponent implements OnInit {
  fetchedData: boolean = false;
  showSpinner: boolean = false;
  nfts: any[] = [];
  totalAssets: number = 0;
  totalAssetsValue: number = 0;
  topCommodities: TopCommodity[] = [];
  networkId: string = '';

  constructor(
    private nftService: NftService,
    private chainlinkService: ChainlinkAPIService,
    private web3Service : Web3Service
  ) { }

  // ngOnInit(): void {
    
  ngOnInit(): void {
    this.web3Service.bootstrapWeb3().subscribe(
      (accounts: string[]) => {
        this.networkId = accounts[0] || '';
        this.loadData();
      },
      (err) => {
        alert('Web3 bootstrap failed');
      }
    );
  }
  // this.loadData();

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
        this.topCommodities = response.topCommodities;
        this.nfts = [...this.nfts, ...response.data];
        console.log(this.nfts)
      });
  }

  handleShowMore() {
    this.loadData();
  }
}
