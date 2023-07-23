import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ChainlinkAPIService } from './common/services/chainlink-api.service';
import { Web3Service } from './common/services/web3.service';
import { AuthService } from './modules/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'brufinancev2';
  showOverlay: Boolean = false;
  preloadData: { fetching: boolean; fetched: boolean; failed: boolean } = {
    fetching: false,
    fetched: false,
    failed: false,
  };

  constructor(
    private chainlinkService: ChainlinkAPIService,
    private authService: AuthService,
    private router: Router,
    private web3: Web3Service
  ) {
    this.router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.web3.newEvent(this.router.url)
      }
    })
  }

  ngOnInit() {
    console.log("ok");
    let device = this.detectMob();
    if (device) {
      this.showOverlay = true;
    } else {
      this.showOverlay = false;
    }
    // this.authService.getProfile().subscribe(
    //   () => { },
    //   () => {
    //     this.router.navigateByUrl('/auth/login');
    //   }
    // );

    this.fetchChainlinkGlobalValues();
  }

  fetchChainlinkGlobalValues() {
    this.preloadData.fetching = true;
    const apiFetch$: any[] = [];
    apiFetch$.push(this.chainlinkService.getPriceEthUsd());
    apiFetch$.push(this.chainlinkService.getPriceInrUsd());
    apiFetch$.push(this.chainlinkService.getPriceUsdEth());
    apiFetch$.push(this.chainlinkService.getPriceMaticUsd());

    forkJoin({
      ethUsd: this.chainlinkService.getPriceEthUsd(),
      inrUsd: this.chainlinkService.getPriceInrUsd(),
      usdEth: this.chainlinkService.getPriceUsdEth(),
      maticUsd: this.chainlinkService.getPriceMaticUsd()
    }).subscribe(
      (response: any) => {
        this.preloadData.fetching = false;
        this.preloadData.fetched = true;
      },
      (error) => {
        this.preloadData.fetching = false;
        this.preloadData.failed = true;
      }
    );
  }
  detectMob() {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
      return navigator.userAgent.match(toMatchItem);
    });
  }
}
