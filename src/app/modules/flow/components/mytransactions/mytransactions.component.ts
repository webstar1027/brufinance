import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Web3Service } from 'src/app/common/services/web3.service';

@Component({
  selector: 'app-mytransactions',
  templateUrl: './mytransactions.component.html',
  styleUrls: ['./mytransactions.component.css']
})
export class MytransactionsComponent implements OnInit {
  radioItems = ['All Tx(s)', 'Credits', 'Debits'];
  model = { option: 'All Tx(s)' };
  walletAddress: any = "06x0098cshui006x5x000alkoka00";
  maticurl = "https://mumbai.polygonscan.com/tx/";
  wTransactions: any = [];
  debitTransactions: any = [];
  creditTransactions: any = [];
  urlToViewTransaction: any = '';
  showTableOfTransactions: Boolean = false;
  showEmptyMessage: Boolean = false;
  networkId: any;
  poolName: any;
  dataToShow: any;

  constructor(
    private web3Service: Web3Service,
    private router: Router
  ) {
    this.dataToShow = this.wTransactions.sort((a:any, b:any) => b.time - a.time);
  }

  ngOnInit(): void {
    this.checkConnectionAndLoadData()
  }
  async checkConnectionAndLoadData() {
    let accounts = await this.web3Service.checkConnection()

    if (!accounts) {
      this.router.navigateByUrl("/home/connect?request=true&redirect=lending")
    }
    this.networkId = accounts[0] || '';
    console.log(this.networkId)
    if (this.networkId) {
      this.refreshData();
    } else {
      this.router.navigateByUrl("/home/connect?request=true&redirect=lending")
    }
  }
  refreshData() {
    this.web3Service.bootstrapWeb3().subscribe(
      (accounts: string[]) => {
        // this.networkId = accounts[0] || '';
        this.processPoolEvents();
      },
      (err) => {
        alert('Web3 bootstrap failed');
      }
    );
  }

  async getPoolDetails(index: number) {
    let poolDetails = await this.web3Service.artifactsToFactoryContract().methods.getPoolDetails(index).call()
    return poolDetails
  }

  async processPoolEvents() {
    let poolDetails = await this.getPoolDetails(0)
    this.poolName = poolDetails['poolName']
    this.walletAddress = this.web3Service.getAccount();
    const blocknumber = await this.web3Service.getWeb3().eth.getBlockNumber();
    let transactions = await this.web3Service.artifactsToPoolContract(poolDetails.proxyPoolAddress)
    .getPastEvents('LendEvent', {
      filter: { userAddress: this.walletAddress },
      fromBlock: 0,
      toBlock: 'latest'
    })
    this.dealTransactionsData(transactions, 'Lend');
    let btransactions = await this.web3Service.artifactsToPoolContract(poolDetails.proxyPoolAddress)
    .getPastEvents('BorrowEvent', {
      filter: { userAddress: this.walletAddress },
      fromBlock: 0,
      toBlock: 'latest'
    })
    this.dealTransactionsData(btransactions, 'Borrow');
    let rtransactions = await this.web3Service.artifactsToPoolContract(poolDetails.proxyPoolAddress).getPastEvents('RepayEvent', {
      filter: { userAddress: this.walletAddress },
      fromBlock: 0,
      toBlock: 'latest'
    })
    this.dealTransactionsData(rtransactions, 'Repay');
    // return this.processTransaction(result)
    this.wTransactions.sort((a:any, b:any) => b.time - a.time);
    console.log(this.wTransactions)
    if (this.wTransactions.length > 0) {
      this.showTableOfTransactions = true;
    } else {
      this.showTableOfTransactions = false;
      this.showEmptyMessage = true;
    }
  }

  dealTransactionsData(transactions: Array<any>, type:string) {
    for (let transaction of transactions) {
      let transactionValues = transaction.returnValues;
      let transactionObject;
      console.log(transactionValues, "transaction values")
      if (transactionValues._type == '1') {
        transactionObject = {
          type: type,
          amount: this.web3Service.convertToLargestUnit(transactionValues.tokenAmount),
          time: new Date(transactionValues.timestamp * 1000),
          transactionHash: transaction.transactionHash
        }
      }
      if (transactionValues._type == '2') {
        transactionObject = {
          type: "withdraw",
          amount: this.web3Service.convertToLargestUnit(transactionValues.tokenAmount),
          time: new Date(transactionValues.timestamp * 1000),
          transactionHash: transaction.transactionHash
        }
      }
      console.log(transactionObject)
      this.wTransactions.push(transactionObject)

      switch(type) {
        case 'Lend':
          this.debitTransactions.push(transactionObject);
          break;
        case 'Borrow':
          this.creditTransactions.push(transactionObject);
          break;
      }
    }
  }
  radioChange(val: any) {
    console.log(val)
    if (val == 'All Tx(s)') {
      this.dataToShow = this.wTransactions.sort((a:any, b:any) => b.time - a.time)
    }
    if (val == 'Debits') {
      this.dataToShow = this.debitTransactions.sort((a:any, b:any) => b.time - a.time);
    }
    if (val == 'Credits') {
      this.dataToShow = this.creditTransactions.sort((a:any, b:any) => b.time - a.time);
    }
  }
  downloadInXls() {
    console.log("Downloading in XLS")
  }
  viewOnPolygon(data: any) {
    console.log(data)
    this.urlToViewTransaction = this.maticurl + data["transactionHash"]
    window.open(this.urlToViewTransaction, '_blank')
    console.log("View On Polygon")
  }

}
