const mongoose = require('mongoose');

const repaymentScheduleSchema = mongoose.Schema({
  loanId: {
    type: String,
  },
  issuerName: {
    type: String,
  },
  noc: {
    type: String,
  },
  openingPrincipal: {
    type: Number,
  },
  installmentAmt: {
    type: Number,
  },
  principal: {
    type: Number,
  },
  interest: {
    type: Number,
  },
  closingPrincipal: {
    type: Number,
  },
  duaDate: {
    type: Date,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  quantity: {
    type: Number,
  },
  status: {
    type: String,
  },
  appApproveResponse: {
    type: Object,
  },
  releaseQty: {
    type: Number,
  },
  source: {
    type: String
  },
  loanAmount: {
    type: Number
  },
  noOfBagsReleased: {
    type: Number
  },
  totalNoOfBags: {
    type: Number
  },
  repaymentAmount: {
    type: Number
  },
  quantityToBeReleased: {
    type: Number
  }
});

const groupDate = (module.exports = mongoose.model(
  'repayment_schedule',
  repaymentScheduleSchema,
  'repayment_schedule'
));
