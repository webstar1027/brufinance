const mongoose = require('mongoose');
const { Schema } = mongoose;

const nftData = mongoose.Schema({
  commodity: {
    type: String,
  },
  commodityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commodities',
  },
  // Commodity Price
  nftPrice: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  interest: {
    type: Number,
  },
  platformCharges: {
    type: Number,
  },
  sc: {
    type: Object,
  },
  borrowedAmount: {
    type: Number,
    default: 0,
  },
  borrowed: {
    type: Boolean,
    default: false,
  },
  repaidAmount: {
    type: Number,
    default: 0,
  },
  repaid: {
    type: Boolean,
    default: false,
  },
  ownerAddress: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  minted: {
    type: Boolean,
    default: false,
  },
  mintedTransactionHash: {
    type: String,
    default: "",
  },
  depositApplicationID: {
    type: Schema.Types.ObjectId,
    ref: 'warehousedeposits',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  borrowTxHash: {
    type: String,
    default: "",
  },
  repayTxHash: {
    type: String,
    default: "",
  },
  network: {
    type: String,
    default: "",
  },
});

nftData.pre(/^find/, function (next) {
  this.populate({
    path: 'depositApplicationID',
  });

  next();
});
nftData.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
  });

  next();
});

const NftData = mongoose.model('nftData', nftData);

module.exports = NftData;
