import { NgtscCompilerHost } from '@angular/compiler-cli/src/ngtsc/file_system';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChainlinkAPIService } from 'src/app/common/services/chainlink-api.service';
@Component({
  selector: 'app-nft-card',
  templateUrl: './nft-card.component.html',
  styleUrls: ['./nft-card.component.css'],
})
export class NftCardComponent implements OnChanges, OnInit {
  @Input() nft: any;
  @Input() readOnly: boolean = false;
  @Output('borrow') borrowEvent: EventEmitter<any> = new EventEmitter();
  @Output('repay') repayEvent: EventEmitter<any> = new EventEmitter();
  borrowBtnClicked: boolean = false;
  borrowForm: FormGroup;
  inrUsdPrice: any;
  ethUsd: any;
  inrUsd: any;
  img: any;
  path = '../../../../../assets/'

  constructor(
    private fb: FormBuilder,
    private chainlinkService: ChainlinkAPIService
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
      amountRepaid: [''],
    });
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges) {
    this.nft = { ...changes.nft.currentValue };
    this.img = this.nft.commodity.replace("/", "-", " ", "-", "  ", "-")

    console.log(this.nft)
    // console.log(this.img)

    const {
      _id,
      commodity,
      quantity,
      nftPrice,
      borrowed,
      borrowedAmount,
      repaid,
      repaidAmount,
    } = this.nft;

    const usdCharges = this.chainlinkService.roundOffDecimal(
      this.chainlinkService.convertInrToUsd(nftPrice)
    );

    const usdBorrowed = this.chainlinkService.roundOffDecimal(
      this.chainlinkService.convertInrToUsd(borrowedAmount)
    );

    const usdRepaid = this.chainlinkService.roundOffDecimal(
      this.chainlinkService.convertInrToUsd(repaidAmount)
    );

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

    if (this.readOnly) return;

    // if (borrowed) {
    //   this.borrowForm.controls.repayAmount.addValidators([
    //     Validators.required,
    //     Validators.min(1),
    //     Validators.max(borrowedAmount),
    //   ]);
    // } else {
    //   this.borrowForm.controls.borrowAmount.addValidators([
    //     Validators.required,
    //     Validators.min(1),
    //     Validators.max(
    //       Math.round((usdCharges * 0.7 + Number.EPSILON) * 100) / 100
    //     ),
    //   ]);
    // }
  }

  handleSubmitBorrow() {
    if (this.borrowForm.invalid) return;
    // const value = {
    //   nftId: this.borrowForm.value.nftId,
    //   borrowAmount: this.chainlinkService.roundOffDecimal(
    //     this.chainlinkService.convertUsdToInr(
    //       this.borrowForm.value.borrowAmount
    //     )
    //   ),
    // };
    // alert("hellow internal borrow")
    this.borrowEvent.emit(this.nft);
  }

  handleSubmitRepay() {
    if (this.borrowForm.invalid) return;
    // console.log(this.borrowForm.value);

    // const value = {
    //   nftId: this.borrowForm.value.nftId,
    //   repayAmount: this.chainlinkService.roundOffDecimal(
    //     this.chainlinkService.convertUsdToInr(this.borrowForm.value.repayAmount)
    //   ),
    // };
    // console.log(value)

    this.repayEvent.emit(this.nft);
  }

  convertDollarToMatic(val: any) {
    return (val * 0.61728).toFixed(4)
  }
}