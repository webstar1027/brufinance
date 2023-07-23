const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
// User Schema
const loanApplicationSchema = mongoose.Schema({
    submittedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicationType: {
        type: String
    },
    applicantName: {
        type: String
    },
    applicantPhoneNo: {
        type: String
    },
    applicantEmail: {
        type: String
    },
    insuranceAdded: {
        type: String
    },
    warehouseName: {
        type: String
    },
    wId: {
        type: String
    },
    bId: {
        type: String
    },
    bname: {
        type: String
    },
    whReceiptId: {
        type: String
    },
    cmaAppointmentstatus: {
        type: String
    },
    cmaId: {
        type: String
    },
    notificationSentToCMA: {
        type: String
    },
    cmaReportGenerated: {
        type: String
    },
    audit: {
        cCname: {
            type: String
        },
        cOname: {
            type: String
        },
        auditResult: {
            type: String
        },
        cas: {
            type: String
        },
        datetime: {
            type: String
        },
    },
    cmaDetails: {
        CMAgrainName: {
            type: String
        },
        CMAquantity: {
            type: String
        },
        CMAgrade: {
            type: String
        },
        CMAtotalMarketValue: {
            type: Number
        },
        CMAperUnitValue: {
            type: Number
        },
        CMAnoOfBags: {
            type: Number
        }
    },
    address: {
        addressL1: {
            type: String
        },
        addressL2: {
            type: String
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
        }
    },
    aadhar: {
        type: String
    },
    grainName: {
        type: String
    },
    values: {
        type: Number
    },
    quantity: {
        type: Number
    },
    grade: {
        type: String
    },
    whrno: {
        type: String
    },
    documentPath: {
        type: String
    },
    applicationStatus: {
        type: String
    },
    approved: {
        loanAmount: {
            type: Number
        },
        processingFee: {
            type: Number
        },
        rateOfInt: {
            type: Number
        },
        emiAmount: {
            type: Number
        },
        loanTenor: {
            type: String
        },
        repaymentSchedule: {
            type: Date
        },
        timestamp: {
            type: Date
        }
    },
    timestamp: {
        type: Date,
        default: new Date()
    },
    cmaAuditBresponse: {
        type: Object
    },
    appApproveResponse: {
        type: Object
    },
    loanAgreementAccepted: {
        type: Boolean,
        default: false
    },
    loanAgreementAcceptanceTimestamp: {
        type: Date
    }
});

const loanApplication = module.exports = mongoose.model('loanapplications', loanApplicationSchema, 'loanapplications');
