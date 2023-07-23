import {
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';
import { timestamp } from 'rxjs/operators';
import { ChainlinkAPIService } from 'src/app/common/services/chainlink-api.service';
import { NftService } from 'src/app/modules/nft/services/nft.service';
import { environment } from 'src/environments/environment';
import { resourceLimits } from 'worker_threads';
// import { MetaMaskInpageProvider } from "@metamask/providers";
import { Web3Service } from '../../../../common/services/web3.service';
import Web3 from 'web3';
import { ChartType, ChartOptions } from 'chart.js';
import {
  SingleDataSet,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
  MultiDataSet,
} from 'ng2-charts';
import { isForInStatement } from 'typescript';

declare global {
  interface Window {
    ethereum: any;
  }
}


// window.ethereum.on('chainChanged', () => {
//   setTimeout(() => {
//     location.reload();
//   }, 400);
// });

@Component({
  selector: 'app-lendingPools',
  templateUrl: './lendingPools.component.html',
  styleUrls: ['./lendingPools.component.css'],
})
export class LendingPoolsComponent implements OnInit {
  public chartOptions: ChartOptions = {
    responsive: true,
  };
  public doughnutChartLabels: Label[] = [];
  public doughnutChartData: MultiDataSet = [];
  public doughnutChartType: ChartType = 'doughnut';
  // public pieChartLabels: Label[] = [];
  // public pieChartData: SingleDataSet = [];
  // public pieChartType: ChartType = 'pie';

  selectedPage = '';
  public chartLegend = false;
  public pieChartPlugins = [];
  userAddress: String | null = '';
  lendingPoolSection: Boolean = true;
  withdrawSection: Boolean = false;
  lendingSuccess: Boolean = false;
  withdrawSuccess: Boolean = false;
  lendNowBtnClicked: Boolean = false;
  withdrawNowBtnClicked: Boolean = false;
  withdrawFailed: Boolean = false;
  noWithdrawableBalance: Boolean = false;
  selectedTransaction: any;
  walletSection: Boolean = false;
  showExpandCollIcon: Boolean = false;
  totalTransactionAmount = 0;
  totalTransactionAmountWithDraw = 0;
  totalLending: any = 1200.0;
  noTransactions: any;
  remainingBalance: any = 220.0;
  interval = 'seconds';
  fees = 0;
  tradeBtnClicked: Boolean = false;
  tradeSuccess: Boolean = false;
  loadingBondsData: Boolean = false;
  poolBalance: any;
  errorMessage = '';
  platformFeesRate: number = 0;
  lendAmount!: number;
  lockPeriod: any;
  remainingTime: any;
  withdrawAmount!: number;
  networkId: string = '';
  networkVersion: any;
  selectedCoin: any = 'Tether (USDT)';
  RouterInstance: any;
  poolDetails: any;
  lendingPoolIndex: any;
  withdrawPoolIndex: any;
  withdrawBalance: any;
  walletAddress: any = '06x0098cshui006x5x000alkoka00';
  coinList = ['Tether (USDT)'];
  urlToViewTransaction: any;
  gasPriceObject:any;
  maticurl = 'https://mumbai.polygonscan.com/tx/';
  karmaPointTransactions: any;
  showSpinner: boolean = false;
  karmaPointSection: Boolean = false;
  poolDataLoaded: Boolean = false;
  bruTokenSection: Boolean = false;
  totalLendingSection: Boolean = true;
  totalAmount: any
  nfts: any[] = [];
  selectedPool: any;
  totalAssets: number = 0;
  totalAssetsValue: number = 0;
  totalAssetsValueMinted: number = 0;
  showLoaderForWalletTransactions: Boolean = true;
  radioItems = [];
  // radioItems = ['Total Lendings', 'Bru Tokens', 'Karma Points'];
  model = { option: 'Total Lendings' };
  activeBonds: any;
  inActiveBonds: any;
  wTransactions: any = [];
  selectedBond: any;
  recipientAddress: any;
  topComm: any = [];
  tradeAmount: any;
  checkForApproval: any
  lendingTransactions: any = [
    // {
    //   'currency': "USDT",
    //   'value': "12.00"
    // },
  ];
  wallets: any = [
    // {
    //   'name': "Tether",
    //   'currency': "USDT",
    //   'value': "71.00"
    // }
  ];
  tData: any = [
    //   {
    //   'name': "Matic",
    //   'apy': "0",
    //   'la': "0",
    //   'ia': "0",
    //   'ct': "Agri Commodity",
    //   'lockin': "2"
    // }
  ];
  withdrawData: any = [
    // {
    //   'name': "Matic",
    //   'apy': "",
    //   'la': "0",
    //   'ia': "0",
    //   'ct': "Agri Commodity",
    //   'lockin': "2"
    // }
  ];

  constructor(
    private modalService: NgbModal,
    private web3Service: Web3Service,
    private cd: ChangeDetectorRef,
    private router: Router,
    private nftService: NftService,
    private chainlinkService: ChainlinkAPIService
  ) {
    this.web3Service.newEvent(this.router.url);
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    
  }

  ngOnInit(): void {
    this.checkConnectionAndLoadData();
    this.fetchGasPrice()
  }

  async fetchGasPrice(){
    let response = await fetch('https://gasstation-mumbai.matic.today/v2')
    this.gasPriceObject = await response.json()
    console.log(this.gasPriceObject,"response")
    // console.log(,"response")
    // console.log(this.web3Service.convertGasPrice((this.gasPriceObject.fast.maxFee)),"response");
  }
  async checkConnectionAndLoadData() {
    let accounts = await this.web3Service.checkConnection();
    console.log(accounts);
    if (!accounts) {
      this.router.navigateByUrl('/home/connect?request=true&redirect=lending');
      // this.router.navigateByUrl("/home")
    }
    this.networkId = accounts[0] || ''; ``
    console.log(this.networkId);
    if (this.networkId) {
      this.refreshData();
    } else {
      this.router.navigateByUrl('/home');
      this.cd.detectChanges();
    }
  }

  async refreshData() {
    this.tData = [];
    this.withdrawData = [];
    this.web3Service.bootstrapWeb3().subscribe(
      (accounts: string[]) => {
        this.networkId = accounts[0] || '';
        this.loadData();
      },
      (err) => {
        alert('Web3 bootstrap failed');
      }
    );
    this.RouterInstance = this.web3Service.artifactsToRouterContract();
    this.lendingPools();
    this.lendingPoolSection = true;
    this.cd.detectChanges();
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

  async getToken() {
    console.log('accounts', this.web3Service.getAccount());
    try {
      let walletAddress = this.web3Service.getAccount();
      let mintTokenResult = await this.web3Service
        .artifactsToTokenContract(environment.TokenAddress)
        .methods.mint(
          walletAddress,
          this.web3Service.convertToSmallestUnit('1000')
        )
        .send({ from: walletAddress });
      console.log(mintTokenResult);
    } catch (error) {
      console.log('Error while minting tokens to wallet');
      console.log(error);
    }
  }

  loadData(query: { skip?: Number; limit?: Number } = {}) {
    const skip = query.skip || this.nfts.length;
    const limit = query.limit || 10;

    this.nftService.getAllNfts({ skip, limit }).subscribe((response: any) => {
      this.totalAssets = response.totalAssets;
      this.totalAssetsValue = this.chainlinkService.roundOffDecimal(
        this.chainlinkService.convertInrToUsd(response.totalAssetsValue)
      );
      this.totalAssetsValueMinted = this.chainlinkService.roundOffDecimal(
        this.chainlinkService.convertInrToUsd(response.totalAssetsValueMinted)
      );
      this.nfts = [...this.nfts, ...response.data];
      let _topC = response.topCommodities;
      let _allC = response.totalVal[0];
      let sumOfTC = 0;
      _topC.forEach((elems: any) => {
        sumOfTC = sumOfTC + elems.total;
      });
      let sumOfTCQuan = 0;
      _topC.forEach((elems: any) => {
        sumOfTCQuan = sumOfTCQuan + elems.quantity;
      });
      let sumOfTCValue = 0;
      _topC.forEach((elems: any) => {
        sumOfTCValue = sumOfTCValue + elems.value;
      });
      console.log(sumOfTC);
      console.log(sumOfTCQuan);
      console.log(sumOfTCValue);
      let others: any = {};
      others['total'] = _allC.total - sumOfTC;
      others['name'] = 'Others';
      others['quantity'] = _allC.quantity - sumOfTCQuan;
      others['value'] = _allC.value - sumOfTCValue;
      this.topComm = _topC;
      this.topComm.push(others);
      console.log(this.topComm);
      this.topComm.forEach((element: any) => {
        this.doughnutChartData.push(element.total);
        this.doughnutChartLabels.push(element.name);
      });
    });
  }

  processTransaction(transactions: any) {
    if (transactions.length > 0) {
      let amount = 0;
      let interestAmount = 0;
      for (let i of transactions) {
        let value = i['returnValues'];
        let tamount = parseInt(
          this.web3Service.convertToLargestUnit(value.tokenAmount)
        );
        if (value._type == 1) {
          amount += tamount;
        } else if (value._type == 2) {
          amount -= tamount;
        } else {
        }
        if (value._type === 3) {
          interestAmount += tamount;
        }
      }
      return [amount, interestAmount];
    } else {
      return [0, 0];
    }
  }

  async processPoolEvents() {
    console.log(' in processPoolEvents');
    let poolDetails = await this.getPoolDetails(0);

    const blocknumber = await this.web3Service.getWeb3().eth.getBlockNumber();
    console.log(poolDetails.proxyPoolAddress);

    let transactions = await this.web3Service
      .artifactsToPoolContract(poolDetails.proxyPoolAddress)
      .getPastEvents('LendEvent', {
        filter: { userAddress: this.walletAddress },
        fromBlock: 0,
        toBlock: 'latest',
      });

    console.log( " ======== check transactions array ====");
    console.log(transactions);
    for (let transaction of transactions) {
      let transactionValues = transaction.returnValues;
      let transactionObject;
      console.log(transactionValues, 'transaction values');
      if (transactionValues._type == '1') {
        transactionObject = {
          type: 'deposit',
          amount: this.web3Service.convertToLargestUnit(
            transactionValues.tokenAmount
          ),
          time: new Date(transactionValues.timestamp * 1000),
          transactionHash: transaction.transactionHash,
        };
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
      console.log(transactionObject);
      this.wTransactions.push(transactionObject);
    }
    // return this.processTransaction(result)
    console.log(this.wTransactions);
    this.showLoaderForWalletTransactions = false;
    if (this.wTransactions.length == 0) {
      this.noTransactions = true;
    }
    this.wTransactions = this.wTransactions.splice(
      Math.max(this.wTransactions.length - 4)
    );
  }

  async processPoolData(poolDataArray: any) {
    console.log('PoolDataLength', poolDataArray.length);
    let processedData: any = [];
    try {
      for (let i of poolDataArray) {
        let data;
        console.log('Processing', i[1]);
        console.log('in for loop');
        try {
        } catch (error) { }
        console.log('address', i.proxyPoolAddress);

        let rates = await this.web3Service
          .artifactsToPoolContract(i.proxyPoolAddress)
          .methods.rates()
          .call();
        console.log('rates', rates);
        console.log('rates of pool', rates);
        let platformFees = await this.web3Service
          .artifactsToPoolContract(i.proxyPoolAddress)
          .methods.platformFees()
          .call();
        console.log(platformFees, 'platform fees');

        let apyInWei = rates.lend;
        let apy =
          parseFloat(this.web3Service.convertToLargestUnit(apyInWei)) * 100;
        let platformFeesRateInWei = platformFees.lend;
        let platformFeesRate = parseFloat(
          this.web3Service.convertToLargestUnit(platformFeesRateInWei)
        );
        console.log('Platform fee Rate', platformFeesRate);
        this.platformFeesRate = platformFeesRate;
        let amount = await this.getLentAmount();
        console.log('amount of deposited data', amount);

        let interest = await this.getInterestAmount();
        if (i.poolName == 'IndiaAgro') {
          data = {
            name: i.poolName,
            apy: parseFloat(apy.toString()).toFixed(2),
            la: parseFloat(amount).toFixed(4),
            ia: parseFloat(interest).toFixed(4),
            ct: 'Agri Commodity',
          };
        } else if (i.poolName == 'gold') {
          data = {
            name: 'Gold Pool',
            apy: parseFloat(apy.toString()).toFixed(2),
            la: parseFloat(amount).toFixed(4),
            ia: parseFloat(interest).toFixed(4),
            ct: 'Gold',
            address: i[1],
          };
        } else {
          data = {
            name: `${i.poolName} Pool`,
            apy: parseFloat(apy.toString()).toFixed(2),
            la: parseFloat(amount).toFixed(4),
            ia: parseFloat(interest).toFixed(4),
            ct: i.poolName,
          };
        }
        processedData.push(data);
      }
      console.log(processedData, 'processed data');
      this.tData = processedData;
      console.log(this.tData, 'Data after processings');
      this.withdrawData = processedData;
    } catch (error) {
      console.log(error);
      console.log('Error while fetching data of pool');
    }
    console.log('PoolData', poolDataArray);
  }

  async lendingPools() {
    this.walletAddress = this.web3Service.getAccount();
    
    let poolDetails = await this.RouterInstance.methods
      .getAllPoolDetails()
      .call();
    console.log('pooldetails in lendingpools,', poolDetails);
    this.poolDetails = poolDetails;
    this.processPoolData(poolDetails);
    try {
    } catch (error) {
      console.log('Errow while fetching pool data');
      console.log(error);
    }

    document.getElementById('lp')?.classList.add('active');
    document.getElementById('wd')?.classList.remove('active');
    document.getElementById('mw')?.classList.remove('active');
    this.lendingPoolSection = true;
    this.withdrawSection = false;
    this.walletSection = false;
  }

  async processWithdrawPools() {
    console.log('Processing withdraw pools');
    console.log(this.poolDetails, 'pool details');
    if (this.withdrawData.length > 0) {
      console.log('in if');
      this.processPoolData(this.poolDetails);
    }
    this.cd.detectChanges();
    for (let i = 0; i <= this.poolDetails.length; i++) {
      // console.log("procssing withdraw pool", this.poolDetails[i][3])
      console.log('getting pool balance');
      let poolDetails = await this.getPoolDetails(i);
      let poolTokenAddress = poolDetails.poolTokenAddress;
      console.log('====== getting pool balance ====');
      console.log(poolDetails);
      let withdrawableBalance = await this.web3Service
        .artifactsToIERCContractPoolToken(poolTokenAddress)
        .methods.balanceOf(this.web3Service.getAccount())
        .call();

     
      if (this.withdrawData.length > 0) {
        let amount = await this.getLentAmount();
        let withdrawableBalance = await this.getWithdrawableAmount(
          poolDetails.proxyPoolAddress
        );
        // this.withdrawData[i]['la'] = parseFloat(amount).toFixed(4);
        // this.withdrawData[i]['ia'] = parseFloat(withdrawableBalance).toFixed(4);
        console.log(this.withdrawData)
      }
    }
  }

  withdraw() {
    this.processWithdrawPools();
    document.getElementById('lp')?.classList.remove('active');
    document.getElementById('wd')?.classList.add('active');
    document.getElementById('mw')?.classList.remove('active');
    this.lendingPoolSection = false;
    this.withdrawSection = true;
    this.walletSection = false;
  }
  async myWallet() {
    document.getElementById('lp')?.classList.remove('active');
    document.getElementById('wd')?.classList.remove('active');
    document.getElementById('mw')?.classList.add('active');
    this.walletAddress = this.web3Service.getAccount();
    console.log(this.walletAddress, 'Wallet address');
    console.log(
      'networkVersion',
      this.web3Service.getProvider().networkVersion
    );
    this.networkVersion = this.web3Service.getProvider().networkVersion;

    this.lendingPoolSection = false;
    this.withdrawSection = false;
    this.walletSection = true;
    this.processPoolEvents();
    // const walletBalance = await this.web3Service
    //   .artifactsToIERCContract()
    //   .methods.balanceOf(this.walletAddress)
    //   .call();
    // let poolBalance = await this.getLentAmount();
    // this.poolBalance = parseFloat(poolBalance).toFixed(4);
    // console.log(this.walletAddress, 'balance', poolBalance);

    // console.log(walletBalance, 'Walet Balance');
    // this.wallets = [
    //   {
    //     name: 'USD Tether',
    //     currency: 'USDT',
    //     value: parseFloat(
    //       this.web3Service.convertToLargestUnit(walletBalance)
    //     ).toFixed(4),
    //   },
    //   {
    //     name: 'Brú Bonds',
    //     currency: 'Brú Bonds',
    //     value: this.poolBalance,
    //   },
    // ];
    // await this.bondTransfer('0x319108eE5daCA4c09546289A1578819c9B66B096', '50')
  }

  async updateWalletSection() {
    const walletBalance = await this.web3Service
      .artifactsToIERCContract()
      .methods.balanceOf(this.walletAddress)
      .call();
    let poolBalance = await this.getLentAmount();
    this.poolBalance = parseFloat(poolBalance).toFixed(4);
    console.log(this.walletAddress, 'balance', poolBalance);

    console.log(walletBalance, 'Walet Balance');
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
        value: this.poolBalance,
      },
    ];
  }

  hideLowBalance(values: any): void {
    console.log(values.currentTarget.checked);
  }

  async lendMore(i: number, data: any, content: TemplateRef<any>) {
    this.lendingPoolIndex = i;
    this.lendingSuccess = false;
    this.modalService.dismissAll();
    this.selectedTransaction = data;
    let poolAddress = await this.RouterInstance.methods
      .getPoolAddress(0)
      .call();
    // let interval = await this.web3Service.artifactsToPoolContract(poolAddress).methods.interval().call()
    let lockPeriod = await this.web3Service
      .artifactsToPoolContract(poolAddress)
      .methods.lockPeriod()
      .call();
    this.formatText(lockPeriod);
    await this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    }).result;
  }

  formatText(lockPeriod: any) {
    if (parseInt(lockPeriod) % 1 == 0) {
      if (parseInt(lockPeriod) / 1 == 1) {
        this.interval = 'second';
        this.lockPeriod = 1;
      } else {
        this.interval = 'seconds';
        this.lockPeriod = parseInt(lockPeriod) / 1;
      }
    }
  }

  async withdrawM(i: number, data: any, content: TemplateRef<any>) {
    this.modalService.dismissAll();
    console.log(data, i);
    this.withdrawPoolIndex = i;
    // this.noWithdrawableBalance = true;
    // await this.modalService.open(content, {
    // }).result;
    // return;
    if (data['la'] <= 0) {
      this.noWithdrawableBalance = true;
      await this.modalService.open(content, {
        ariaLabelledBy: 'modal-basic-title',
      }).result;
      return;
    } else {
      this.noWithdrawableBalance = false;
    }
    let poolAddress = await this.RouterInstance.methods
      .getPoolAddress(0)
      .call();
    // let poolDetails = this.getPoolDetails(0)
    // let poolTokenAddress = await this.web3Service.artifactsToPoolContract(p).methods.poolTokenAddress().call();
    // console.log("poolTokenAddress", poolTokenAddress);
    let balance = await this.getWithdrawableAmount(poolAddress);
    this.withdrawBalance = parseFloat(balance).toFixed(4);
    this.withdrawSuccess = false;
    this.selectedTransaction = data;
    // let depositTime = await this.web3Service.artifactsToPoolContract(poolAddress).methods.timelock(this.web3Service.getAccount()).call()
    let lockPeriod = await this.web3Service
      .artifactsToPoolContract(poolAddress)
      .methods.lockPeriod()
      .call();
    this.formatText(lockPeriod);
    let lentAmount = await this.getLentAmount();
    let withdrawAmount = await this.getWithdrawableAmount(poolAddress);
    if (parseInt(lentAmount) > 0 && parseInt(withdrawAmount) > 0) {
      this.withdrawFailed = false;
    } else {
      this.withdrawFailed = true;
    }
    // if lockin period is pending just set **this.withdrawFailed = true;** OR uncomment the below line
    // if () {
    // }
    await this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    }).result;
  }

  calculateTimeRemaining(depositTime: number) {
    let currentTime = new Date().getTime();
    let timeDifference = currentTime - depositTime;
    let day = timeDifference / 86400000;
    console.log(day, 'day', parseInt(this.lockPeriod));
    if (day >= parseInt(this.lockPeriod)) {
      console.log(true);
      return false;
    } else {
      // let possibleWithdrawDate = parseInt(this.lockPeriod) * 86400000
      // this.remainingTime = day
      console.log(false);
      return true;
    }
  }
  lendNow() { }
  withdrawBond() { }

  async tradeBond(data: any, content: TemplateRef<any>) {
    this.modalService.dismissAll();
    this.selectedBond = data;
    await this.modalService.open(content).result;
  }
  async poolDetailsModal(content: TemplateRef<any>, data: any) {
    this.selectedPool = data;
    this.poolDataLoaded = false;
    await this.modalService.open(content, { windowClass: 'PoolDetailsModal' });
    let poolAddress = await this.RouterInstance.methods
      .getPoolAddress(0)
      .call();
    let lockPeriod = await this.web3Service
      .artifactsToPoolContract(poolAddress)
      .methods.lockPeriod()
      .call();
    this.formatText(lockPeriod);
    console.log(lockPeriod);
    this.poolDataLoaded = true;
  }

  async getPoolDetails(index: number) {
    let poolDetails = await this.web3Service
      .artifactsToFactoryContract()
      .methods.getPoolDetails(index)
      .call();
    return poolDetails;
  }

  async getUserActiveBonds() {
    let poolDetails = await this.getPoolDetails(0);
    let activeBonds = await this.web3Service
      .artifactsToPoolContract(poolDetails.proxyPoolAddress)
      .methods.getUserActiveBonds(this.web3Service.getAccount())
      .call();
    let processedActiveBonds = this.processBonds(activeBonds);
    this.activeBonds = processedActiveBonds;
    // console.log(activeBonds, "james active bond")
    console.log(processedActiveBonds, 'processes active bonds');
  }

  async checkForMatureBonds() {
    console.log('Bonds 2.5');
    let poolDetails = await this.getPoolDetails(0);
    console.log(poolDetails);
    let bonds = await this.web3Service
      .artifactsToPoolContract(poolDetails.proxyPoolAddress)
      .methods.getUserActiveBonds(this.web3Service.getAccount())
      .call();
    console.log(bonds);
    for (let bond of bonds) {
      let currentTime = new Date().getTime() / 1000;
      console.log(bond);
      let depositTime = bond['bondTimestamp'];
      console.log(currentTime, 'current time');
      console.log(depositTime, 'deposit teim');
      console.log(bond['lockTimestamp'], 'lock time');
      console.log(currentTime - parseInt(depositTime), 'difference');
      if (
        currentTime - parseInt(depositTime) >=
        parseInt(bond['lockTimePeriod'])
      ) {
        console.log('found matured bond');
        return true;
      }
    }
    return false;
  }

  async getBonds() {
    console.log('in get bonds function');
    let poolDetails = await this.getPoolDetails(0);
    let bonds = await this.web3Service
      .artifactsToPoolContract(poolDetails.proxyPoolAddress)
      .methods.getUserActiveBonds(this.web3Service.getAccount())
      .call();
    for (let bond of bonds) {
      let currentTime = new Date().getTime() / 1000;
      console.log(bond, 'active bonds');
      let depositTime = bond['bondTimestamp'];
      console.log(currentTime, 'current time');
      console.log(depositTime, 'deposit time');
      console.log(bond['lockTimePeriod'], 'lock time');
      console.log(currentTime - parseInt(depositTime), 'difference');
      let bondAmount = parseFloat(
        this.web3Service.convertToLargestUnit(bond['bondAmount'])
      ).toFixed(4);
      let bondInterest = parseFloat(
        this.web3Service.convertToLargestUnit(bond['interest'])
      ).toFixed(4);
      let bondId = bond['bondId'];
      let tokenAddress = bond['tokenAddress'];
      let creationDate = new Date(bond['bondTimestamp'] * 1000);

      if (
        currentTime - parseInt(depositTime) >=
        parseInt(bond['lockTimePeriod'])
      ) {
        this.inActiveBonds.push({
          bondId,
          bondAmount,
          bondInterest,
          tokenAddress,
          creationDate,
        });
      } else {
        this.activeBonds.push({
          bondId,
          bondAmount,
          bondInterest,
          tokenAddress,
          creationDate,
        });
      }
    }
  }

  async showbonds(content: TemplateRef<any>) {
    this.loadingBondsData = true;
    await this.modalService.open(content);
    console.log('in show bonds function');
    this.activeBonds = [];
    this.inActiveBonds = [];
    await this.getUserInactiveBonds();
    await this.getBonds();
    console.log('Bonds 1');

    // let transferFromActiveToMature = await this.checkForMatureBonds()
    // console.log(transferFromActiveToMature)
    // console.log("Bonds 2")
    // if (transferFromActiveToMature == true) {
    //   let poolDetails = await this.getPoolDetails(0)
    //   let walletAddress = this.web3Service.getAccount()
    //   await this.web3Service.artifactsToPoolContract(poolDetails.proxyPoolAddress).methods.addToInactiveBonds(walletAddress).send({ from: walletAddress })
    //   await this.getUserActiveBonds()
    //   await this.getUserInactiveBonds()
    // }
    // console.log("Bonds 3")
    this.loadingBondsData = false;
  }

  processBonds(bonds: any) {
    let processBonds = [];
    for (let bond of bonds) {
      let bondAmount = parseFloat(
        this.web3Service.convertToLargestUnit(bond['bondAmount'])
      ).toFixed(4);
      let bondInterest = parseFloat(
        this.web3Service.convertToLargestUnit(bond['interest'])
      ).toFixed(4);
      let bondId = bond['bondId'];
      let tokenAddress = bond['tokenAddress'];
      let creationDate = new Date(bond['bondTimestamp'] * 1000);
      // console.log(bond["bondTimestamp"], "Bond Timestamp")
      // console.log(creationDate, "Creation Date #1")
      processBonds.push({
        bondId,
        bondAmount,
        bondInterest,
        tokenAddress,
        creationDate,
      });
    }
    return processBonds;
  }

  async getUserInactiveBonds() {
    let poolDetails = await this.getPoolDetails(0);
    let inactiveBonds = await this.web3Service
      .artifactsToPoolContract(poolDetails.proxyPoolAddress)
      .methods.getUserInactiveBonds(this.web3Service.getAccount())
      .call();
    // console.log(activeBonds, "james inactive bond")
    let processedInactiveBonds = this.processBonds(inactiveBonds);
    console.log(processedInactiveBonds, 'processed inactive bonds');
    this.inActiveBonds = processedInactiveBonds;
  }

  async getLentAmount() {
    let poolDetails = await this.getPoolDetails(0);
    let amountInWei = await this.web3Service
      .artifactsToIERCContractPoolToken(poolDetails.poolTokenAddress)
      .methods.balanceOf(this.web3Service.getAccount())
      .call();
    return this.web3Service.convertToLargestUnit(amountInWei);
  }



  async bondTransfer(receiverAddress: any, tokenAmount: any) {
    this.tradeBtnClicked = true;
    console.log(receiverAddress, tokenAmount);
    try {
      let poolDetails = await this.getPoolDetails(0);
      let bondTransfer = this.web3Service
        .artifactsToIERCContractPoolToken(poolDetails.poolTokenAddress)
        .methods.transfer(receiverAddress, tokenAmount)
        .estimateGas(
          { from: this.web3Service.getAccount() },
          function (error: any, gasAmount: number) {
            console.log(gasAmount, 'gas Amount');
          }
        );
      let bondTransferTransaction = await this.web3Service
        .artifactsToIERCContractPoolToken(poolDetails.poolTokenAddress)
        .methods.transfer(receiverAddress, tokenAmount)
        .send({
          from: this.web3Service.getAccount(),
          gas: Math.round(bondTransfer * 2),
        });
      console.log(bondTransferTransaction, 'Bond transfer transaction result');
      this.tradeSuccess = true;
      this.tradeBtnClicked = false;
    } catch (e) {
      console.log(e);
      this.tradeBtnClicked = false;
    }
  }



  async getInterestAmount() {
    let poolDetails = await this.getPoolDetails(0);
    let amountInWei = await this.web3Service
      .artifactsToIERCContractPoolToken(poolDetails.interestTokenAddress)
      .methods.balanceOf(this.web3Service.getAccount())
      .call();
    return this.web3Service.convertToLargestUnit(amountInWei);
  }

  async getWithdrawableAmount(poolAddress: any) {
    let amountInWei = await this.web3Service
      .artifactsToPoolContract(poolAddress)
      .methods.getWithdrawableBalance(this.web3Service.getAccount())
      .call();

    return this.web3Service.convertToLargestUnit(amountInWei);
  }
  viewTransaction() {
    if (this.urlToViewTransaction) {
      window.open(this.urlToViewTransaction, '_blank');
    }
  }

  async checkForApprovalTransaction(transactionHash: any) {
    let web3 = new Web3(window.ethereum)
    let approvalTransaction = await web3.eth.getTransaction(transactionHash)
  }

  async handleLendNow(errorModal: TemplateRef<any>) {
    this.lendNowBtnClicked = true;
    console.log(this.lendAmount);
    console.log(this.selectedCoin);
    if (!this.selectedCoin || !this.lendAmount) {
      console.log('Please select coin and enter lend amount.');
    }
    let walletAddress = this.web3Service.getAccount();
    let amount = parseFloat(this.lendAmount.toString()) + this.fees

    let lendAmountInWei = this.web3Service.convertToSmallestUnit(
      amount
    );
    let poolAddress = this.poolDetails[this.lendingPoolIndex][3];
    console.log('pool address for lending', poolAddress);
    console.log(
      'Pool Address----------------------------',
      poolAddress,
      this.poolDetails
    );
    // let platformFees = this.web3Service.artifactsToPoolContract(poolAddress).methods.call()

    try {
      await this.fetchGasPrice()
      let approveTransaction = await this.web3Service
        .artifactsToIERCContract()
        .methods.approve(poolAddress, lendAmountInWei)
        .estimateGas(
          { from: walletAddress }
        );
      console.log(approveTransaction, "gas amount for approve")

      // console.log(approveTransactionResult,"gas amount outside");
      let approvaltransactionResult = await this.web3Service
        .artifactsToIERCContract()
        .methods.approve(poolAddress, lendAmountInWei)
        .send({ from: walletAddress,gasPrice:Math.floor((this.gasPriceObject.fast.maxFee*(10**9))), gas: Math.round(approveTransaction * 2) });

      this.checkForApproval = setInterval(async () => {
        let web3 = new Web3(window.ethereum)
        let approvalTransaction = await web3.eth.getTransactionReceipt(approvaltransactionResult['transactionHash'])
        if (approvalTransaction['status'] == true) {
          clearInterval(this.checkForApproval)
          console.log("in interval")
          let depositTransaction = await this.RouterInstance.methods
            .deposit(
              this.lendingPoolIndex,
              environment.TokenAddress,
              lendAmountInWei
            )
            .estimateGas(
              { from: walletAddress },
              function (error: any, gasAmount: number) {
                console.log(gasAmount, 'gas Amount');
              }
            );
          let depositTransactionResult = await this.RouterInstance.methods
            .deposit(
              this.lendingPoolIndex,
              environment.TokenAddress,
              lendAmountInWei
            )
            .send({ from: walletAddress,gasPrice:Math.floor((this.gasPriceObject.fast.maxFee*(10**9))), gas: Math.round(depositTransaction * 2) });
          if (depositTransactionResult['status']) {
            let balance = await this.getLentAmount();
            this.totalLending = parseFloat(balance).toFixed(4);
            this.refreshData();
            this.urlToViewTransaction =
              this.maticurl + depositTransactionResult['transactionHash'];
            this.lendingSuccess = true;
          } else {
            this.errorMessage =
              "The transaction couldn't be processed by the Blockchain. Please try again in sometime.";
            await this.modalService.open(errorModal, {
              ariaLabelledBy: 'modal-basic-title',
            }).result;
          }
        }
      }, 1000)
      this.lendNowBtnClicked = false;
    } catch (error: any) {
      this.lendNowBtnClicked = false;
      console.log('Error while depositing tokens');
      console.log(error);
      console.log('Showing Error modal');
      this.errorMessage = '';
      if (error['code'] == 4001) {
        this.errorMessage =
          'User rejected the transaction. Please go back and click on Lend again to continue with the transaction.';
      } else {
        this.errorMessage =
          "The transaction couldn't be processed by the Blockchain. Please try again in sometime.";
      }
      await this.modalService.open(errorModal, {
        ariaLabelledBy: 'modal-basic-title',
      }).result;
      this.lendNowBtnClicked = false;
    }
  }

  async handleWithDrawNow(errorModal: TemplateRef<any>) {
    await this.fetchGasPrice()
    this.withdrawNowBtnClicked = true;
    console.log(this.withdrawAmount);
    console.log(this.selectedCoin);
    let withdrawAmountinWei = this.web3Service.convertToSmallestUnit(
      this.withdrawAmount
    );
    try {
      let poolAddress = await this.RouterInstance.methods
        .getPoolAddress(0)
        .call();
      console.log('withdraw pool address', poolAddress);
      console.log(
        'withdraw parameters',
        environment.TokenAddress,
        withdrawAmountinWei
      );
      let withdrawTransaction = await this.RouterInstance.methods
        .withdraw(0, withdrawAmountinWei)
        .estimateGas(
          { from: this.web3Service.getAccount() },
          function (error: any, gasAmount: number) {
            console.log(gasAmount, 'gas Amount');
          }
        );
      let txnResult = await this.RouterInstance.methods
        .withdraw(0, withdrawAmountinWei)
        .send({
          from: this.web3Service.getAccount(),
          gasPrice:Math.floor((this.gasPriceObject.fast.maxFee*(10**9))),
          gas: Math.round(withdrawTransaction * 1.2),
        });
      if (txnResult['status']) {
        this.withdrawNowBtnClicked = false;
        let balance = await this.getLentAmount();
        this.remainingBalance = parseFloat(balance).toFixed(4);
        console.log('Transaction Result', txnResult);
        this.refreshData();
        this.urlToViewTransaction =
          this.maticurl + txnResult['transactionHash'];
        this.withdrawSuccess = true;
      } else {
        this.errorMessage =
          "The transaction couldn't be processed by the Blockchain. Please try again in sometime.";
        await this.modalService.open(errorModal);
      }
    } catch (error: any) {
      console.log(
        `Error while withdrawing from pool with index ${this.withdrawPoolIndex}, Entered Amount ${this.withdrawAmount}`
      );
      console.log(error);
      this.withdrawNowBtnClicked = false;
      console.log('Showing Error modal');
      if (error['code'] == 4001) {
        this.errorMessage =
          'User rejected the transaction. Please go back and click on Withdraw again to continue with the transaction.';
      } else {
        this.errorMessage =
          "The transaction couldn't be processed by the Blockchain. Please try again in sometime.";
      }
      await this.modalService.open(errorModal);
    }

    if (!this.selectedCoin || !this.withdrawAmount) {
      console.log('Please select coin and enter lend amount.');
    }
  }

  calculateFees(val: number) {
    console.log(val);
    this.fees = 0;
    this.lendAmount = Number(val);
    if (this.lendAmount > 0) {
      this.fees = Number((this.lendAmount * this.platformFeesRate).toFixed(4));
      console.log(this.lendAmount);
      this.totalAmount = parseFloat(this.lendAmount.toString()) + this.fees
      // this.totalTransactionAmount = Number(this.lendAmount + this.fees)
      this.totalTransactionAmount = Number(this.lendAmount);
    } else {
      this.fees = 0;
      this.totalAmount = 0;
      this.totalTransactionAmount = 0;
    }
  }
  calculateFeesForWithdraw(val: number) {
    console.log(val);
    this.fees = 0;
    this.withdrawAmount = Number(val);
    if (this.withdrawAmount > 0) {
      // this.fees = Number((this.withdrawAmount * (.25 / 100)).toFixed(4))
      this.totalTransactionAmountWithDraw = Number(
        this.withdrawAmount + this.fees
      );
    } else {
      this.totalTransactionAmountWithDraw = 0;
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

  resetValuesAfterLendAndWithDraw() {
    this.modalService.dismissAll();
    this.lendAmount = 0;
    this.withdrawAmount = 0;
    this.lendingSuccess = false;
    this.withdrawSuccess = false;
    this.fees = 0;
    this.totalTransactionAmount = 0;
    this.totalLending = 0;
    this.totalTransactionAmountWithDraw = 0;
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
  radioChange(val: any) {
    console.log(val);
    if (val == 'Total Lendings') {
      this.totalLendingSection = true;
      this.karmaPointSection = false;
      this.bruTokenSection = false;
    }
    if (val == 'Bru Tokens') {
      this.totalLendingSection = false;
      this.karmaPointSection = false;
      this.bruTokenSection = true;
    }
    if (val == 'Karma Points') {
      this.totalLendingSection = false;
      this.karmaPointSection = true;
      this.bruTokenSection = false;
    }
  }

  viewMoreBtn() {
    this.router.navigateByUrl('/home/my-transactions');
  }

  getColorClass(val: any) {
    switch (val) {
      case 'Others':
        return 'comOthers';
        break;
      case 'Gram':
        return 'comGram';
        break;
      case 'Wheat':
        return 'comWheat';
        break;
      case 'Rice':
        return 'comRice';
        break;
      case 'Turmeric':
        return 'comTurmeric';
        break;
      default:
        return 'comOthers';
        break;
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
