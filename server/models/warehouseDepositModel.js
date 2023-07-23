const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
// User Schema
const warehouseDepositSchema = mongoose.Schema({
    submittedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    applicationType: {
        type: String,
    },
    applicantName: {
        type: String,
    },
    applicantPhoneNo: {
        type: String,
    },
    applicantEmail: {
        type: String,
    },
    warehouseName: {
        type: String,
    },
    insuranceAdded: {
        type: String,
    },
    whReceiptId: {
        type: String,
    },
    wId: {
        type: String,
    },
    acceptedByWarehouse: {
        type: String,
    },
    address: {
        addressl1: {
            type: String,
        },
        addressl2: {
            type: String,
        },
        village: {
            type: String,
        },
        district: {
            type: String,
        },
        state: {
            type: String,
        },
        pincode: {
            type: String,
        },
    },
    aadhar: {
        type: String,
    },
    grainName: {
        type: String,
    },
    grain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commodities',
    },
    values: {
        type: String,
    },
    quantity: {
        type: String,
    },
    qty: {
        type: Number,
    },
    unit: {
        type: String,
    },
    grade: {
        type: String,
    },
    totalMarketValue: {
        type: String,
    },
    perUnitValue: {
        type: String,
    },
    noOfBags: {
        type: String,
    },
    whrno: {
        type: String,
    },
    documentPath: {
        type: String,
    },
    applicationStatus: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    cmaAppointmentstatus: {
        type: String,
    },
    cmaId: {
        type: String,
    },
    notificationSentToCMA: {
        type: String,
    },
    cmaReportGenerated: {
        type: String,
    },
    bresponse: {
        type: Object,
    },
    comVariety: {
        type: String,
    },
    loanStatus: {
        type: String,
        default: 'notApplied',
    },
    cancelledByUserTimestamp: {
        type: Date,
    },
    lienStatus: {
        type: Boolean,
    },
    approvedTimestamp: {
        type: Date,
    },
    downloadCount: {
        type: Number,
        default: 0,
    },
    hasSellOrder: {
        type: Boolean,
        default: false,
    },
    whrSource: {
        type: String,
        default: 'app',
    },
    // New; old key: aadhar
    aadharNo: {
        type: String,
        trim: true,
    },
    // New; old key: whReceiptId
    blockchainReceiptId: {
        type: String,
        trim: true,
    },
    // New; old key: grainName
    commodityName: {
        type: String,
    },
    // New; old key: grain
    commodityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commodities',
    },
    // New; old key: grade
    commodityGrade: {
        type: String,
        trim: true,
    },
    // New; old key: quantity
    depositQuantity: {
        type: String,
    },
    // New; old key: qty
    depositQty: {
        type: Number,
    },
    // New; old key: unit
    depositUom: {
        type: String,
    },
    // New; old key: values
    totalReceiptValue: {
        type: Number,
    },
    // New; old key: whrno
    warehouseNumber: {
        type: String,
    },
});

warehouseDepositSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'commodityId',
    });

    next();
});

module.exports = mongoose.model('warehousedeposits', warehouseDepositSchema);
