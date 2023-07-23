import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Web3Service } from 'src/app/common/services/web3.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';


// declare global {
//   interface Window {
//     ethereum: any;
//   }
// }

// window.ethereum.on('accountsChanged', () => {
//   setTimeout(() => {
//     location.reload();
//   }, 300);
// });

// window.ethereum.on('chainChanged', () => {
//   setTimeout(() => {
//     location.reload();
//   }, 300);
// });
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  message: any = '';
  accounts: any;
  networkId: any;
  constructor(
    private web3Service: Web3Service,
    private router: Router,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {
    this.checkConnectionAndLoadData();
  }

  async checkConnectionAndLoadData() {
    let accounts = await this.web3Service.checkConnection();
    this.accounts = accounts;
    console.log(accounts, 'accounts here');
    if (!accounts) {
      this.router.navigateByUrl('/home');
    }
    this.networkId = accounts[0] || '';
    console.log(this.networkId);
    if (this.networkId) {
      // this.refreshData();
    } else {
      this.router.navigateByUrl('/home');
      this.cd.detectChanges();
    }
  }

  ngOnInit(): void { }
  showOverlayMessage(val: any) {
    let docs = document.getElementById('lendText');
    let docs2 = document.getElementById('borrowText');
    switch (val) {
      case 'lend':
        if (docs) docs.style.display = 'block';
        if (docs2) docs2.style.display = 'none';
        // if (docs) docs.innerHTML = "The <span style='color: #540F7A;'>lenders</span> are the ones who want to lend cryptos, stablecoins or cash and earn passive income from their crypto investments."
        break;
      case 'borrow':
        if (docs2) docs2.style.display = 'block';
        if (docs) docs.style.display = 'none';
        // const doc2 = document.getElementById('overlayT');
        // if (docs) docs.innerHTML = "The <span style='color: #540F7A;>borrower</span> are the ones that connects with the crypto lending platform and requests a crypto loan."
        break;
      case 'stake':
        // const docs3 = docsument.getElementById('overlayT');
        // if (docs) docs.innerHTML = "<span style='color: #540F7A;>Staking</span> is a process that involves committing your crypto assets to support a blockchain network and confirm transactions."
        break;
      default:
        this.message = '';
        break;
    }
    const doc = document.getElementById('overlay');
    if (doc) doc.style.display = 'block';
  }
  turnOffOverlay() {
    const doc = document.getElementById('overlay');
    if (doc) doc.style.display = 'none';
  }

  async lendBtn() {
    // if (typeof window.ethereum == 'undefined') {
    //   console.log('entered here');

    //   alert('Metamask not installed, visit https://metamask.io/download/');
    // } else {
    let accounts = await this.web3Service.checkConnection();
    console.log(accounts);
    console.log('before entering');
    if (!accounts) {
      this.router.navigateByUrl(
        '/home/connect?request=true&redirect=lending'
      );
    }
    let networkId = accounts[0] || '';
    console.log(networkId);
    if (networkId) {
      this.router.navigate(['/home/lending']);
      this.cd.detectChanges();
    } else {
      this.router.navigateByUrl(
        '/home/connect?request=true&redirect=lending'
      );
      this.cd.detectChanges();
    }
    //}
  }

  async borrowBtn() {
    // if (typeof window.ethereum == 'undefined') {
    //   alert(' Metamask not installed, visit https://metamask.io/download/');
    // } else {
    let accounts = await this.web3Service.checkConnection();
    console.log(accounts);
    if (!accounts) {
      this.router.navigateByUrl('/home/connect?request=true&redirect=borrow');
    }
    let networkId = accounts[0] || '';
    console.log(networkId);
    if (networkId) {
      this.router.navigate(['/home/borrow']);
      this.cd.detectChanges();
    } else {
      this.router.navigateByUrl('/home/connect?request=true&redirect=borrow');
      this.cd.detectChanges();
    }
    //}
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
      let networkDetails = {
        chainId: '0x13881',
        chainName: 'Polygon Testnet',
        rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
      }
      if (window.ethereum.chainId == networkDetails.chainId) {
        this.toastr.info('Polygon Mumbai Network has already been added to Metamask.');
      } else {
        try {
          let result = await window.ethereum.request({
            jsonrpc: '2.0',
            method: 'wallet_addEthereumChain',
            params: [
              networkDetails
            ],
          });
          console.log('Network added result', result);
          if (result == undefined) {
          }
        } catch (error) {
          console.log('Error while adding network to wallet');
        }
        // } catch (error) {
        //   console.log('Error while adding network to wallet');
        // }
      }
    }
  }

  async getToken() {
    console.log('Obtaining all accounts...', this.accounts);
    try {
      let walletAddress = this.accounts;
      console.log('wallet address', walletAddress[0]);

      let mintTokenResult = await this.web3Service
        .artifactsToTokenContract(environment.TokenAddress)
        .methods.mint(
          walletAddress[0],
          this.web3Service.convertToSmallestUnit('1000')
        )
        .send({ from: walletAddress[0] });
      console.log(mintTokenResult);
    } catch (error:any) {
      console.log('Error while minting tokens to wallet');
      if (error['code'] == '4001') {
        this.toastr.info('Transaction rejected');
      }
      console.log(error);
    }
  }
}
