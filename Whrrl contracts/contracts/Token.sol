pragma solidity ^0.5.0;
import "./Common.sol";
import "./Insurance.sol";
import "./CmaAudits.sol";
import "./Loans.sol";

contract Asset is InsuranceSc, CmaSc, Loans {
    bytes32[] public bankLoanIds;
    //  uint256   public deliveryToken;
    event Burn(address indexed _from, uint256 _value);

    //"asd","0x6162636400000000000000000000000000000000000000000000000000000000","12","11","1000","20","20000","0x5a0b54d5dc17e0aadc383d2db43b0a0d3e029c4c"
    // 0xca35b7d915458ef540ade6068dfe2f44e8fa733c
    constructor(
        string memory _otherDetails,
        //    bytes32 _warehouseId,
        bytes32 _commodity,
        //  bytes32 _grade,
        //bytes32 _unit,
        uint256 _timestamp,
        uint256 _expiryDate,
        //uint256 _numberOfPackges,
        uint256 _quantity,
        uint256 _marketValueAtTheTimeDepositPerUnit,
        uint256 _totalMarketValue,
        address _farmerAddress
    ) public {
        //require(_marketValueAtTheTimeDepositPerUnit* _quantity)
        grainDetail.otherDetails = _otherDetails;
        grainDetail.commodity = _commodity;
        //   grainDetail.grade = _grade;
        grainDetail.quantity = _quantity;
        grainDetail.timestamp = _timestamp;
        //grainDetail.warehouseId = _warehouseId;
        grainDetail.expiryDate = _expiryDate;
        // grainDetail.numberOfPackges = _numberOfPackges;
        grainDetail
            .marketValueAtTheTimeDepositPerUnit = _marketValueAtTheTimeDepositPerUnit;
        grainDetail.totalMarketValue = _totalMarketValue;
        //   grainDetail.farmerAddress=_farmerAddress;
        //   grainDetail.unit = _unit;

        grainDetail.whrStatus = 1;
        farmerAddress = _farmerAddress;
        valuePerToken = _marketValueAtTheTimeDepositPerUnit;
        balances[_farmerAddress] = Balance(_quantity, 0, 0);
        owner = msg.sender;
    }

    // kill the token at the time of 100 % delivery
    function killToken()
        public
        onlyOwner(msg.sender)
        tokenActive
        returns (bool done)
    {
        grainDetail.whrStatus = 0;
        return true;
    }

    //burn the token at the time of sell
    function burn(uint256 value) public tokenActive returns (bool) {
        Balance memory userBalance = balances[farmerAddress];
        if (userBalance.freeTokens >= value) {
            balances[farmerAddress] = Balance(
                userBalance.freeTokens -= (value),
                userBalance.lienTokens,
                0
            );
            grainDetail.deliveredToken += (value);
            //  userBalance.freeTokens-=(value);
            //  emit Burn(msg.sender, value);
            if (grainDetail.deliveredToken == grainDetail.quantity) {
                grainDetail.whrStatus = 0;
            }
            //  emit Burn(msg.sender, value);
            return true;
        } else {
            revert("insufficient balance");
        }
    }
}
