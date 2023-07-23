import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { Web3Service } from '../../services/web3.service';
import { environment } from 'src/environments/environment';
declare global {
  interface Window {
    ethereum: any;
  }
}

// window.ethereum.on('accountsChanged', () => {
//   setTimeout(() => {
//     location.reload();
//   }, 400);
// });

// window.ethereum.on('chainChanged', () => {
//   setTimeout(() => {
//     location.reload();
//   }, 400);
// });
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  loggedIn$: Observable<boolean>;
  connected: Boolean = false;
  started: Boolean = false;
  selectedPage = '';
  networkId = '';
  testBtns = '';
  switchNetwork = '';

  constructor(
    public router: Router,
    private authService: AuthService,
    private web3: Web3Service,
    private cd: ChangeDetectorRef,
    private web3Service: Web3Service
  ) {
    this.loggedIn$ = this.authService.getLoginState();
    // this.checkConnectionAndLoadData();
  }

  // async checkConnectionAndLoadData() {
  //   let accounts = await this.web3Service.checkConnection();
  //   console.log(accounts);
  //   if (!accounts) {
  //     this.router.navigateByUrl('/home');
  //   }
  //   this.networkId = accounts[0] || '';
  //   console.log(this.networkId);
  //   if (this.networkId) {
  //     // this.refreshData();
  //   } else {
  //     this.router.navigateByUrl('/home');
  //     this.cd.detectChanges();
  //   }
  // }

  ngOnInit(): void {
    this.router.events.subscribe((val) => {
      console.log(this.router.url);
      switch (this.router.url) {
        case '/home':
          this.started = false;
          this.connected = false;
          break;
        case '/home/connect':
          this.started = true;
          this.connected = true;
          break;
        case '/home/lending':
          this.started = true;
          this.connected = true;
          this.selectedPage = 'lend';
          break;
        case '/home/borrow':
          this.started = true;
          this.connected = true;
          this.selectedPage = 'borrow';
          break;
        case '/home/my-transactions':
          this.started = true;
          this.connected = true;
          this.selectedPage = '';
          break;

        default:
          break;
      }
    });
    this.navBarCheck();
    this.web3.events$.forEach((event) => {
      console.log(event);
      if (event == '/home/lending') {
        this.selectedPage = 'lend';
        console.log(this.selectedPage);
        this.cd.detectChanges();
      }
      if (event == '/home/borrow') {
        this.selectedPage = 'borrow';
        console.log(this.selectedPage);
        this.cd.detectChanges();
      }
    });
  }
  navBarCheck() {
    switch (this.router.url) {
      case '/home':
        this.started = false;
        this.connected = false;
        break;
      case '/home/connect':
        this.started = true;
        this.connected = true;
        break;
      case '/home/lending':
        this.started = true;
        this.selectedPage = 'lend';
        this.connected = true;
        break;
      case '/home/borrow':
        this.started = true;
        this.connected = true;
        this.selectedPage = 'borrow';
        break;
      case '/home/my-transactions':
        this.started = true;
        this.connected = true;
        this.selectedPage = '';
        break;

      default:
        break;
    }
  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      this.router.navigateByUrl('/auth/login');
    });
  }

  onChange(value: string) {
    console.log('the selected value is ' + value);
    if (value == 'lend') {
      this.router.navigateByUrl('/home/lending');
    }
    if (value == 'borrow') {
      this.router.navigateByUrl('/home/borrow');
    }
  }
onChangeTBtns(value: string) {
    console.log('the selected value is ' + value);
    if (value == 'addtestusdt') {
      this.addTokenToWallet();
    }
    if (value == 'testusdt') {
      this.getToken();
    }

    if (value == 'addnetwork') {
      this.addNetworkToWallet();
    }
  }

  /**
   *  Switch to Rinkeby Network by SwichEthereumChain method
   *  @reutrn void
   */
  // async onChangeNetwork(value: string) {
  //   if (typeof window.ethereum !== 'undefined') {
  //     try {
  //       await window.ethereum.request({
  //         method: 'wallet_switchEthereumChain',
  //         params: [{chainId: value}],
  //       });
  //     } catch (error) {
  //       console.log('Error while adding network to wallet');
  //     }
  //   }

  //   /**
  //    *  Check chain ID when newtwork change
  //    */
  //     if (window.ethereum) {
  //       window.ethereum.on('chainChanged', async () => {
  //         const chain = await this.web3Service.getWeb3().eth.getChainId()
  //         console.log("chain Id ==>", chain);
  //       })
  //     }
  // }

  

  async addTokenToWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        let result = await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20',
            options: {
              address: environment.TokenAddress,
              symbol: 'USDT',
              decimals: 18,
              image: '',
            },
          },
        });
        console.log('token add result', result);
      } catch (error) {
        console.log('Error while adding token to metamask');
      }
    }
  }

  async addNetworkToWallet() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        let result = await window.ethereum.request({
          jsonrpc: '2.0',
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x13881',
              chainName: 'Polygon Testnet',
              rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
            },
          ],
        });
        console.log('Network added result', result);
        if (result == undefined) {
        }
      } catch (error) {
        console.log('Error while adding network to wallet');
      }
    }
  }

  async getToken() {
    console.log('', this.web3Service.getAccount());
    try {
      let walletAddress = this.web3Service.getAccount();
      await setTimeout(() => {
        let mintTokenResult = this.web3Service
          .artifactsToTokenContract(environment.TokenAddress)
          .methods.mint(
            walletAddress,
            this.web3Service.convertToSmallestUnit('1000')
          )
          .send({ from: walletAddress });
        console.log(mintTokenResult);
      }, 300);
    } catch (error) {
      console.log('Error while minting tokens to wallet');
      console.log(error);
    }
  }
}
