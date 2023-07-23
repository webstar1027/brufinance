import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NftService } from '../../../nft/services/nft.service';
import { Web3Service } from '../../../../common/services/web3.service';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-lending',
  templateUrl: './lending.component.html',
  styleUrls: ['./lending.component.css'],
})
export class LendingComponent implements OnInit {
  onChainBal: number = 0;
  ethBalance: number = 0;
  totalEthDeposit: number = 0;
  totalEthWithdrawl: number = 0;
  calEthInterestOnDeposit: number = 0;
  depositValue: number = 0;
  withdrawValue: number = 0;
  depositBtnClicked: boolean = false;
  withdrawBtnClicked: boolean = false;
  userAddress: any;
  balance: any;
  dbal: any;
  wbal: number = 0;
  BTKN: any;
  totalBTKN: any;
  exchangeRate: any;
  depositSuccess: Boolean = false;
  withdrawSuccess: Boolean = false;
  urlToViewTransaction = '';
  maticurl = "https://mumbai.polygonscan.com/tx/";

  constructor(
    private modalService: NgbModal,
    private nftService: NftService,
    private web3Service: Web3Service
  ) {
    this.userAddress = this.web3Service.getAccount();
    this.getBal();
    this.totalSupply();
    this.getExchangeRate();
  }

  ngOnInit(): void {
    this.getBalofBTKV1();
    this.getInterestAccrued()
  }

  async handleModalOpen(content: TemplateRef<any>) {
    await this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
    }).result;
  }

  handleDeposit() {
    console.log('handleDeposits ', this.depositValue);
    if (this.depositValue != 0) {
      this.depositBtnClicked = true;
      this.depositInternalV1(this.depositValue);
    }
  }

  handleWithdraw() {
    console.log('handle withdraw amount ', this.withdrawValue);
    if (this.withdrawValue != 0) {
      this.withdrawBtnClicked = true;
      this.redeemInternalV1(this.withdrawValue);
    }
  }

  depositInternal(amount: any) {
    const sc = environment.ABI.networks[3].address;
    this.web3Service.artifactsToBTokenContract
    this.nftService
      .mintInternal(amount, sc)
      .then((data: any) => {
        this.totalSupply();
        console.log('deposit Internal BTKN 1 ', data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }
  async getInterestAccrued() {
    const depositedDetails = await this.web3Service.artifactsToContractV1().methods.getDepositDetails(this.userAddress).call()
    const currentTime = Math.round(new Date().getTime() / 1000)
    const difference = currentTime - parseInt(depositedDetails[1])
    let days = difference / (60 * 60 * 24)
    // if(depositedDetails[2])
    days = 1
    if (days >= 1) {
      this.dbal = this.web3Service.convertToLargestUnit(depositedDetails[0])
      const principalAmount = parseFloat(this.web3Service.convertToLargestUnit(depositedDetails[0]))
      const interest = (days * principalAmount * 0.1) / 365
      this.wbal = principalAmount + interest
      this.calEthInterestOnDeposit = interest
    } else {
      this.calEthInterestOnDeposit = 0
    }
  }

  async getInterestAmount(){
    const depositedDetails = await this.web3Service.artifactsToContractV1().methods.getDepositDetails(this.userAddress).call()
    const currentTime = Math.round(new Date().getTime() / 1000)
    const difference = currentTime - parseInt(depositedDetails[1])
    let days = difference / (60 * 60 * 24)
    days = 1
    if (days >= 1) {
      this.dbal = this.web3Service.convertToLargestUnit(depositedDetails[0])
      const principalAmount = parseFloat(this.web3Service.convertToLargestUnit(depositedDetails[0]))
      const interest = (days * principalAmount * 0.1) / 365
      return interest
    } else {
      return 0
    }
  }


  async depositInternalV1(amount: any) {
    try {
      const converted_amount = this.web3Service.convertToSmallestUnit(amount)
      // const result = await this.web3Service.artifactsToIERCContract().methods.approve(environment.lendingContractAddress, converted_amount).send({
      //   'from': this.userAddress,
      //   gas: "210000",
      // })
      // if (result.status === true) {
      //   const deposit_result = await this.web3Service.artifactsToContractV1().methods.deposit(converted_amount).send({
      //     from:this.userAddress,
      //     gas: "210000",
      //   })
      //   console.log(deposit_result, ' after approve result')

      // }

      const result = await this.web3Service.artifactsToContractV1().methods.depositMatic().send({
        from: this.userAddress,
        value: converted_amount
      })
      console.log(result)

      if (result.status) {
        this.urlToViewTransaction = this.maticurl + result["transactionHash"]
        this.depositBtnClicked = false;
        this.depositSuccess = true;
      }
    } catch (error) {
      console.log("Error while depositing Matic token")
      console.log(error)
    }
  }

  getBal() {
    this.nftService
      .balance(this.userAddress)
      .then((data: any) => {
        this.totalSupply();
        this.onChainBal = data;
        this.balance = this.onChainBal;
        console.log('ETH BALANCE ', this.onChainBal);
      })
      .catch((err: any) => {
        console.log('error to get balance ', err);
      });
  }

  getBalofBTK() {
    const sc = environment.ABI.networks[3].address;
    this.nftService
      .getBalance(sc)
      .then((data: any) => {
        this.BTKN = data;
        console.log('BTK BALANCE ', this.BTKN);
        this.dbal = this.BTKN / 1000000000000000000 * 2;
        this.wbal = this.BTKN / 1000000000000000000 * this.exchangeRate;
        this.calEthInterestOnDeposit = this.wbal - this.dbal;
        this.ethBalance = this.wbal;
      })
      .catch((err: any) => {
        console.log('error to get balance ', err);
      });
  }

  async getBalofBTKV1() {
    try {
      const amount = await this.web3Service.artifactsToBTokenContract().methods.balanceOf(this.userAddress).call()
      this.BTKN = this.web3Service.convertToLargestUnit(amount)

    } catch (error) {
      console.log("Error while fetching balance of bMatic token")
      console.log(error)
    }
  }

  getTotaldeposit() {

  }

  totalSupply() {
    this.nftService
      .totalSupply(environment.ABI.networks[3].address)
      .then((data: any) => {
        // this.BTKN = data / 10000000000000000;
        this.totalBTKN = data;
        console.log('data : ', data);
        console.log('total BRU supply:', this.totalBTKN);
      })
      .catch((err: any) => {
        console.log('err to get total supply of BRU tokens: ', err);
      });
  }

  getExchangeRate() {
    this.nftService
      .getExchangeRate(environment.ABI.networks[3].address)
      .then((data: any) => {
        // this.BTKN = data / 10000000000000000;
        this.exchangeRate = data / 1000000000000000000;
        console.log('data : ', data);
        console.log('total BRU supply:', this.BTKN);
      })
      .catch((err: any) => {
        console.log('err to get total supply of BRU tokens: ', err);
      });
  }

  redeemInternal(amount: any) {
    const sc = environment.ABI.networks[3].address;
    const weiAmount = BigInt(amount * 10 ** 16);
    this.nftService
      .redeemInternal(weiAmount, sc)
      .then((data: any) => {
        this.totalSupply();
        console.log(data);
        console.log(this.dbal);
      })
      .catch((err: any) => {
        console.log(err.message);
      });
  }
  async redeemInternalV1(amount: any) {
    try {
      let interest = await this.getInterestAmount()
      interest = Math.round(interest* 10 ** 18)
      console.log(interest,"interest here")
      const converted_amount = this.web3Service.convertToSmallestUnit(amount)
      const result = await this.web3Service.artifactsToContractV1().methods.redeem(converted_amount,interest).send({
        "from": this.userAddress
      })
      this.withdrawBtnClicked = false;
      if (result.status) {
        this.urlToViewTransaction = this.maticurl + result["transactionHash"]
        this.withdrawBtnClicked = false;
        this.withdrawSuccess = true;
      }
    } catch (error) {
      console.log('Errow while withdrawing Matic from the pool')
      console.log(error)
    }
  }
  viewTransaction() {
    if (this.urlToViewTransaction) {
      window.open(this.urlToViewTransaction, '_blank')
    }
  }

}
