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
  @Input() index: any;
  @Input() readOnly: boolean = false;
  @Input() mintBtnClicked!: EventEmitter<any>;
  @Output('borrow') borrowEvent: EventEmitter<any> = new EventEmitter();
  @Output('repay') repayEvent: EventEmitter<any> = new EventEmitter();
  @Output('mint') mintEvent: EventEmitter<any> = new EventEmitter();
  borrowBtnClicked: boolean = false;
  borrowForm: FormGroup;
  inrUsdPrice: any;
  mintButtonClicked: Boolean = false;
  ethUsd: any;
  inrUsd: any;
  img: any;
  path = '../../../../../assets/';

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

  ngOnInit(): void {
    // if (this.mintBtnClicked) {
    this.mintBtnClicked.subscribe((data) => {
      console.log(data);
      // if (data['mint']) {
      const doc2 = document.getElementById('mintingBtn' + data['index']);
      if (doc2) doc2.style.display = 'none';
      const doc = document.getElementById('depositNftBtn' + data['index']);
      if (doc) doc.style.display = 'block';
      // this.mintButtonClicked = true;
      // } else {
      //   const doc2 = document.getElementById('mintingBtn' + data['index']);
      //   if (doc2) doc2.style.display = 'block';
      //   const doc = document.getElementById('depositNftBtn' + data['index']);
      //   if (doc) doc.style.display = 'none';
      //   // this.mintButtonClicked = false;
      // }
      // Do something in the childComponent after parent emits the event.
    });
    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.nft = { ...changes.nft.currentValue };
    this.img = this.nft.commodity.replace('/', '-', ' ', '-', '  ', '-');

    console.log(this.nft);
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
  handleSubmitMint() {
    console.log('Mining process staring....');
    console.log(this.index);
    const doc = document.getElementById('depositNftBtn' + this.index);
    if (doc) doc.style.display = 'none';
    const doc2 = document.getElementById('mintingBtn' + this.index);
    if (doc2) doc2.style.display = 'block';
    this.mintEvent.emit(this.nft);
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
    return (val * 0.61728).toFixed(4);
  }

  loadDefaultImage(val: any) {
    let arr = [
      'CASHEWNUT (RAW).jpg',
      'CHANADAL.jpg',
      'Gram.jpg',
      'Green Gram Whole.jpg',
      'Lima Beans.jpg',
      'MAIZE-MAKA.jpg',
      'Maize.jpg',
      'Milk Powder Bag.jpg',
      'MILK- POWDER-BAG.jpg',
      'MURMURE.jpg',
      'Paddy.jpg',
      'Pearl Millet.jpg',
      'PEAS-VATANA.jpg',
      'Pigeon Pea (Red Gram).jpg',
      'Rice.jpg',
      'Sorghum.jpg',
      'Soyabean.jpg',
      'Tur.jpg',
      'Turmeric.jpg',
      'VAL-PAVATA.jpg',
      'Wheat.jpg',
    ];

    if (arr.indexOf(val + '.jpg') > -1) {
      return `${val}.jpg`;
    } else {
      return 'default.jpg';
    }
  }
}
