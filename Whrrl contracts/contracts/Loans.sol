pragma solidity ^0.5.0;
import "./Common.sol";

contract Loans is Commons {
    mapping(bytes32 => BankLoan) public loanDetailsById;
    BankLoan[] public bankLoans;
    Repayment[] public repayments;

    struct BankLoan {
        uint256 timestamp;
        bytes32 bankId;
        uint256 amount;
        uint256 tokens;
        uint256 rateOfInterest;
        uint256 emiAmount;
        uint256 remainingAmount;
        uint256 lienTokens;
        uint256 tenur;
        bool status;
    }

    struct Repayment {
        bytes32 loanId;
        bytes32 bankId;
        uint256 amount;
        uint256 tokens;
        uint256 timestamp;
    }

    //222222222,"0x6162636400000000000000000000000000000000000000000000000000000000","0x6162636500000000000000000000000000000000000000000000000000000000",2000,100,10,0
    function loanDisburs(
        uint256 timestamp,
        bytes32 loanId,
        bytes32 bankId,
        uint256 amount,
        uint256 tokens,
        uint256 rateOfInterest,
        uint256 emiAmount,
        uint256 tenur
    ) public tokenActive returns (bool done) {
        Balance memory _balance = balances[farmerAddress];
        if (
            tokens <= _balance.freeTokens &&
            amount <= (tokens * valuePerToken) &&
            amount > 0 &&
            tokens > 0
        ) {
            // farmer acc update

            balances[farmerAddress] = Balance(
                _balance.freeTokens -= (tokens),
                _balance.lienTokens += (tokens),
                0
            );
            // _balance.freeTokens-=(tokens);
            //   _balance.lienTokens+=(tokens);
            //loan details save
            loanDetailsById[loanId] = BankLoan(
                timestamp,
                bankId,
                amount,
                tokens,
                rateOfInterest,
                emiAmount,
                amount,
                tokens,
                tenur,
                true
            );
            numberOfLoans++;

            // bank acc updte
            balances[msg.sender] = Balance(0, tokens, 2);
            //whr updates
            (grainDetail.lienToken) += (tokens);
            grainDetail.lienStatus = true;
            grainDetail.totalLoanAmount = amount;

            return true;
        } else {
            revert("Invalid loan details.");
        }
    }

    //"2121","0x6162636400000000000000000000000000000000000000000000000000000000","1000","50"
    function repayment(
        uint256 timestamp,
        bytes32 loanId,
        uint256 amount,
        uint256 tokens
    ) public tokenActive returns (bool done) {
        //Credit the token back to user
        BankLoan memory loanDetails = loanDetailsById[loanId];
        if (
            loanDetails.lienTokens >= tokens &&
            loanDetails.remainingAmount >= amount &&
            amount > 0 &&
            tokens > 0
        ) {
            Balance memory _balance = balances[farmerAddress];

            balances[farmerAddress] = Balance(
                _balance.freeTokens += (loanDetails.tokens),
                _balance.lienTokens -= (loanDetails.tokens),
                0
            );
            //Debit the token back to bank
            Balance memory _BankBalance = balances[msg.sender];
            balances[farmerAddress] = Balance(
                _balance.freeTokens,
                _BankBalance.lienTokens -= (loanDetails.tokens),
                1
            );
            //   _BankBalance.lienTokens-=(loanDetails.tokens);

            loanDetailsById[loanId] = BankLoan(
                loanDetails.timestamp,
                loanDetails.bankId,
                amount,
                loanDetails.lienTokens -= (tokens),
                loanDetails.rateOfInterest,
                loanDetails.emiAmount,
                loanDetails.remainingAmount -= (amount),
                loanDetails.tokens,
                loanDetails.tenur,
                true
            );

            //Deactive the loan
            //   loanDetails.remainingAmount-=(amount) ;
            //loanDetails.paidAmount+=(amount);
            //   loanDetails.lienTokens-=(tokens);
            grainDetail.repaymentLoanAmount += (amount);
            repayments.push(
                Repayment(loanId, loanDetails.bankId, amount, tokens, timestamp)
            );
            grainDetail.lienToken -= (tokens);
            if (grainDetail.lienToken == 0) {
                if (loanDetails.lienTokens == 0) {
                    loanDetails.status = false;
                }
                grainDetail.lienStatus = false;
            }
            return true;
        } else {
            revert("Invalid loan details.");
        }
    }
}
