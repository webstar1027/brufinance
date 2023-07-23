let ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "remark",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "gainName",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "gainGrade",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "cmaId",
				"type": "bytes32"
			},
			{
				"internalType": "uint8",
				"name": "_status",
				"type": "uint8"
			}
		],
		"name": "UpdateAuditReport",
		"outputs": [
			{
				"internalType": "bool",
				"name": "done",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "freeTokens",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lienTokens",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "walletType",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "cmaAudits",
		"outputs": [
			{
				"internalType": "string",
				"name": "remark",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "gainName",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "gainGrade",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "valuePerToken",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "bytes32",
				"name": "cmaId",
				"type": "bytes32"
			},
			{
				"internalType": "uint8",
				"name": "status",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "farmerAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "grainDetail",
		"outputs": [
			{
				"internalType": "string",
				"name": "otherDetails",
				"type": "string"
			},
			{
				"internalType": "bytes32",
				"name": "commodity",
				"type": "bytes32"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "expiryDate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "repaymentLoanAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "marketValueAtTheTimeDepositPerUnit",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalMarketValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deliveredToken",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lienToken",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "lienStatus",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "totalLoanAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint8",
				"name": "whrStatus",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isAudit",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isInsurance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "numberOfCmaAudits",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "numberOfLoans",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "valuePerToken",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
module.exports= ABI