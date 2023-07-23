pragma solidity ^0.5.0;
import "./Common.sol";

contract InsuranceSc is Commons {
    Insurance public insuranceDetails;

    struct Insurance {
        string componyName;
        bytes32 policeId;
        uint256 amount;
        uint256 fromDate;
        uint256 endDate;
        bool status;
    }

    //"sasasasas","0x6162636400000000000000000000000000000000000000000000000000000000",212121212,"55555555","55555555",true
    function updateInsurance(
        string memory _componyName,
        bytes32 _policeId,
        uint256 _amount,
        uint256 _fromDate,
        uint256 _endDate,
        bool _status
    ) public onlyOwner(msg.sender) tokenActive returns (bool done) {
        // bytes32[] memory componyName=_componyName;
        insuranceDetails.componyName = _componyName;
        insuranceDetails.policeId = _policeId;
        insuranceDetails.amount = _amount;
        insuranceDetails.fromDate = _fromDate;
        insuranceDetails.endDate = _endDate;
        insuranceDetails.status = _status;
        isInsurance = true;
        return done = true;
    }
}
