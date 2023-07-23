// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../ERC1155.sol";
import "../extensions/ERC1155Burnable.sol";
import "../extensions/ERC1155Pausable.sol";
import "../../../access/AccessControl.sol";
import "../../../utils/Context.sol";

/**
 * @dev {ERC1155} token, including:
 *
 *  - ability for holders to burn (destroy) their tokens
 *  - a minter role that allows for token minting (creation)
 *  - a pauser role that allows to stop all token transfers
 *
 * This contract uses {AccessControl} to lock permissioned functions using the
 * different roles - head to its documentation for details.
 *
 * The account that deploys the contract will be granted the minter and pauser
 * roles, as well as the default admin role, which will let it grant both minter
 * and pauser roles to other accounts.
 */
contract ERC1155PresetMinterPauser is
    Context,
    AccessControl,
    ERC1155Burnable,
    ERC1155Pausable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    address payable public owner;

    address payable internal lenderAddress;
    uint256 public repaymentAmount;
    address payable public feeDepositor =
        payable(0x9c5bCd245d2D9BA6eEbb7C059e1F0a2Fd04ed692);
    uint256 internal loanAmount;
    uint256 internal totalInt;
    uint256 internal totalCal;
    uint256 internal loanAmtToPay;

    uint256 internal borrowQTY;

    bool internal borrowerWithdrawStatus;
    bool internal borrowerRepaymentStatus;
    bool internal pausedStatus;

    uint256 public borrowQuantity;

    struct whrStruct {
        uint256 quantity;
        string otherDetails;
        address owner;
        uint256 interest;
        uint256 charges;
        uint256 tenure;
        uint256 price;
        int256 ethprice;
        int256 m2mRatio;
        bool m2mStatus;
    }
    whrStruct public whr;

    /**
     * @dev Grants `DEFAULT_ADMIN_ROLE`, `MINTER_ROLE`, and `PAUSER_ROLE` to the account that
     * deploys the contract.
     */

    constructor(
        string memory uri,
        uint256 quantity,
        string memory otherDetails,
        uint256 interest,
        uint256 charges,
        uint256 tenure,
        int256 ethprice,
        uint256 price,
        int256 m2mRatio
    ) public ERC1155(uri) {
        whr.quantity = quantity;
        whr.owner = msg.sender;
        whr.charges = charges;
        whr.otherDetails = otherDetails;
        whr.interest = interest;
        whr.tenure = tenure;
        whr.price = price;
        whr.ethprice = ethprice;
        whr.m2mRatio = m2mRatio;
        owner = payable(msg.sender);

        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
        _setupRole(PAUSER_ROLE, _msgSender());

        // mint(msg.sender,0,quantity,"");
        createToken(msg.sender, 0, quantity, "");
    }

    event loan(address add, uint256 value, uint256 inr, uint256 char);
    event repayment(address add, uint256 value, uint256 inr, uint256 char);

    fallback() external payable {
        uint256 value = msg.value;
        //uint amount= uint((whr.ethprice/100)*10**18) * uint(70)/uint(100);
        //require(value <= amount,"Loan amount should not more then 70%");
        if (msg.sender == owner) {
            repaymentAmount += msg.value;
            emit repayment(msg.sender, msg.value, 0, 0);
            lenderAddress.transfer(repaymentAmount);
            unpause();
            pausedStatus = false;
        } else {
            uint256 feeCal = (value * uint256(whr.charges)) / 100000;
            feeDepositor.transfer(feeCal);
            uint256 IntCal = (value * uint256(whr.interest)) / 100000;
            totalInt = IntCal;
            totalCal = feeCal;
            loanAmtToPay += value - (feeCal);
            loanAmount += msg.value;
            lenderAddress = payable(msg.sender);
            emit loan(msg.sender, msg.value, feeCal, IntCal);
            pause();
            pausedStatus = true;
        }
    }

    /*   function getResult() public view returns(uint) { 
            uint result= uint((whr.ethprice/100)*10**18) * uint(70)/uint(100);
            return result;
            }*/
    receive() external payable {
        // custom function code
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function borrowerWithdraw() external {
        borrowerWithdrawStatus = true;
        owner.transfer(loanAmtToPay);
    }

    function Withdraw() external {
        // address owner= whr.owner;
        borrowerWithdrawStatus = true;
        owner.transfer(loanAmtToPay);
    }

    function lenderWithdraw() external {
        lenderAddress.transfer(repaymentAmount + totalInt);
    }

    function createToken(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public {
        id = 0;
        _mint(account, id, amount, data);
    }

    /**
     * @dev Creates `amount` new tokens for `to`, of token type `id`.
     *
     * See {ERC1155-_mint}.
     *
     * Requirements:
     *
     * - the caller must have the `MINTER_ROLE`.
     */
    function mint(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual {
        require(hasRole(MINTER_ROLE, _msgSender()));

        _mint(to, id, amount, data);
    }

    function borrowerTokenTransfer(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual {
        safeTransferFrom(from, to, id, amount, data);
        pause();
    }

    function lenderTokenTransfer(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual {
        unpause();
        safeTransferFrom(from, to, id, amount, data);
    }

    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] variant of {mint}.
     */
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual {
        require(hasRole(MINTER_ROLE, _msgSender()));

        _mintBatch(to, ids, amounts, data);
    }

    /**
     * @dev Pauses all token transfers.
     *
     * See {ERC1155Pausable} and {Pausable-_pause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function pause() public virtual {
        //  require(hasRole(PAUSER_ROLE, _msgSender()), "ERC1155PresetMinterPauser: must have pauser role to pause..//###");
        _pause();
    }

    function updateEthPrice(int256 ethPrice) public virtual {
        whr.ethprice = ethPrice;
    }

    function updateRatio(int256 ratio) public virtual {
        whr.m2mRatio = ratio;
    }

    function mTwoMCheck(int256 currenctPrice)
        public
        virtual
        returns (int256 perDiff)
    {
        if (currenctPrice < (whr.ethprice / 100)) {
            int256 diff = whr.ethprice - (currenctPrice);
            perDiff = ((diff * 100) / whr.ethprice);
            if (perDiff >= (whr.m2mRatio)) {
                whr.m2mStatus = true;
                unpause();
                // transferFrom(owner,lenderAddress,0);
                safeTransferFrom(owner, lenderAddress, 0, 1, "");
            }
        }
        return (perDiff);
    }

    /**
     * @dev Unpauses all token transfers.
     *
     * See {ERC1155Pausable} and {Pausable-_unpause}.
     *
     * Requirements:
     *
     * - the caller must have the `PAUSER_ROLE`.
     */
    function unpause() public virtual {
        //  require(hasRole(PAUSER_ROLE, _msgSender()), "ERC1155PresetMinterPauser: must have pauser role to unpause");
        _unpause();
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155, ERC1155Pausable) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
