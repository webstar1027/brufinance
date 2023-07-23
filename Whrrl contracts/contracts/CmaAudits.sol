pragma solidity ^0.5.0;
import "./Common.sol";
import "./Insurance.sol";

contract CmaSc is Commons {
    CmaAudit[] public cmaAudits;
    struct CmaAudit {
        string remark;
        bytes32 gainName;
        bytes32 gainGrade;
        uint256 valuePerToken;
        uint256 quantity;
        bytes32 cmaId;
        uint8 status;
    }

    //"sasasasas","0x6162636400000000000000000000000000000000000000000000000000000000","0x6162636400000000000000000000000000000000000000000000000000000000",10,666666666,"0x6162636400000000000000000000000000000000000000000000000000000000",21
    function UpdateAuditReport(
        string memory remark,
        bytes32 gainName,
        bytes32 gainGrade,
        uint256 value,
        uint256 quantity,
        bytes32 cmaId,
        uint8 _status
    ) public tokenActive returns (bool done) {
        valuePerToken = value;
        cmaAudits.push(
            CmaAudit(
                remark,
                gainName,
                gainGrade,
                value,
                quantity,
                cmaId,
                _status
            )
        );
        numberOfCmaAudits++;
        isAudit = true;
        return done = true;
    }
}
