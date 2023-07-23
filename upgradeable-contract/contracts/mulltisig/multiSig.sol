//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./../core/BruPool.sol";


contract multiSig {
    address poolAddress;
    address[] public approvers;
    uint256 public quorum;

    struct Proposal {
        uint256 id;
        uint256 functionId;
        uint256 value;
        address addr;
        uint256 approvals;
        bool sent;
    }

    // struct AddProposal {
    //     uint256 id;
    //     address addr;
    //     uint256 approvals;
    //     bool sent;
    // }

    Proposal[] public proposals;
    //AddProposal[] public addProposals;

    mapping(address => mapping(uint256 => mapping(uint256 => bool)))
        public approvals;
    //mapping(address => mapping(uint256 => bool)) public addApprovals;

    constructor(
        address _poolAddress,
        address[] memory _approvers,
        uint256 _quorum
    ) {
        poolAddress = _poolAddress;
        approvers = _approvers;
        quorum = _quorum;
    }

    function createProposal(
        uint256 value,
        uint256 functionId,
        address addr
    ) external onlyApprover {
      
        proposals.push(
            Proposal(proposals.length, functionId, value, addr, 0, false)
        );
    }

    function addApprover(address approverAddress) external {
        approvers.push(approverAddress);
    }

    function removeApprover(address approverAddress) external {
        uint i = 0;
        while (approvers[i] != approverAddress) {
            i++;
        }
         while (i<approvers.length-1) {
            approvers[i] = approvers[i+1];
            i++;
        }
        approvers.pop();
    }

    function updateQuorum(uint256 value) external {
        require(approvers.length>=value,"quorum greater than number of approvers");
        quorum = value;
    }

    function getAllProposals() public view returns(Proposal[] memory) {
        return proposals;
    }

    function getAllApprovers() public view returns (address[] memory ){
        return approvers;
    }
    function approveTransfer(uint256 functionId, uint256 id)
        external
        onlyApprover
    {
        require(proposals[id].sent == false, "transfer has already been sent");
        require(
            approvals[msg.sender][functionId][id] == false,
            "cannot approve transfer twice"
        );

        approvals[msg.sender][functionId][id] = true;
        proposals[id].approvals++;

        if (proposals[id].approvals >= quorum) {
            proposals[id].sent = true;
            if (functionId == 0) {
                if (
                    proposals[id].value != 0 || proposals[id].addr != address(0)
                ) {
                    revert(
                        "This function does not take value or address as input"
                    );
                }
                IBruAdmin(poolAddress).enableBorrow();
            } else if (functionId == 1) {
                if (
                    proposals[id].value != 0 || proposals[id].addr != address(0)
                ) {
                    revert(
                        "This function does not take value or address as input"
                    );
                }
                IBruAdmin(poolAddress).disableBorrow();
            } else if (functionId == 2) {
                if (proposals[id].addr != address(0)) {
                    revert("This function does not take address as input");
                }
                IBruAdmin(poolAddress).changeLockPeriod(proposals[id].value);
            } else if (functionId == 3) {
                if (proposals[id].addr != address(0)) {
                    revert(
                        "This function does not take address as input"
                    );
                }
                IBruAdmin(poolAddress).changeSpread(proposals[id].value);
            } else if (functionId == 4) {
                if (proposals[id].addr != address(0)) {
                    revert(
                        "This function does not take address as input"
                    );
                }
                IBruAdmin(poolAddress).changeStableInterestRate(
                    proposals[id].value
                );
            } else if (functionId == 5) {
                if (proposals[id].addr != address(0)) {
                    revert(
                        "This function does not take address as input"
                    );
                }
                IBruAdmin(poolAddress).changeNonWithdrawFees(
                    proposals[id].value
                );
            } else if (functionId == 6) {
                if (proposals[id].addr != address(0)) {
                    revert(
                        "This function does not take address as input"
                    );
                }
                IBruAdmin(poolAddress).changeBorrowInterestRate(
                    proposals[id].value
                );
            } else if (functionId == 7) {
                if (proposals[id].addr != address(0)) {
                    revert(
                        "This function does not take address as input"
                    );
                }
                IBruAdmin(poolAddress).changeBorrowPlatformFee(
                    proposals[id].value
                );
            } else if (functionId == 8) {
                if (proposals[id].addr != address(0)) {
                    revert(
                        "This function does not take address as input"
                    );
                }
                IBruAdmin(poolAddress).changeLendPlatformFee(
                    proposals[id].value
                );
            } else if (functionId == 9) {
                if (proposals[id].addr != address(0)) {
                    revert(
                        "This function does not take address as input"
                    );
                }
                this.updateQuorum(proposals[id].value);
            } else if (functionId == 10) {
                if (proposals[id].value != 0) {
                    revert("This function does not take value as input");
                }
                IBruAdmin(poolAddress).allowTokenAddress(proposals[id].addr);
            } else if (functionId == 11) {
                if (proposals[id].value != 0) {
                    revert("This function does not take value as input");
                }
                
                this.addApprover(proposals[id].addr);
            } else if (functionId == 12) {
                if (proposals[id].value != 0) {
                    revert("This function does not take value as input");
                }
           
                this.removeApprover(proposals[id].addr);
            }
        }
    }

    modifier onlyApprover() {
        bool allowed = false;
        for (uint256 i = 0; i < approvers.length; i++) {
            if (approvers[i] == msg.sender) {
                allowed = true;
            }
        }
        require(allowed == true, "only approver allowed");
        _;
    }
}
