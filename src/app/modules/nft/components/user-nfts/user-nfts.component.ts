import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { NftService } from '../../services/nft.service';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { ChainlinkAPIService } from 'src/app/common/services/chainlink-api.service';
import { TopCommodity } from '../../../../common/models/top-commodity';
import { Web3Service } from 'src/app/common/services/web3.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NftCardComponent } from '../nft-card/nft-card.component'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

interface NftSearchQuery {
  skip?: number;
  limit?: number;
  networkId?: string;
}

@Component({
  selector: 'app-user-nfts',
  templateUrl: './user-nfts.component.html',
  styleUrls: ['./user-nfts.component.css'],
})
export class UserNftsComponent implements OnInit {
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
  borrowSuccess: Boolean = false;
  repaySuccess: Boolean = false;
  borrowAmount: number = 0;
  repayAmount: number = 0;
  urlToViewTransaction: any;
  maticurl = "https://mumbai.polygonscan.com/tx/";

  constructor(
    private nftService: NftService,
    private web3Service: Web3Service,
    private chainlinkService: ChainlinkAPIService,
    private modalService: NgbModal,
    private fb: FormBuilder,
  ) {
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

  ngOnChanges(changes: any) {
    console.log(changes.amount.currentValue);
  }

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

  updateNFTVal() {
    // this.selectedNft = { ...changes.nft.currentValue };
    this.img = this.selectedNft.commodity.replace("/", "-", " ", "-", "  ", "-")

    console.log(this.selectedNft)

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
    const usdBorrowed = this.web3Service.convertToLargestUnit(borrowedAmount) + " MATIC"

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

    this.showSpinner = true;
    const skip = query.skip || this.nfts.length;
    const limit = query.limit || 10;
    const networkId = this.networkId;

    const searchQuery: NftSearchQuery = {
      skip,
      limit,
      networkId,
    };

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

  handleBorrow(event: any, modal: any) {
    console.log(event)

    this.modalService.open(modal, { windowClass: "BorrowModal", backdrop: 'static', keyboard: false });
    this.selectedNft = event;

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
    // console.log(this.selectedNft.bor, "matic to usd value")
    this.updateNFTVal();
  }

  handleRepay(event: any, modal: any) {
    console.log(event)
    this.modalService.open(modal, { windowClass: "BorrowModal", backdrop: 'static', keyboard: false });
    this.selectedNft = event;
    this.updateNFTVal();
  }
  handleSubmitRepay(eventName: any, modal: any) {
    this.eventName = {
      name: eventName,
      modal: modal
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
    console.log("internal brepya")
    this.web3Service.artifactsToContractV2().methods.getTokenId(this.selectedNft._id).call()
      .then((tokenId: any) => {
        this.web3Service.artifactsToContractV2().methods.getBorrowDetails(tokenId).call()
          .then((borrowDetails: any) => {
            const borrowedAmount = borrowDetails[0]
            const borrowedOn = borrowDetails[1]
            const interest = borrowDetails[2]
            const borrowInterest = this.getBorrowInterest(borrowDetails)
            console.log(borrowInterest, "Borrow amount")
            const newAmount = this.repayAmount + borrowInterest
            const amount = this.chainlinkService.convertEthToWei(newAmount)
            console.log(amount, "repay amount")
            this.web3Service.artifactsToContractV2().methods.repay(tokenId, Math.round(borrowInterest * 10 ** 18)).send({
              from: this.web3Service.getAccount(),
              gas: "210000",
              value: amount
            }).then((result: any) => {
              console.log("borrow agins nft", result)
              this.urlToViewTransaction = this.maticurl + result["transactionHash"]
              this.borrowSuccess = false;
              this.repaySuccess = true;
              this.showLoaderForRepay = false;
              this.modalService.open(modal, { backdrop: 'static', keyboard: false });
              this.updateNft(this.borrowForm.value.nftId, { repayed: true, repayedAmount: amount });
            }).catch((error: any) => {
              this.showLoaderForRepay = false;
              console.log(error, "Error in while repaying", error)
            })
            // console.log(borrowInterest,"Borrowed INterest")
            // this.borrowForm.controls['amountBorrowed'].setValue(this.web3Service.convertToLargestUnit(borrowDetails[0])+" MATIC");
          })

      })
    // console.log(value)
    // this.showLoaderForRepay = true;
    // this.repayBorrowInternal(value.repayAmount, value.nftId);
  }
  getBorrowInterest(borrowDetails: any): number {
    const currentTime = Math.round(new Date().getTime() / 1000)
    const difference = currentTime - parseInt(borrowDetails[1])
    let days = difference / (60 * 60 * 24)
    let interest;
    days = 1
    if (days >= 1) {
      const principalAmount = parseFloat(this.web3Service.convertToLargestUnit(borrowDetails[0]))
      interest = (days * principalAmount * 0.13) / 365
      return interest
    } else {
      return 0
    }
  }

  handleSubmitBorrow(eventName: any, modal: any) {
    this.eventName = {
      name: eventName,
      modal: modal
    };
    console.log("INTERNAL BORROW")
    const amount = this.web3Service.convertToSmallestUnit('0.03')
    console.log(amount, "amount iwei")
    this.showLoaderForBorrow = true;

    this.web3Service.artifactsToContractV2().methods.getTokenId(this.selectedNft._id).call()
      .then((tokenId: any) => {
        console.log(tokenId, "token id")
        // const amount = Math.round((this.borrowForm.value.borrowAmount) * (10 ** 18))
        // const amount = Math.round((this.borrowAmount) * (10 ** 18))
        const amount = this.chainlinkService.convertEthToWei(this.borrowAmount)
        console.log(amount, "amount to borrow")
        this.web3Service.artifactsToContractV2().methods.borrow(amount, tokenId).send({
          from: this.web3Service.getAccount(),
          gas: "210000"
        }).then((result: any) => {
          this.showLoaderForBorrow = false;
          console.log("borrow agins nft", result)
          this.urlToViewTransaction = this.maticurl + result["transactionHash"]
          this.updateNft(this.borrowForm.value.nftId, { borrowed: true, borrowedAmount: amount });
          this.modalService.open(modal, { backdrop: 'static', keyboard: false });
          this.borrowSuccess = true;
        }).catch((error: any) => {
          this.showLoaderForBorrow = false;
          console.log("Error while borrowing", error)
        })
      })

    const value = {
      nftId: this.borrowForm.value.nftId,
      borrowAmount: this.chainlinkService.roundOffDecimal(
        this.chainlinkService.convertUsdToInr(
          this.borrowForm.value.borrowAmount
        )
      ),
    };
    console.log(value)
    this.showLoaderForBorrow = true;
    // this.borrowInternal(value.borrowAmount, value.nftId);
  }

  handleShowMore() {
    this.loadData();
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
        console.log(data)
        this.urlToViewTransaction = this.maticurl + data["transactionHash"]
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
        console.log(data)
        this.urlToViewTransaction = this.maticurl + data["transactionHash"]
        this.updateNft(nftId, { repayed: true, repayedAmount: amount });
      })
      .catch((err: any) => {
        this.showLoaderForRepay = false;
        console.log(err);
      });
  }

  updateNft(nftId: string, obj: object) {
    this.nftService.updateNft(nftId, obj).subscribe((response: any) => {
      const nftIndex = this.nfts.findIndex((nft) => nft._id === nftId);
      this.nfts[nftIndex] = response.data;
      this.selectedNft = response.data;
      this.modalService.dismissAll();
      if (this.eventName.name === 'repay') {
        this.modalService.open(this.eventName.modal)
      }
      if (this.eventName.name === 'borrow') {
        this.modalService.open(this.eventName.modal)
      }
      this.updateNFTVal();
      this.showLoaderForRepay = false;
      this.showLoaderForBorrow = false;
    });
  }

  viewTransaction() {
    if (this.urlToViewTransaction) {
      window.open(this.urlToViewTransaction, '_blank')
    }
  }
  convertDollarToMatic(val: any) {
    return (val * this.chainlinkService.priceConversions.maticUsd).toFixed(4)
  }
  eligibleLoanAmount(val: any) {
    return (val * (70 / 100)).toFixed(4)
  }
  calculateInterestandPlatformFees(val: number) {
    console.log(val)
    this.borrowAmount = val;
    if (this.borrowAmount) {
      this.interestApplicable = (this.borrowAmount * (13 / 100)).toFixed(4)
      this.platformFees = (this.borrowAmount * (0.25 / 100)).toFixed(4)
    }
  }
  calculateInterestandTotalAmount(val: number) {
    console.log(val)
    this.repayAmount = val;
    if (this.repayAmount) {
      this.interestApplicableRepay = (this.repayAmount * (13 / 100)).toFixed(4)
      this.totalRepaymentAmount = (Number(this.interestApplicableRepay) + Number(this.repayAmount)).toFixed(4);
    }
  }
}
