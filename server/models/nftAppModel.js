const mongoose = require('mongoose');
const { Schema } = mongoose;

const nftDataApp = mongoose.Schema({
    commodity: {
        type: String,
    },
    commodityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commodities',
    },
    commodityName: {
        type: String,
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
        ref: 'warehouseDeposit',
        // required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        // required: true
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
    pool: {
        type: Number,
        default: 1
    },
    dataHash: {
        type: String
    }
});

nftDataApp.pre(/^find/, function (next) {
    this.populate({
        path: 'depositApplicationID',
    });

    next();
});
nftDataApp.pre(/^find/, function (next) {
    this.populate({
        path: 'userId',
    });

    next();
});

const NftDataApp = mongoose.model('nftDataApp', nftDataApp);

module.exports = NftDataApp;
