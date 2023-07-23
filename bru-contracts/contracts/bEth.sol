// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./token/ERC1155/presets/ERC1155PresetMinterPauser.sol";
import "./ILendingPool.sol";

contract bEth is ERC1155PresetMinterPauser, ILendingPool {
    //mapping addresses to balances
    mapping(address => uint256) private _balances;

    string private ftkn;

    //bToken btkn;

    mapping(address => mapping(address => uint256)) private _allowances;

    //total supply of tokens in circulation
    uint256 private _totalSupply;

    string private _name;
    string private _symbol;
    uint256 private _tokenEthunit;
    uint256 blockdifference;
    uint256 lastdepositid;
    uint256 lastborrowid;

    // table structure for each depositor
    struct Deposits {
        uint256 _depositid;
        uint256 _ethdeposited;
        uint256 _depositblocknumber;
        bool _withdrawalstatus;
        address _depositoraddress;
    }

    mapping(uint256 => Deposits) private _deposits;
    uint256[] public _depositsHistory;

    // table structure for each borrow made
    struct Borrows {
        uint256 _borrowid;
        uint256 _ethborrowed;
        uint256 _borrowblocknumber;
        bool _repaymentstattus;
        address _borroweraddress;
        string _nftid;
    }

    mapping(uint256 => Borrows) private _borrows;
    uint256[] public _borrowsHistory;

    constructor(uint256 tokenEthunit_)
        public
        ERC1155PresetMinterPauser(
            "www.whrrl.in",
            1000000000,
            "XYZ",
            10,
            200,
            5,
            10,
            10000,
            5
        )
    {
        _tokenEthunit = tokenEthunit_;
    }

    function deposit() public payable override {
        lastdepositid += 1;
        Deposits storage dep = _deposits[lastdepositid];
        dep._depositid += lastdepositid;
        dep._ethdeposited = msg.value;
        dep._depositblocknumber = block.number;
        dep._withdrawalstatus = false;
        dep._depositoraddress = msg.sender;

        uint256 value = msg.value * _tokenEthunit;

        mint(_msgSender(), 0, value, " ");

        _depositsHistory.push(lastdepositid);
    }

    // // returns all deposit id
    // function getDeposits() internal view returns (uint256[] memory) {
    //     return _depositsHistory;
    // }

    // get a particular deposit by its id
    function getDeposit(uint256 id)
        internal
        view
        returns (
            uint256,
            uint256,
            uint256,
            bool,
            address
        )
    {
        return (
            _deposits[id]._depositid,
            _deposits[id]._ethdeposited,
            _deposits[id]._depositblocknumber,
            _deposits[id]._withdrawalstatus,
            _deposits[id]._depositoraddress
        );
    }

    // borrow an amount from pool and keep a borrow track
    function borrow(uint256 amount, string memory nftid) public override {
        lastborrowid += 1;
        Borrows storage borr = _borrows[lastborrowid];
        borr._borrowid += lastborrowid;
        borr._ethborrowed = amount;
        borr._borrowblocknumber = block.number;
        borr._repaymentstattus = false;
        borr._borroweraddress = msg.sender;
        borr._nftid = nftid;

        msg.sender.call{value: amount}("");
        _borrowsHistory.push(lastborrowid);
    }

    // // returns all borrows id
    // function getBorrows() internal view returns (uint256[] memory) {
    //     return _borrowsHistory;
    // }

    // get a particular borrow by its id
    function getBorrow(uint256 id)
        internal
        view
        returns (
            uint256,
            uint256,
            uint256,
            bool,
            address,
            string memory
        )
    {
        return (
            _borrows[id]._borrowid,
            _borrows[id]._ethborrowed,
            _borrows[id]._borrowblocknumber,
            _borrows[id]._repaymentstattus,
            _borrows[id]._borroweraddress,
            _borrows[id]._nftid
        );
    }

    function calculatedepositorInterest(
        uint256 depositblocknumber,
        uint256 amount
    ) internal view virtual returns (uint256) {
        uint256 blockDifference;

        blockDifference = block.number - depositblocknumber;

        return (amount * 5 * blockdifference) / (100 * 2102400);
    }

    //calculate borrower interest via amount borrowed
    function calculateAmountPayable(uint256 amount)
        internal
        pure
        virtual
        returns (uint256)
    {
        uint256 interestamount;
        interestamount = ((amount * 10) / 100);
        return amount + interestamount;
    }

    // make repayment for a particular borrow id
    function repay(uint256 borrowid) public payable {
        Borrows storage borr = _borrows[borrowid];
        uint256 amountpayable = calculateAmountPayable(borr._ethborrowed);
        require(amountpayable > borr._ethborrowed);
        borr._repaymentstattus = true;
    }

    function withdraw(
        uint256 depositid,
        address account,
        uint256 amountwithdrawable
    ) public payable {
        require(
            amountwithdrawable >= address(this).balance &&
                _balances[account] > _totalSupply
        );

        msg.sender.call{value: amountwithdrawable}("");
        // msg.sender.call.value(amountwithdrawable)("");
        _burn(msg.sender, amountwithdrawable * _tokenEthunit);
        Deposits storage dep = _deposits[depositid];
        dep._withdrawalstatus = true;
    }

    function tokenEthunit() internal view virtual returns (uint256) {
        return _tokenEthunit;
    }

    function balanceOf(address account) public view virtual returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount)
        public
        virtual
        returns (bool)
    {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender)
        public
        view
        virtual
        returns (uint256)
    {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount)
        public
        virtual
        returns (bool)
    {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual returns (bool) {
        _transfer(sender, recipient, amount);

        uint256 currentAllowance = _allowances[sender][_msgSender()];
        require(currentAllowance >= amount);
        {
            _approve(sender, _msgSender(), currentAllowance - amount);
        }

        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue)
        public
        virtual
        returns (bool)
    {
        _approve(
            _msgSender(),
            spender,
            _allowances[_msgSender()][spender] + addedValue
        );
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue)
        public
        virtual
        returns (bool)
    {
        uint256 currentAllowance = _allowances[_msgSender()][spender];
        require(currentAllowance >= subtractedValue);
        {
            _approve(_msgSender(), spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) internal virtual {
        require(sender != address(0) && recipient != address(0));

        _beforeTokenTransfer(sender, recipient, amount);

        uint256 senderBalance = _balances[sender];
        require(senderBalance >= amount);
        {
            _balances[sender] = senderBalance - amount;
        }
        _balances[recipient] += amount;

        emit TransferSingle(_msgSender(), sender, recipient, 0, amount);

        _afterTokenTransfer(sender, recipient, amount);
    }

    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0));

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount);
        {
            _balances[account] = accountBalance - amount;
        }
        _totalSupply -= amount;

        // emit Transfer(account, address(0), amount);
        emit TransferSingle(_msgSender(), account, address(0), 0, amount);

        _afterTokenTransfer(account, address(0), amount);
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0) && spender != address(0));

        _allowances[owner][spender] = amount;
        // emit Approval(owner, spender, amount);
        emit ApprovalForAll(owner, spender, true);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}
}
