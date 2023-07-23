import { ArrayType, ThrowStmt } from '@angular/compiler';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { TopCommodity } from 'src/app/common/models/top-commodity';
import { ChainlinkAPIService } from 'src/app/common/services/chainlink-api.service';
import { ScanApiService  } from 'src/app/common/services/scan-api.service';
import { NftService } from 'src/app/modules/nft/services/nft.service';
import { environment } from 'src/environments/environment';
import { Web3Service } from '../../../../common/services/web3.service';
import Web3 from 'web3';
import { NftCardComponent } from '../../../nft/components/nft-card/nft-card.component';

interface NftSearchQuery {
  skip?: number;
  limit?: number;
  networkId?: string;
}

@Component({
  selector: 'app-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.css'],
})
export class BorrowComponent implements OnInit {
  mintBtnClicked: EventEmitter<any> = new EventEmitter();
  @Input() amount: string | undefined;
  fetchedData: boolean = false;
  showSpinner: boolean = false;
  nfts: any[] = [];
  totalAssets: number = 0;
  interestApplicable: any = 0;
  interestApplicableRepay: any = 0;
  totalRepaymentAmount: any = 0;
  platformFees: any = 0;
  eventName: any;
  readOnly: boolean = false;
  totalAssetsValue: number = 0;
  topCommodities: TopCommodity[] = [];
  networkId: string = '';
  selectedNft: any;
  borrowForm: FormGroup;
  img: any;
  showLoaderForRepay: Boolean = false;
  showLoaderForBorrow: Boolean = false;
  repaySuccess: Boolean = false;
  borrowAmountInUsd: number = 0;
  repayAmountInUsd: number = 0;
  repayAmount!: number;
  borrowAmount!: number;
  borrowRate: any = 0;
  verifiedHash: boolean = false;
  totalAmount: any
  networkVersion: any;
  urlToViewTransaction: any;
  platformFeesRate: number = 0;
  totalTransactionAmountRepay: any = 0;
  checkForApproval: any;
  checkMint: any
  maticurl = 'https://mumbai.polygonscan.com/tx/';
  borrowStep1: Boolean = true;
  borrowStep2: Boolean = false;
  borrowSuccess: Boolean = false;
  totalBorrowing: any = 0;
  commodityViewSection: Boolean = false;
  receiptViewSection: Boolean = true;
  lendingSuccess: Boolean = false;
  withdrawSuccess: Boolean = false;
  lendNowBtnClicked: Boolean = false;
  withdrawNowBtnClicked: Boolean = false;
  selectedTransaction: any;
  walletSection: Boolean = false;
  showExpandCollIcon: Boolean = false;
  totalTransactionAmount = 0;
  totalTransactionAmountWithDraw = 0;
  totalLending = 1200.0;
  remainingBalance: any = 220.0;
  fees = 0;
  lendAmount = 0;
  errorMessage = '';
  withdrawAmount = 0;
  gasPriceObject: any;
  borrowInterestAccrued: any = 0;
  selectedCoin: any = 'Tether (USDT)';
  RouterInstance: any;
  FactoryInstance: any;
  walletAddress: any = '';
  coinList = ['Tether (USDT)'];
  karmaPointTransactions: any;
  borrowTransactions: any = [
    // {
    //   'currency': "USDT",
    //   'value': "12.00"
    // }
  ];
  wallets: any = [
    // {
    //   'name': "Tether",
    //   'currency': "USDT",
    //   'value': "71.00"
    // }
  ];
  tData = [
    // {
    //   'name': "Matic",
    //   'apy': "20",
    //   'la': "2000",
    //   'ia': "40",
    //   'ct': "Agri Commodity",
    //   'lockin': "2"
    // },
  ];
  constructor(
    private nftService: NftService,
    private web3Service: Web3Service,
    private chainlinkService: ChainlinkAPIService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef,
    private scanapi: ScanApiService
  ) {
    this.web3Service.newEvent(this.router.url);
    this.borrowForm = this.fb.group({
      borrowAmount: [0],
      repayAmount: [0],
      nftId: [''],
      commodity: [''],
      quantity: [''],
      price: [''],
      borrowStatus: [''],
      amountBorrowed: [''],
      repaymentStatus: [''],
      amountRepayed: [''],
    });
  }


  async ngOnInit(): Promise<void> {
    this.totalBorrowing = 0;
    this.borrowTransactions = [];
    this.receiptViewSection = true;
    this.walletAddress = this.web3Service.getAccount();
    console.log(this.walletAddress, 'wallet address');
    this.checkConnectionAndLoadData();
    this.networkVersion = this.web3Service.getProvider().networkVersion;
    console.log('wallet address from ngonit', this.walletAddress);
  }
  async checkConnectionAndLoadData() {
    let accounts = await this.web3Service.checkConnection();
    console.log(accounts);
    if (!accounts) {
      this.router.navigateByUrl('/home/connect?request=true&redirect=borrow');
    }
    this.networkId = accounts[0] || '';
    console.log(this.networkId);
    if (this.networkId) {
      this.refreshData();
    } else {
      this.router.navigateByUrl('/home/connect?request=true&redirect=borrow');
      this.cd.detectChanges();
    }
  }

  async fetchGasPrice() {
    let response = await fetch('https://gasstation-mumbai.matic.today/v2')
    this.gasPriceObject = await response.json()
    console.log(this.gasPriceObject, "response")
    // console.log(,"response")
    // console.log(this.web3Service.convertGasPrice((this.gasPriceObject.fast.maxFee)),"response");
  }
  async refreshData() {
    this.web3Service.bootstrapWeb3().subscribe(
      (accounts: string[]) => {
        this.networkId = accounts[0] || '';
        console.log(this.networkId);
        this.loadData();
      },
      (err) => {
        alert('Web3 bootstrap failed');
      }
    );
    this.RouterInstance = this.web3Service.artifactsToRouterContract();
    this.FactoryInstance = this.web3Service.artifactsToFactoryContract();

    this.cd.detectChanges();
  }
  commodityView() {
    document.getElementById('lp')?.classList.add('active');
    document.getElementById('wd')?.classList.remove('active');
    document.getElementById('mw')?.classList.remove('active');
    this.commodityViewSection = true;
    this.receiptViewSection = false;
    this.walletSection = false;
  }
  async withdraw() {
    // alert(this.web3Service.getAccount())
    let poolAddress = await this.RouterInstance.methods
      .getPoolAddress(0)
      .call();
    let rates = await this.web3Service
      .artifactsToPoolContract(poolAddress)
      .methods.rates()
      .call();
    console.log('rates of pool', rates);
    let platformFees = await this.web3Service
      .artifactsToPoolContract(poolAddress)
      .methods.platformFees()
      .call();
    console.log(platformFees, 'platform fees');

    let borrowRateinWei = rates.borrow;
    this.borrowRate =
      parseFloat(this.web3Service.convertToLargestUnit(borrowRateinWei)) * 100;
    let platformFeesRateInWei = platformFees.borrow;
    let platformFeesRate = parseFloat(
      this.web3Service.convertToLargestUnit(platformFeesRateInWei)
    );
    console.log('Platform fee Rate', platformFeesRate);
    this.platformFeesRate = platformFeesRate;
    document.getElementById('lp')?.classList.remove('active');
    document.getElementById('wd')?.classList.add('active');
    document.getElementById('mw')?.classList.remove('active');
    this.commodityViewSection = false;
    this.receiptViewSection = true;
    this.walletSection = false;
  }
  async myWallet() {
    document.getElementById('lp')?.classList.remove('active');
    document.getElementById('wd')?.classList.remove('active');
    document.getElementById('mw')?.classList.add('active');
    this.totalBorrowing = 0;
    this.borrowTransactions = [];

    this.commodityViewSection = false;
    this.receiptViewSection = false;
    this.walletSection = true;
    const walletBalance = await this.web3Service
      .artifactsToIERCContract()
      .methods.balanceOf(this.web3Service.getAccount())
      .call();
    this.walletAddress = this.web3Service.getAccount();
    let balance = await this.getLentAmount();
    this.processPoolEvents();
    this.processPoolRepayEvents();
    this.wallets = [
      {
        name: 'USD Tether',
        currency: 'USDT',
        value: parseFloat(
          this.web3Service.convertToLargestUnit(walletBalance)
        ).toFixed(4),
      },
      {
        name: 'Brú Bonds',
        currency: 'Brú Bonds',
        value: parseFloat(balance).toFixed(4),
      },
      
    ];
  }

  async processPoolEvents() {
    // console.log(' check wallet history');
    // console.log(this.walletAddress);
    // this.scanapi.getTransactions(this.walletAddress).subscribe(res => {
    //   console.log(res);
    // });
   
    let poolDetails = await this.getPoolDetails(0);
    const blockNumber = await this.web3Service.getWeb3().eth.getBlockNumber();

    let transactions = await this.web3Service
      .artifactsToPoolContract(poolDetails.proxyPoolAddress)
      .getPastEvents('BorrowEvent', {
        filter: { userAddress: this.walletAddress },
        fromBlock: 0,
        toBlock: 'latest',
      });
    
    for (let transaction of transactions) {
      let transactionValues = transaction.returnValues;
      let transactionObject;
     
      if (transactionValues._type == '1') {
        transactionObject = {
          type: 'Borrow',
          amount: this.web3Service.convertToLargestUnit(
            transactionValues.tokenAmount
          ),
          time: new Date(transactionValues.timestamp * 1000),
          transactionHash: transaction.transactionHash,
        };
        console.log(" === check object == ");
        console.log(transactionObject.amount)
        this.totalBorrowing +=  parseFloat(transactionObject.amount);
      }
      if (transactionValues._type == '2') {
        transactionObject = {
          type: 'withdraw',
          amount: this.web3Service.convertToLargestUnit(
            transactionValues.tokenAmount
          ),
          time: new Date(transactionValues.timestamp * 1000),
          transactionHash: transaction.transactionHash,
        };
      }
      this.borrowTransactions.push(transactionObject);
    }

   
    // return this.processTransaction(result)
    console.log(this.borrowTransactions);
    // this.showLoaderForWalletTransactions = false;
    // if (this.borrowTransactions.length == 0) {
    //   this.noTransactions = true;
    // }
    // this.wTransactions = this.wTransactions.splice(
    //   Math.max(this.wTransactions.length - 4)
    // );
  }


  async processPoolRepayEvents() {
    let poolDetails = await this.getPoolDetails(0);
    const blockNumber = await this.web3Service.getWeb3().eth.getBlockNumber();

    let transactions = await this.web3Service
      .artifactsToPoolContract(poolDetails.proxyPoolAddress)
      .getPastEvents('RepayEvent', {
        filter: { userAddress: this.walletAddress },
        fromBlock: blockNumber - 1000,
        toBlock: blockNumber,
      });
    
    for (let transaction of transactions) {
      let transactionValues = transaction.returnValues;
      let transactionObject;
     
      if (transactionValues._type == '1') {
        transactionObject = {
          type: 'Repay',
          amount: this.web3Service.convertToLargestUnit(
            transactionValues.tokenAmount
          ),
          time: new Date(transactionValues.timestamp * 1000),
          transactionHash: transaction.transactionHash,
        };
        this.totalBorrowing +=  parseFloat(transactionObject.amount);
      }
      if (transactionValues._type == '2') {
        transactionObject = {
          type: 'withdraw',
          amount: this.web3Service.convertToLargestUnit(
            transactionValues.tokenAmount
          ),
          time: new Date(transactionValues.timestamp * 1000),
          transactionHash: transaction.transactionHash,
        };
      }
      this.borrowTransactions.push(transactionObject);
    }

    // return this.processTransaction(result)
    console.log(this.borrowTransactions);
    // this.showLoaderForWalletTransactions = false;
    // if (this.borrowTransactions.length == 0) {
    //   this.noTransactions = true;
    // }
    // this.wTransactions = this.wTransactions.splice(
    //   Math.max(this.wTransactions.length - 4)
    // );
  }

  hideLowBalance(values: any): void {
    console.log(values.currentTarget.checked);
  }
  async getPoolDetails(index: number) {
    let poolDetails = await this.web3Service
      .artifactsToFactoryContract()
      .methods.getPoolDetails(index)
      .call();
    return poolDetails;
  }

  async getBorrowAmount() {
    let amountInWei = await this.web3Service
      .artifactsToBTokenContract()
      .methods.balanceOf(this.web3Service.getAccount())
      .call();
      console.log("=================  ")
      console.log(amountInWei);
    return this.web3Service.convertToLargestUnit(amountInWei);
  }

  async getLentAmount() {
    let poolDetails = await this.getPoolDetails(0);
    let amountInWei = await this.web3Service
      .artifactsToIERCContractPoolToken(poolDetails.poolTokenAddress)
      .methods.balanceOf(this.web3Service.getAccount())
      .call();
    return this.web3Service.convertToLargestUnit(amountInWei);
  }

  async lendMore(data: any, content: TemplateRef<any>) {
    alert('clicked lend');
    this.lendingSuccess = false;
    this.selectedTransaction = data;
    await this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    }).result;
  }

  async withdrawM(data: any, content: TemplateRef<any>) {
    alert('clicked withdrwa');
    this.withdrawSuccess = false;
    this.selectedTransaction = data;
    await this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    }).result;
  }
  lendNow() { }
  handleLendNow() {
    alert('clicked lendnow');
    console.log('clicked lendnow');
    this.lendNowBtnClicked = true;
    console.log(this.lendAmount);
    console.log(this.selectedCoin);
    if (!this.selectedCoin || !this.lendAmount) {
      console.log('Please select coin and enter lend amount.');
    }
    console.log('Lend Now clicked');
    this.lendNowBtnClicked = false;
    this.lendingSuccess = true;
  }

  handleWithDrawNow() {
    alert('clicked withdrawnow');
    console.log('clicked withdrawnow');
    this.withdrawNowBtnClicked = true;
    console.log(this.withdrawAmount);
    console.log(this.selectedCoin);
    if (!this.selectedCoin || !this.withdrawAmount) {
      console.log('Please select coin and enter lend amount.');
    }
    console.log('Withdraw Now clicked');
    this.withdrawNowBtnClicked = false;
    this.withdrawSuccess = true;
  }

  calculateFees(val: number) {
    console.log(val);
    this.fees = 0;
    if (val == null || val == undefined || val == 0) {
      this.fees = 0;
      this.totalTransactionAmount = 0;
      this.borrowAmountInUsd = 0;
    }
    // let _borrowAmount = Number((val / 76.50).toFixed(4));
    this.borrowAmountInUsd = val;
    if (this.borrowAmountInUsd > 0) {
      this.fees = Number((this.borrowAmountInUsd * (0.3 / 100)).toFixed(4));
      // this.totalTransactionAmount = Number((this.borrowAmountInUsd + this.fees).toFixed(4))
      this.totalTransactionAmount = val;
    }
  }
  calculateFeesForRepay(val: number) {
    console.log(val);
    console.log(typeof val);
    if (val == null || val == undefined || val == 0) {
      this.fees = 0;
      this.totalTransactionAmountRepay = 0;
      this.repayAmountInUsd = 0;
    }
    this.fees = 0;
    // let _repayAmount = Number((val / 76.50).toFixed(4));
    this.repayAmountInUsd = Number(val);
    if (this.repayAmountInUsd > 0) {
      this.fees = Number(
        (this.repayAmountInUsd * this.platformFeesRate).toFixed(4)
      );
      console.log(this.repayAmountInUsd, this.platformFeesRate, 'repay amount');
      this.totalAmount = Number(
        this.repayAmountInUsd + this.fees
      );

      // this.totalTransactionAmountRepay = Number(
      //   this.repayAmountInUsd - this.fees
      // );
      //
      this.totalTransactionAmountRepay = Number(this.repayAmountInUsd);
    }
  }

  convertInrToUsd(price: any) {
    return this.chainlinkService.convertInrToUsd(price).toFixed(2);
  }

  calculateFeesForWithdraw(val: number) {
    console.log(val);
    this.fees = 0;
    this.withdrawAmount = Number(val);
    if (this.withdrawAmount > 0) {
      this.fees = Number((this.withdrawAmount * (0.25 / 100)).toFixed(4));
      this.totalTransactionAmountWithDraw = Number(
        this.withdrawAmount + this.fees
      );
    }
  }
  collapseTL() {
    console.log('Collapse upper');
    this.showExpandCollIcon = !this.showExpandCollIcon;
    const doc = document.getElementById('ltlist');
    if (doc) doc.style.display = 'none';
    const doc2 = document.getElementById('kplist');
    if (doc2) doc2.style.display = 'block';
    document
      .getElementById('totalLendingSection')
      ?.classList.add('collapseUpper');
    document
      .getElementById('totalLendingSection')
      ?.classList.remove('expandUpper');
    document.getElementById('karmaPointSection')?.classList.add('expandUpper');
    document
      .getElementById('karmaPointSection')
      ?.classList.remove('collapseUpper');
  }
  expandTL() {
    console.log('expand upper');
    this.showExpandCollIcon = !this.showExpandCollIcon;
    const doc = document.getElementById('ltlist');
    if (doc) doc.style.display = 'block';
    const doc2 = document.getElementById('kplist');
    if (doc2) doc2.style.display = 'none';
    document
      .getElementById('totalLendingSection')
      ?.classList.add('expandUpper');
    document
      .getElementById('totalLendingSection')
      ?.classList.remove('collapseUpper');
    document
      .getElementById('karmaPointSection')
      ?.classList.add('collapseUpper');
    document
      .getElementById('karmaPointSection')
      ?.classList.remove('expandUpper');
  }
  collapseKP() {
    console.log('Collapse down');
    this.showExpandCollIcon = !this.showExpandCollIcon;
    const doc = document.getElementById('kplist');
    if (doc) doc.style.display = 'none';
    const doc2 = document.getElementById('ltlist');
    if (doc2) doc2.style.display = 'block';
    document
      .getElementById('totalLendingSection')
      ?.classList.add('expandUpper');
    document
      .getElementById('totalLendingSection')
      ?.classList.remove('collapseUpper');
    document
      .getElementById('karmaPointSection')
      ?.classList.add('collapseUpper');
    document
      .getElementById('karmaPointSection')
      ?.classList.remove('expandUpper');
  }
  expandKP() {
    console.log('expand down');
    this.showExpandCollIcon = !this.showExpandCollIcon;
    const doc = document.getElementById('kplist');
    if (doc) doc.style.display = 'block';
    const doc2 = document.getElementById('ltlist');
    if (doc2) doc2.style.display = 'none';
    document
      .getElementById('totalLendingSection')
      ?.classList.add('collapseUpper');
    document
      .getElementById('totalLendingSection')
      ?.classList.remove('expandUpper');
    document.getElementById('karmaPointSection')?.classList.add('expandUpper');
    document
      .getElementById('karmaPointSection')
      ?.classList.remove('collapseUpper');
  }
  copyAddress() {
    document.getElementById('myPopup')?.classList.toggle('show');
    setTimeout(() => {
      document.getElementById('myPopup')?.classList.toggle('show');
    }, 3000);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.walletAddress;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  // Exisiting Code
  // NFT cards

  updateNFTVal() {
    // this.selectedNft = { ...changes.nft.currentValue };
    this.img = this.selectedNft.commodity.replace(
      '/',
      '-',
      ' ',
      '-',
      '  ',
      '-'
    );

    console.log(this.selectedNft);
    let hashFromDB = this.selectedNft.dataHash;
    console.log(hashFromDB, 'HASH from db');
    // console.log(,"deposit app id")
    if (hashFromDB) {
      let resultObject = this.nftService.getHash(
        this.selectedNft.depositApplicationID._id,
        this.selectedNft._id
      );
      resultObject.subscribe((result: any) => {
        console.log(result, 'request result');
        if (result.hashMatched == true) {
          this.verifiedHash = true;
          console.log('Hashes match');
        } else {
          this.verifiedHash = false;
          console.log("Hashes don't match");
        }
      });
    }
    const {
      _id,
      commodity,
      quantity,
      nftPrice,
      borrowed,
      borrowedAmount,
      repaid,
      repaidAmount,
    } = this.selectedNft;

    const usdCharges = this.chainlinkService.roundOffDecimal(
      this.chainlinkService.convertInrToUsd(nftPrice)
    );

    const usdRepaid = this.chainlinkService.roundOffDecimal(
      this.chainlinkService.convertInrToUsd(repaidAmount)
    );
    // const usdBorrowed = this.chainlinkService.roundOffDecimal(
    //   this.chainlinkService.convertInrToUsd(borrowedAmount)
    // );
    const usdBorrowed =
      this.web3Service.convertToLargestUnit(borrowedAmount) + ' MATIC';

    this.borrowForm.patchValue({
      nftId: _id,
      commodity: commodity,
      quantity: quantity,
      price: usdCharges,
      borrowStatus: borrowed,
      amountBorrowed: usdBorrowed,
      repaymentStatus: repaid,
      amountRepaid: usdRepaid,
    });

    if (borrowed) {
      this.borrowForm.controls.repayAmount.addValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(borrowedAmount),
      ]);
    } else {
      this.borrowForm.controls.borrowAmount.addValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(
          Math.round((usdCharges * 0.7 + Number.EPSILON) * 100) / 100
        ),
      ]);
    }
  }

  loadData(query: NftSearchQuery = {}) {
    if (!this.networkId) {
      alert('Web3 network id not found');
      return;
    }
    console.log('Network ID : ' + this.networkId);

    this.showSpinner = true;
    const skip = query.skip || this.nfts.length;
    const limit = query.limit || 10;
    const networkId = this.networkId;

    const searchQuery: NftSearchQuery = {
      skip,
      limit,
      networkId,
    };
    console.log(searchQuery);

    this.nftService
      .getAllNfts(searchQuery)
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
      });
  }
  async handleMint(event: any, index: any) {
    this.selectedNft = event;
    console.log('handle mint called');
    // setTimeout(() => {
    // this.mintBtnClicked.emit({ mint: true, index: index });
    // }, 5000);
    // return;
    // let pool = await this.RouterInstance.methods.getPoolAddress(0).call();
    console.log(this.FactoryInstance);

    let poolDetails = await this.FactoryInstance.methods
      .getPoolDetails(0)
      .call();
    console.log('mint nft pool details', poolDetails);
    let treasuryAddress = poolDetails.treasuryAddress;
    console.log('treasuryAddress', treasuryAddress);

    this.walletAddress = await this.web3Service.getAccount();
    console.log('wallet address', this.walletAddress);
    try {
      let treasuryInstance =
        this.web3Service.artifactsToTreasuryContract(treasuryAddress);
      console.log('treasuryAddress', treasuryAddress, treasuryInstance);
      console.log('post treasury Address');
      console.log('selected nft', this.selectedNft);

      let nftObject = {
        nftId: this.selectedNft._id,
        commodity: this.selectedNft.commodity,
        commodityId: this.selectedNft.commodityId,
        quantity: this.selectedNft.quantity,
        nftPrice: this.selectedNft.nftPrice,
        pool: this.selectedNft.pool,
        dataHash: this.selectedNft.dataHash,
      };
      console.log('Data to send', nftObject);
      let convertedNftPriceToUsd = this.chainlinkService.convertInrToUsd(
        this.selectedNft.nftPrice
      );
      let convertedNftPriceInWei = this.web3Service.convertToSmallestUnit(
        convertedNftPriceToUsd
      );
      await this.fetchGasPrice()

      let mintTransaction = await treasuryInstance.methods
        .mintNft(
          this.walletAddress,
          this.selectedNft._id,
          this.selectedNft.commodityId,
          this.web3Service.convertToSmallestUnit(this.selectedNft.quantity),
          convertedNftPriceInWei,
          this.selectedNft.dataHash,
          JSON.stringify(nftObject)
        )
        .estimateGas(
          { from: this.web3Service.getAccount() },
          function (error: any, gasAmount: number) {
            console.log(gasAmount, 'gas Amount');
          }
        );
      treasuryInstance.methods
        .mintNft(
          this.walletAddress,
          this.selectedNft._id,
          this.selectedNft.commodityId,
          this.web3Service.convertToSmallestUnit(this.selectedNft.quantity),
          convertedNftPriceInWei,
          this.selectedNft.dataHash,
          JSON.stringify(nftObject)
        )
        .send({
          from: this.web3Service.getAccount(),
          gasPrice: Math.floor((this.gasPriceObject.fast.maxFee * (10 ** 9))),

          gas: Math.round(mintTransaction * 2),
        })
        .on('receipt', (receipt: any) => {

          console.log("receipt", receipt)
          if (receipt.status == true) {
            console.log('nft minted')
            this.updateNft(this.selectedNft._id, {
              minted: true,
              mintedTransactionHash: receipt.transactionHash,
              ownerAddress: this.web3Service.getAccount(),
            });
            console.log('console log A');
            this.mintBtnClicked.emit({ mint: true, index: index });
          }
        })
      // this.checkMint = setInterval(async () => {
      //   console.log("setting interval for minting nft")
      //   let web3 = new Web3(window.ethereum)
      //   let mintTransaction = await web3.eth.getTransactionReceipt(mintNftTransaction['transactionHash'])
      //   if (mintTransaction.status == true) {
      //     clearInterval(this.checkMint)
      //     console.log("interval for mint transaction")
      //     this.updateNft(this.selectedNft._id, {
      //       minted: true,
      //       mintedTransactionHash: mintNftTransaction.transactionHash,
      //       ownerAddress: this.web3Service.getAccount(),
      //     });
      //     console.log('console log A');
      //     this.mintBtnClicked.emit({ mint: true, index: index });
      //   }

      // }, 2000)
      // console.log("mint transaction", mintNftTransaction)
      // if (mintNftTransaction['status'] == true) {
      //   console.log("successfully minted NFT ")

      // }

    } catch (error) {
      console.log(error);
      this.mintBtnClicked.emit({ mint: false, index: index });
      // this.mintBtnClicked.emit({ mint: true, index: index });
    }
  }
  async handleBorrow(event: any, modal: any) {
    console.log(event);
    this.selectedNft = event;
    this.modalService.open(modal, {
      windowClass: 'BorrowModal_new',
      backdrop: 'static',
      keyboard: false,
    });
    if (!this.borrowRate) {
      let poolAddress = await this.RouterInstance.methods
        .getPoolAddress(0)
        .call();
      let rates = await this.web3Service
        .artifactsToPoolContract(poolAddress)
        .methods.rates()
        .call();
      console.log('rates of pool', rates);
      let borrowRateinWei = rates.borrow;
      this.borrowRate =
        parseFloat(this.web3Service.convertToLargestUnit(borrowRateinWei)) *
        100;
    }
    this.updateNFTVal();
  }

  // checkMintTransaction(transactionHash:string){
  //   Web3.modules.Eth.getTransaction
  // }

  verfiyHash() {
    // console.log(this.se)
  }
  async GoToBorrowStep2() {
    this.borrowStep1 = false;
    // alert("step3")
    this.borrowStep2 = true;

    // const stringNFT = JSON.stringify(this.selectedNft)
    // const usd = this.chainlinkService.convertInrToUsd(this.selectedNft.nftPrice)
    // console.log(usd, "usd value")
    // const commodityValue = this.convertDollarToMatic(usd)
    // console.log(commodityValue, "commodity value")
    // const nftValue = this.chainlinkService.convertEthToWei(parseInt(commodityValue))
    // console.log(nftValue, "nft valuue")
    // console.log(this.chainlinkService.priceConversions.maticUsd, "Conversion multiplier")
    // console.log(this.borrowForm.value.price, "Price USD")
    // this.web3Service.artifactsToContractV2().methods.createToken(this.selectedNft._id, stringNFT, nftValue).send({
    //   from: this.web3Service.getAccount()
    // }).then((result: any) => {
    //   console.log(result, "mint nft result")
    // })
    this.updateNFTVal();
  }

  async handleRepay(event: any, modal: any) {
    console.log('entered and clicked repay');
    console.log(event);
    this.selectedNft = event;
    if (!this.platformFeesRate) {
      let poolAddress = await this.RouterInstance.methods
        .getPoolAddress(0)
        .call();
      let platformFees = await this.web3Service
        .artifactsToPoolContract(poolAddress)
        .methods.platformFees()
        .call();
      console.log(platformFees, 'platform fees');

      let platformFeesRateInWei = platformFees.borrow;
      let platformFeesRate = parseFloat(
        this.web3Service.convertToLargestUnit(platformFeesRateInWei)
      );
      console.log('Platform fee Rate [ Repayment Function ]', platformFeesRate);
      this.platformFeesRate = platformFeesRate;
    }
    this.modalService.open(modal, {
      windowClass: 'BorrowModal_new',
      backdrop: 'static',
      keyboard: false,
    });
    let poolAddress = await this.RouterInstance.methods
      .getPoolAddress(0)
      .call();
    let nft = await this.web3Service
      .artifactsToPoolContract(poolAddress)
      .methods.borrowedNft(this.selectedNft._id)
      .call();
    console.log(nft, 'borrowed nft result');
    // this.totalBorrowing = nft.borrowedAmount;
    this.totalBorrowing = this.web3Service.convertToLargestUnit(
      nft.borrowedAmount
    );
    let Expense = await this.web3Service
      .artifactsToPoolContract(poolAddress)
      .methods.totalExpense(this.selectedNft._id)
      .call();
    let borrowInterestAmount = Expense.interest;
    this.borrowInterestAccrued =
      this.web3Service.convertToLargestUnit(borrowInterestAmount);
    //this.repayAmount = this.repayAmount-
    this.updateNFTVal();
  }
  async handleSubmitRepay(errorModal: TemplateRef<any>) {
    this.eventName = {
      name: 'repay',
    };
    //   this.web3Service.artifactsToContractV2().methods.borrow(1,"").send({
    //     from:this.web3Service.getAccount(),
    //     gas:"210000"
    // }).then((result:any)=>{
    //   console.log("borrow agins nft",result)
    // })
    const value = {
      nftId: this.borrowForm.value.nftId,
      repayAmount: this.chainlinkService.roundOffDecimal(
        this.chainlinkService.convertUsdToInr(this.repayAmount)
      ),
    };
    this.showLoaderForRepay = true;
    let poolAddress = await this.RouterInstance.methods
      .getPoolAddress(0)
      .call();
    console.log('pool Address from repay', poolAddress);

    let nft = await this.web3Service
      .artifactsToPoolContract(poolAddress)
      .methods.borrowedNft(this.selectedNft._id)
      .call();
    console.log(nft, 'Borrowed nft details');
    let convertedRepayAmount = this.web3Service.convertToSmallestUnit(
      this.totalAmount

    );
    let approveTransactionCompletion: boolean = false;
    let depositTransactionCompletion: boolean = false;



    try {
      let approvalTransactionGas = await this.web3Service.artifactsToIERCContract().methods.approve(poolAddress, convertedRepayAmount).estimateGas(
        { from: this.web3Service.getAccount() }
      );
      await this.fetchGasPrice()
      let approvalTransactionResult = await this.web3Service
        .artifactsToIERCContract()
        .methods.approve(poolAddress, convertedRepayAmount)
        .send({
          from: this.web3Service.getAccount(),
          gasPrice: Math.floor((this.gasPriceObject.fast.maxFee * (10 ** 9))),

          gas: Math.round(approvalTransactionGas * 1.2),
        });
      console.log(approvalTransactionResult, 'approval result');

      console.log('Selected NFT', this.selectedNft._id);
      console.log('Repay Amount', convertedRepayAmount);
      console.log('Token Addres', environment.TokenAddress);
      this.checkForApproval = setInterval(async () => {
        let web3 = new Web3(window.ethereum)
        let approvalTransaction = await web3.eth.getTransactionReceipt(approvalTransactionResult['transactionHash'])
        if (approvalTransaction.status == true) {
          console.log("interval for repay transaction")
          clearInterval(this.checkForApproval);
          await this.fetchGasPrice()

          let repayTransactionGas = await this.RouterInstance.methods
            .repay(
              0,
              this.selectedNft._id,
              environment.TokenAddress,
              convertedRepayAmount
            )
            .estimateGas(
              { from: this.web3Service.getAccount() }
            );
          let repaytx = await this.RouterInstance.methods
            .repay(
              0,
              this.selectedNft._id,
              environment.TokenAddress,
              convertedRepayAmount
            )
            .send({
              from: this.web3Service.getAccount(),
              gasPrice: Math.floor((this.gasPriceObject.fast.maxFee * (10 ** 9))),

              gas: Math.round(repayTransactionGas * 2),
            });

          let nft = await this.web3Service
            .artifactsToPoolContract(poolAddress)
            .methods.borrowedNft(this.selectedNft._id)
            .call();
          console.log(nft, 'borrowed nft result');
          //this.remainingBalance = this.web3Service.convertToLargestUnit(nft.borrowedAmount)
          //to be changed back
          this.remainingBalance = this.web3Service.convertToLargestUnit(
            nft.borrowedAmount
          );
          console.log(this.remainingBalance, 'remaining balance');
          this.showLoaderForRepay = false;
          if (repaytx['status']) {
            this.repaySuccess = true;
            this.borrowSuccess = false;
            this.urlToViewTransaction = this.maticurl + repaytx['transactionHash'];
            this.refreshData();
          } else {
            this.errorMessage =
              "The transaction couldn't be processed by the Blockchain. Please try again in sometime.";
            await this.modalService.open(errorModal, {
              ariaLabelledBy: 'modal-basic-title',
            }).result;
          }
        }
      }, 1000)
      // if (approvalTransactionResult['status'] == true) {
      //   approveTransactionCompletion = true;

      // }


    } catch (error: any) {
      console.log('Error while repaying');
      console.log(error);
      console.log('Showing Error modal');
      this.errorMessage = '';
      if (error['code'] == 4001) {
        this.errorMessage =
          'User rejected the transaction. Please go back and click on Repay again to continue with the transaction.';
      } else {
        this.errorMessage =
          "The transaction couldn't be processed by the Blockchain. Please try again in sometime.";
      }
      await this.modalService.open(errorModal);
      this.showLoaderForRepay = false;
    }

    // this.web3Service.artifactsToContractV2().methods.getTokenId(this.selectedNft._id).call()
    //   .then((tokenId: any) => {
    //     this.web3Service.artifactsToContractV2().methods.getBorrowDetails(tokenId).call()
    //       .then((borrowDetails: any) => {
    //         const borrowedAmount = borrowDetails[0]
    //         const borrowedOn = borrowDetails[1]
    //         const interest = borrowDetails[2]
    //         const borrowInterest = this.getBorrowInterest(borrowDetails)
    //         console.log(borrowInterest, "Borrow amount")
    //         const newAmount = this.repayAmount + borrowInterest
    //         const amount = this.chainlinkService.convertEthToWei(newAmount)
    //         console.log(amount, "repay amount")
    //         this.web3Service.artifactsToContractV2().methods.repay(tokenId, Math.round(borrowInterest * 10 ** 18)).send({
    //           from: this.web3Service.getAccount(),
    //           gas: "210000",
    //           value: amount
    //         }).then((result: any) => {
    //           console.log("borrow agins nft", result)
    //           this.urlToViewTransaction = this.maticurl + result["transactionHash"]
    //           this.borrowSuccess = false;
    //           this.repaySuccess = true;
    //           this.showLoaderForRepay = false;
    //           this.modalService.open(modal, { backdrop: 'static', keyboard: false });
    //           this.updateNft(this.borrowForm.value.nftId, { repayed: true, repayedAmount: amount });
    //         }).catch((error: any) => {
    //           this.showLoaderForRepay = false;
    //           console.log(error, "Error in while repaying", error)
    //         })
    // console.log(borrowInterest,"Borrowed INterest")
    // this.borrowForm.controls['amountBorrowed'].setValue(this.web3Service.convertToLargestUnit(borrowDetails[0])+" MATIC");
    // })

    // })
    // console.log(value)
    // this.showLoaderForRepay = true;
    // this.repayBorrowInternal(value.repayAmount, value.nftId);
  }
  getBorrowInterest(borrowDetails: any): number {
    const currentTime = Math.round(new Date().getTime() / 1000);
    const difference = currentTime - parseInt(borrowDetails[1]);
    let days = difference / (60 * 60 * 24);
    let interest;
    days = 1;
    if (days >= 1) {
      const principalAmount = parseFloat(
        this.web3Service.convertToLargestUnit(borrowDetails[0])
      );
      interest = (days * principalAmount * 0.13) / 365;
      return interest;
    } else {
      return 0;
    }
  }

  async handleSubmitBorrow(errorModal: TemplateRef<any>) {
    this.showLoaderForBorrow = true;
    console.log('nft id,', this.selectedNft._id);
    let convertedBorrowAmount = this.web3Service.convertToSmallestUnit(
      this.borrowAmount
    );
    console.log(convertedBorrowAmount, 'Pricee Entered');
    console.log('wallet Address', this.web3Service.getAccount());
    let pool = await this.RouterInstance.methods.getPoolAddress(0).call();
    console.log(this.FactoryInstance);

    let poolDetails = await this.FactoryInstance.methods
      .getPoolDetails(0)
      .call();
    let treasuryAddress = poolDetails.treasuryAddress;
    console.log('Pool Address', pool);
    console.log('NFT id', this.selectedNft._id);
    console.log('tokenAddress', environment.TokenAddress);
    try {
      //     this.walletAddress = await this.web3Service.getAccount();
      //     console.log("wallet address",this.walletAddress);
      // let treasuryInstance = this.web3Service.artifactsToTreasuryContract(treasuryAddress);
      // console.log("treasuryAddress",treasuryAddress,treasuryInstance);
      // let nftObject = {
      //   nftId: this.selectedNft._id,
      //   commodity: this.selectedNft.commodity,
      //   commodityId:this.selectedNft.commodityId,
      //   quantity: this.selectedNft.quantity,
      //   nftPrice: this.selectedNft.nftPrice,
      //   pool: this.selectedNft.pool,
      //   dataHash:this.selectedNft.dataHash,
      // };
      // console.log('Data to send',nftObject);

      //     let mintNft = await treasuryInstance.methods.mintNft(this.walletAddress,this.selectedNft._id, this.selectedNft.commodityId, this.selectedNft.quantity, this.selectedNft.nftPrice,this.selectedNft.dataHash, JSON.stringify(nftObject))
      //     .send({ from: this.web3Service.getAccount(),  gasLimit: '0xFFFFF1' });
      //     console.log("minted nft",mintNft);
      await this.fetchGasPrice()
      let  borrowTransactionGas = await this.RouterInstance.methods
            .borrow(
              0,
              this.selectedNft._id,
              environment.TokenAddress,
              convertedBorrowAmount
            )
            .estimateGas(
              { from: this.web3Service.getAccount() }
            );
      let result = await this.RouterInstance.methods
        .borrow(
          0,
          this.selectedNft._id,
          environment.TokenAddress,
          convertedBorrowAmount
        )
        .send({ from: this.web3Service.getAccount(),gasPrice:Math.floor((this.gasPriceObject.fast.maxFee * (10 ** 9)))  , gas: Math.floor(borrowTransactionGas) });
      console.log('Borrow Result', result);
      if (result['status']) {
        this.showLoaderForBorrow = false;
        console.log('borrow agins nft', result);
        let nft = await this.web3Service
          .artifactsToPoolContract(pool)
          .methods.borrowedNft(this.selectedNft._id)
          .call();
        console.log(nft, 'borrowed nft result');
        this.totalBorrowing = this.web3Service.convertToLargestUnit(
          nft.borrowedAmount
        );
        // this.totalBorrowing = nft.borrowedAmount;
        this.urlToViewTransaction = this.maticurl + result['transactionHash'];
        this.updateNft(this.borrowForm.value.nftId, {
          borrowed: true,
          borrowedAmount: convertedBorrowAmount,
          borrowTxHash: result.transactionHash,
        });
        this.refreshData();
        // this.modalService.open(modal, { backdrop: 'static', keyboard: false });
        this.borrowStep2 = false;
        this.borrowSuccess = true;
      } else {
        this.errorMessage =
          "The transaction couldn't be processed by the Blockchain. Please try again in sometime.";
        await this.modalService.open(errorModal);
      }
    } catch (error: any) {
      console.log('Error in borrowing');
      console.log(error);
      console.log('Showing Error modal');
      this.errorMessage = '';
      if (error['code'] == 4001) {
        this.errorMessage =
          'User rejected the transaction. Please go back and click on Borrow again to continue with the transaction.';
      } else {
        this.errorMessage =
          "The transaction couldn't be processed by the Blockchain. Please try again in sometime.";
      }
      await this.modalService.open(errorModal);
      this.showLoaderForBorrow = false;
    }

    // this.eventName = {
    //   name: eventName
    // };
    // console.log("INTERNAL BORROW")
    // const amount = this.web3Service.convertToSmallestUnit('0.03')
    // console.log(amount, "amount iwei")
    // this.showLoaderForBorrow = true;

    // this.web3Service.artifactsToContractV2().methods.getTokenId(this.selectedNft._id).call()
    //   .then((tokenId: any) => {
    //     console.log(tokenId, "token id")
    //     // const amount = Math.round((this.borrowForm.value.borrowAmount) * (10 ** 18))
    //     // const amount = Math.round((this.borrowAmount) * (10 ** 18))
    //     const amount = this.chainlinkService.convertEthToWei(this.borrowAmount)
    //     console.log(amount, "amount to borrow")
    //     this.web3Service.artifactsToContractV2().methods.borrow(amount, tokenId).send({
    //       from: this.web3Service.getAccount(),
    //       gas: "210000"
    //     }).then((result: any) => {
    //       this.showLoaderForBorrow = false;
    //       console.log("borrow agins nft", result)
    //       this.urlToViewTransaction = this.maticurl + result["transactionHash"]
    //       this.updateNft(this.borrowForm.value.nftId, { borrowed: true, borrowedAmount: amount });
    //       // this.modalService.open(modal, { backdrop: 'static', keyboard: false });
    //       this.borrowStep2 = false;
    //       this.borrowSuccess = true;
    //     }).catch((error: any) => {
    //       this.showLoaderForBorrow = false;
    //       console.log("Error while borrowing", error)
    //     })
    //   })

    // const value = {
    //   nftId: this.borrowForm.value.nftId,
    //   borrowAmount: this.chainlinkService.roundOffDecimal(
    //     this.chainlinkService.convertUsdToInr(
    //       this.borrowForm.value.borrowAmount
    //     )
    //   ),
    // };
    // console.log(value)
    // this.borrowInternal(value.borrowAmount, value.nftId);
  }

  handleShowMore() {
    this.loadData();
  }

  resetValuesAfterSuccessBorrowAndRepay() {
    this.modalService.dismissAll();
    this.borrowAmount = 0;
    this.repayAmount = 0;
    this.borrowStep1 = true;
    this.borrowStep2 = false;
    this.borrowSuccess = false;
    this.repaySuccess = false;
    this.fees = 0;
    this.totalTransactionAmount = 0;
    this.totalRepaymentAmount = 0;
    this.repayAmountInUsd = 0;
    this.borrowAmountInUsd = 0;
  }

  borrowInternal(amount: number, nftId: string) {
    const usdBorrow = this.chainlinkService.roundOffDecimal(
      this.chainlinkService.convertInrToUsd(amount),
      8
    );
    const usdEth = this.chainlinkService.convertUsdToEth(usdBorrow);
    const ethWei = this.chainlinkService.convertEthToWei(usdEth);

    const sc = environment.ABI.networks[3].address;
    this.nftService
      .borrowInternal(ethWei, nftId, sc)
      .then((data: any) => {
        console.log(data);
        this.urlToViewTransaction = this.maticurl + data['transactionHash'];
        this.updateNft(nftId, { borrowed: true, borrowedAmount: amount });
      })
      .catch((err: any) => {
        this.showLoaderForRepay = false;
        console.log(err);
      });
  }

  repayBorrowInternal(amount: any, nftId: any) {
    const usdRepay = this.chainlinkService.roundOffDecimal(
      this.chainlinkService.convertInrToUsd(amount),
      8
    );
    const usdEth = this.chainlinkService.convertUsdToEth(usdRepay);
    const ethWei = this.chainlinkService.convertEthToWei(usdEth);

    const sc = environment.ABI.networks[3].address;

    console.log({ amount, usdRepay, usdEth, ethWei });

    this.nftService
      .repayBorrowInternal(ethWei, nftId, sc)
      .then((data: any) => {
        console.log(data);
        this.urlToViewTransaction = this.maticurl + data['transactionHash'];
        this.updateNft(nftId, { repayed: true, repayedAmount: amount });
      })
      .catch((err: any) => {
        this.showLoaderForRepay = false;
        console.log(err);
      });
  }

  updateNft(nftId: string, obj: object) {
    console.log('nft updating object...', obj);

    this.nftService.updateNft(nftId, obj).subscribe((response: any) => {
      const nftIndex = this.nfts.findIndex((nft) => nft._id === nftId);
      this.nfts[nftIndex] = response.data;
      this.selectedNft = response.data;
      // this.modalService.dismissAll();
      // if (this.eventName.name === 'repay') {
      //   this.modalService.open(this.eventName.modal)
      // }
      // if (this.eventName.name === 'borrow') {
      //   this.modalService.open(this.eventName.modal)
      // }
      this.updateNFTVal();
      this.showLoaderForRepay = false;
      this.showLoaderForBorrow = false;
    });
  }

  viewTransaction() {
    if (this.urlToViewTransaction) {
      window.open(this.urlToViewTransaction, '_blank');
    }
  }
  cancelRepay() {
    this.modalService.dismissAll();
    this.fees = 0;
    this.repayAmountInUsd = 0;
    this.totalTransactionAmountRepay = 0;
    this.repayAmount = 0;
  }

  cancelBorrow() {
    this.modalService.dismissAll();
    setTimeout(() => {
      this.borrowStep2 = false;
      this.borrowSuccess = false;
      this.borrowStep1 = true;
      this.fees = 0;
      this.borrowAmountInUsd = 0;
      this.totalTransactionAmount = 0;
      this.borrowAmount = 0;
    }, 200);
  }
  convertDollarToMatic(val: any) {
    return (val * this.chainlinkService.priceConversions.maticUsd).toFixed(4);
  }
  eligibleLoanAmount(val: any) {
    return (val * (70 / 100)).toFixed(4);
  }
  calculateInterestandPlatformFees(val: number) {
    console.log(val);
    this.borrowAmount = val;
    if (this.borrowAmount) {
      this.interestApplicable = (this.borrowAmount * (13 / 100)).toFixed(4);
      this.platformFees = (this.borrowAmount * (0.25 / 100)).toFixed(4);
    }
  }
  calculateInterestandTotalAmount(val: number) {
    console.log(val);
    this.repayAmount = val;
    if (this.repayAmount) {
      this.interestApplicableRepay = (this.repayAmount * (13 / 100)).toFixed(4);
      this.totalRepaymentAmount = (
        Number(this.interestApplicableRepay) + Number(this.repayAmount)
      ).toFixed(4);
    }
  }

  getProviderValue(val: any) {
    switch (val) {
      case '80001':
        return 'Polygon Mumbai';
        break;
      case '137':
        return 'Polygon Mainnet';
        break;
      case '1':
        return 'Ethereum Mainnet';
        break;
      case '3':
        return 'Ropsten Testnet';
        break;
      case '4':
        return 'Rinkeby Testnet';
        break;
      default:
        return 'Unrecognized Network';
        break;
    }
  }

  borrowOn(val: String) {
    if (val == 'borrow') {
      // this.router.navigateByUrl('/home/borrow');
      this.router.navigate(['/home/borrow']);
    } else {
      // this.router.navigateByUrl('home/lending');
      this.router.navigate(['/home/lending']);
    }
  }
}
