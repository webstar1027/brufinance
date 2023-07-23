pragma solidity ^0.5.0;

contract Commons {
    address public farmerAddress;
    uint8 public numberOfLoans = 0;
    uint8 public numberOfCmaAudits = 0;
    uint256 public valuePerToken = 0;
    mapping(address => Balance) public balances;
    bool public isInsurance;
    bool public isAudit;
    address public owner;

    //uint8 public KillStatus=0;
    GrainDetail public grainDetail;
    struct GrainDetail {
        string otherDetails;
        bytes32 commodity;
        //  bytes32 grade;
        uint256 quantity;
        uint256 timestamp;
        //  bytes32 warehouseId;
        uint256 expiryDate;
        uint256 repaymentLoanAmount;
        uint256 marketValueAtTheTimeDepositPerUnit;
        uint256 totalMarketValue;
        //    bytes32 unit;
        //    address farmerAddress;
        uint256 deliveredToken;
        uint256 lienToken;
        bool lienStatus;
        uint256 totalLoanAmount;
        // uint256 repaymentLoanAmount;
        uint8 whrStatus;
    }

    struct Balance {
        uint256 freeTokens;
        uint256 lienTokens;
        uint8 walletType;
    }

    modifier onlyOwner(address _account) {
        require(owner == _account, "Sender not authorized.");
        _;
    }

    modifier isInsuranceDone() {
        require(isInsurance, "insurance  required.");
        _;
    }

    modifier isAuditDone() {
        require(isAudit, "Audit required.");
        _;
    }

    modifier tokenActive() {
        require(grainDetail.whrStatus == 1, "token is not active now.");
        _;
    }
}
