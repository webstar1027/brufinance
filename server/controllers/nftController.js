const mongoose = require('mongoose')
const crypto = require('crypto')
const Web3 = require('web3')
const ABI = require("../Abi/Token")
const abi = require("../Abi/Pool").abi
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const NFT = require("../models/nftModel");
const NFTApp = require("../models/nftAppModel");
const wDeposits = require("../models/warehouseDepositModel");
const commodity = require("../models/commodityModel");
const loanApplication = require('../models/loanApplication')
const { response } = require('express');
const applicant = require("../models/applicantModel").User;
const web3 = new Web3(process.env.RPC_URL)
let poolAddress = '0x75D316b7c65e8117ca4130de836Cf641fC871B15'

const polyweb3 = new Web3("https://matic-mumbai.chainstacklabs.com")
let poolContract = new polyweb3.eth.Contract(abi, poolAddress)


const filterObj = (obj, ...allowedFields) => {
  const filteredObj = Object.keys(obj).reduce((accObj, field) => {
    if (allowedFields.includes(field)) accObj[field] = obj[field];

    return accObj;
  }, {});

  return filteredObj;
};

exports.getAllNftsApp = catchAsync(async (req, res, next) => {
  const skip = +req.query.skip || 0;
  const limit = +req.query.limit || 10;
  const matchQuery = {
    // minted: true
  };
  console.log(req.query)
  console.log(req.query.networkId)
  // if (req.query.networkId) matchQuery.networkId = req.query.networkId;

  const data = await NFTApp.find(matchQuery).skip(skip).limit(limit);
  console.log("Getting all NFTs App")
  // console.log(data)

  res.status(200).json({
    success: true,
    data
  });
});

exports.getAllNfts = catchAsync(async (req, res, next) => {
  const skip = +req.query.skip || 0;
  const limit = +req.query.limit || 10;
  const matchQuery = {
    minted: false,
    nftPrice:{
      $gt:0
    },
    quantity:{
      $gt:0
    }
  };
  console.log(req.query)
  console.log(req.query.networkId)
  // if (req.query.networkId) matchQuery.networkId = req.query.networkId;
  console.log("Getting all NFTs")
  const data = await NFT.find(matchQuery).skip(skip).limit(limit).lean();

  var regex = new RegExp(["^", req.query.networkId, "$"].join(""), "i");
  const _dataMintedOnly = await NFT.find(
    {
      minted: true,
      borrowed: false,
      ownerAddress: regex,
      
    }
  );
  const _dataMintedAndBorrowed = await NFT.find(
    {
      minted: true,
      borrowed: true,
      ownerAddress: regex
    }
  );
  // console.log(_data)
  _dataMintedAndBorrowed.forEach(obj => {
    data.unshift(obj)
  })
  _dataMintedOnly.forEach(obj => {
    data.unshift(obj)
  })
  // console.log(data[0])

  const totalAssets = await NFT.countDocuments({ minted: true });
  const aggResult = await NFT.aggregate([
    {
      $match: { minted: true },
    },
    {
      $group: {
        _id: null,
        value: { $sum: "$nftPrice" },
      },
    },
  ]);
  const aggResults = await NFT.aggregate([
    {
      $match: { minted: true },
    },
    {
      $group: {
        _id: null,
        value: { $sum: "$nftPrice" },
      },
    },
  ]);

  const totalAssetsValue = aggResult[0] ? aggResult[0].value : 0;
  const totalAssetsValueMinted = aggResults[0] ? aggResults[0].value : 0;

  const totalVal = await NFT.aggregate([
    {
      $match: { minted: false },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        value: { $sum: "$nftPrice" },
        quantity: { $sum: "$quantity" },
      },
    },
  ]);

  const topCommodities = await NFT.aggregate([
    {
      $match: matchQuery,
    },
    {
      $group: {
        _id: "$commodity",
        total: { $sum: 1 },
        value: { $sum: "$nftPrice" },
        quantity: { $sum: "$quantity" },
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
    {
      $limit: 4,
    },
    {
      $project: {
        name: "$_id",
        _id: 0,
        total: 1,
        value: 1,
        quantity: 1
      },
    },
  ]);

  res.status(200).json({
    success: true,
    totalAssets,
    totalAssetsValue,
    topCommodities,
    totalVal,
    data,
    totalAssetsValueMinted
  });
});

exports.topComm = catchAsync(async (req, res, next) => {
  const skip = +req.query.skip || 0;
  const limit = +req.query.limit || 10;
  const matchQuery = {
    minted: false
  };
  console.log(req.query)
  console.log(req.query.networkId)

  const topCommodities = await NFT.aggregate([
    {
      $match: matchQuery,
    },
    {
      $group: {
        _id: "$commodity",
        total: { $sum: 1 },
        value: { $sum: "$nftPrice" },
      },
    },
    {
      $sort: {
        total: -1,
      },
    },
    {
      $limit: 4,
    },
    {
      $project: {
        name: "$_id",
        _id: 0,
        total: 1,
        value: 1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    topCommodities,
  });
});

exports.getNftDetails = catchAsync(async (req, res, next) => {
  const nft = await NFT.findById(req.params.nftId);

  if (!nft) {
    return next(new AppError("Cant find NFT details", 400));
  }

  res.status(200).json({
    success: true,
    data: nft,
  });
});
exports.getNftDetailsApp = catchAsync(async (req, res, next) => {
  const nft = await NFTApp.findById(req.params.nftId);

  if (!nft) {
    return next(new AppError("Cant find NFT App details", 400));
  }

  res.status(200).json({
    success: true,
    data: nft,
  });
});



exports.updateNftApp = catchAsync(async (req, res, next) => {
  const allowedUpdates = [
    "repaid",
    "borrowed",
    "borrowedAmount",
    "repaidAmount",
    "minted",
    "mintedTransactionHash",
    "borrowTxHash",
    "ownerAddress",
    "repayTxHash"
  ];
  console.log("req body", req.body)
  const updateObj = filterObj(req.body, ...allowedUpdates);
  console.log("Updating NFT App")
  console.log(updateObj)

  const updatedNft = await NFTApp.findByIdAndUpdate(req.params.nftId, updateObj, {
    new: true,
  });

  res.status(200).json({
    success: true,
    data: updatedNft,
  });
});
exports.updateNft = catchAsync(async (req, res, next) => {
  const allowedUpdates = [
    "repaid",
    "borrowed",
    "borrowedAmount",
    "repaidAmount",
    "minted",
    "mintedTransactionHash",
    "borrowTxHash",
    "ownerAddress",
    "repayTxHash"
  ];

  const updateObj = filterObj(req.body, ...allowedUpdates);
  console.log("Updating NFT")
  console.log(updateObj)

  const updatedNft = await NFT.findByIdAndUpdate(req.params.nftId, updateObj, {
    new: true,
  });

  res.status(200).json({
    success: true,
    data: updatedNft,
  });
});

async function getFarmerAddress(userId) {
  let user = await applicant.findOne({ _id: userId }).exec()
  return user.bresponse.result.address
}

async function getHashfromChain(nftId) {
  let nft = await poolContract.methods.nft(nftId).call()
  console.log(nft, "nft result")

  console.log('Hash from NFT', nft['dataHash'])
  return nft['dataHash']
}

async function getHashFromQuorum(depositApplicationId) {
  let depositApplicationData = await wDeposits.findOne({ _id: depositApplicationId }).exec()
  console.log(depositApplicationData, "Deposit application data")
  let contractAddress = depositApplicationData.bresponse.result.contractAddress
  console.log(contractAddress)
  const contract = new web3.eth.Contract(ABI, contractAddress)
  let result = await contract.methods.grainDetail().call()
  let farmerAddress = await getFarmerAddress(depositApplicationData.submittedBy)
  var tokenDetails = {
    'otherDetails': result.otherDetails,
    'commodity': web3.utils.hexToString(result.commodity),
    'timestamp': Number(result.timestamp),
    'expiryDate': Number(result.expiryDate),
    'quantity': Number(Math.ceil(result.quantity / Math.pow(10, 6))),
    'marketValueAtTheTimeDepositPerUnit': Number(result.marketValueAtTheTimeDepositPerUnit / Math.pow(10, 6)).toFixed(2),
    'totalMarketValue': Number(result.totalMarketValue / Math.pow(10, 6)),
    'farmerAddress': farmerAddress
  };
  const hash = crypto.createHash('sha256').update(JSON.stringify(tokenDetails)).digest('base64');
  console.log(tokenDetails)
  return hash
}

exports.getHash = catchAsync(async (req, res, next) => {
  let { depositApplicationId, nftId } = req.body
  console.log(depositApplicationId, nftId)
  console.log(typeof depositApplicationId, typeof nftId)
  if (depositApplicationId != undefined && nftId != undefined) {
    let hash1 = await getHashfromChain(mongoose.Types.ObjectId(nftId))
    let hash2 = await getHashFromQuorum(depositApplicationId)
    console.log("Hash from Chain", hash1)
    console.log("Hash from QUorum", hash2)
    if (hash1 == hash2) {
      res.status(200).send({ hashMatched: true })
    } else {
      res.status(200).send({ hashMatched: false })

    }
  } else {

    response.status(400).send("Invalid fields")
  }

})

async function generateLoanApplication(whr, loanAmount) {
  console.log("WHR", whr)
  const applicationStatus = 'approved';
  const insuranceAdded = 'true';
  const cmaAppointmentstatus = 'pending';
  const cmaId = 'nil';
  const notificationSentToCMA = false;
  const cmaReportGenerated = false;
  const { address } = whr;
  const approved = {};
  approved.loanAmount = loanAmount;
  // approved.loanAmount = req.body.loanAmount;
  // approved.processingFee = req.body.processingFee;
  // approved.rateOfInt = req.body.rateOfInt;
  // approved.loanTenor = req.body.loanTenor;
  // approved.emiAmount = req.body.emiAmount;
  // approved.repaymentSchedule = req.body.repaymentSchedule;
  approved.timestamp = new Date();

  const newform = {
    submittedBy: whr.submittedBy,
    applicationType: 'bruLoan',
    loanSource: 'bru',
    applicantName: whr.applicantName,
    warehouseName: whr.warehouseName,
    wId: whr.wId,
    bId: '62832c2147dc38f94218e612',
    bname: 'Whrrl - BRU Bank',
    applicantPhoneNo: whr.applicantPhoneNo,
    applicantEmail: whr.applicantEmail,
    address: address,
    aadharNo: whr.aadharNo,
    commodityName: whr.commodityName,
    commodityId: whr.commodityId,
    comVariety: whr.commodityGrade,
    totalReceiptValue: Number(`${whr.totalReceiptValue}`.trim()),
    depositQuantity: whr.depositQuantity,
    depositQty: whr.depositQty,
    depositUom: 'KG',
    commodityGrade: whr.commodityGrade,
    warehouseNumber: whr.warehouseNumber,
    blockchainReceiptId: whr.blockchainReceiptId,
    applicationStatus: applicationStatus,
    cmaAppointmentstatus: cmaAppointmentstatus,
    cmaId: cmaId,
    cmaReportGenerated: cmaReportGenerated,
    notificationSentToCMA: notificationSentToCMA,
    insuranceAdded: insuranceAdded,
    timestamp: Date.now(),
    submittedByWarehouse: true,
    // lienUnit: whr.lien_unit,
    // netQty: whr.net_qty,
    // branch: whr.branch,
    // recordCrby: whr.record_crby,
    // recordCrdate: whr.record_crdate,
    approved
    // pushBy: 'script',
  };
  return newform
}

exports.lockAsset = catchAsync(async (req, res, next) => {
  let depositApplicationId = req.body.depositApplicationId
  let loanAmount = req.body.loanAmount
  console.log(depositApplicationId, loanAmount)
  if (depositApplicationId) {
    let depositApplicationData = await wDeposits.findOne({ _id: depositApplicationId }).exec()
    if (depositApplicationData.lienStatus == false || depositApplicationData.lienStatus == undefined) {
      let loanApplicationForm = await generateLoanApplication(depositApplicationData, loanAmount)
      let loanApplicationGenerationResult = (new loanApplication(loanApplicationForm)).save()
      if (loanApplicationGenerationResult) {
        let lockResult = await wDeposits.updateOne({ _id: depositApplicationId },
          {
            $set: {
              lienStatus: true,
              loanStatus: "applied"
            },
          })
        if (lockResult.modifiedCount == 1) {
          res.send({ status: "Asset locked" })
          console.log("Asset locked")


        } else {
          res.send({ status: "Asset lockng failed" })

          console.log("Asset locking failed");
        }
      }

    } else {
      res.send({ status: "Asset already locked" })

      console.log("asset already locked")
    }
  } else {
    res.status(400).send("Invalid ID")
  }
});

function generateRepayApplication(loanApplicationForm, repayAmount) {
  console.log("application form", loanApplicationForm)
  const repayForm = {

  }

  console.log(repayForm)
}


exports.unlockAsset = catchAsync(async (req, res, next) => {
  let depositApplicationId = req.body.depositApplicationId
  let repayAmount = req.body.repayAmount
  console.log(depositApplicationId, repayAmount)
  if (depositApplicationId) {
    let depositApplicationData = await wDeposits.findOne({ _id: depositApplicationId }).exec()
    if (depositApplicationData.lienStatus == true || depositApplicationData.lienStatus == undefined) {
      console.log(depositApplicationData.blockchainReceiptId)
      const loanApplicationForm = await loanApplication.findOne({ blockchainReceiptId: depositApplicationData.blockchainReceiptId }).exec()
      let repayForm = generateRepayApplication(loanApplicationForm, repayAmount)
      // console.log(loanApplicationForm._id.toString())
      // let unlockResult = await wDeposits.updateOne({ _id: depositApplicationId }, {
      //   $set: {
      //     lienStatus: false
      //   },
      // })
      // if (unlockResult.modifiedCount == 1) {
      //   res.send({ status: "Asset unlocked" })
      //   console.log("Asset unlocked")
      // } else {
      //   res.send({ status: "Asset unlocking failed" })

      //   console.log("Asset unlocking failed")
      // }

    } else {
      res.send({ status: "Asset already locked" })

      console.log("asset already locked or lien status undefined")
    }
  } else {

    res.status(400).send("Invalid ID")
  }
});
