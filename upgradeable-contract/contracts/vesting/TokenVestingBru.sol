// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
//import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./Token.sol";


/**
 * @title TokenVesting
 */
contract TokenVestingBru is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    // using SafeERC20 for IERC20;

    struct VestingSchedule {
        bool initialized;
        // beneficiary of tokens after they are released
        address beneficiary;
        // cliff period in seconds
        uint256 cliff;
        // start time of the vesting period
        uint256 start;
        // duration of the vesting period in seconds
        uint256 duration;
        // duration of a slice period for the vesting in seconds
        uint256 slicePeriodSeconds;
        // whether or not the vesting is revocable
        bool revocable;
        // total amount of tokens to be released at the end of the vesting
        uint256 amountTotal;
        // amount of tokens released
        uint256 released;
        // whether or not the vesting has been revoked
        bool revoked;
    }

    struct tokenDistribution {
        uint256 tokenAmountleft;
        uint256 tokenPercentage;
    }
    struct categories {
        uint256 categoryId;
        string categoryName;
        address[] memberAddresses;
        uint256 cliff;
        // start time of the vesting period
        // uint256 start;
        // duration of the vesting period in seconds
        uint256 duration;
        // duration of a slice period for the vesting in seconds
        uint256 slicePeriodSeconds;
        // whether or not the vesting is revocable
        bool revocable;
        // total amount of tokens to be released at the end of the vesting
        // amount of tokens released
        // uint256 released;
        // // whether or not the vesting has been revoked
        // bool revoked;
    }

    // address of the ERC20 token
    // IERC20 private immutable __token;
    Token _token;

    uint256 totalPercentageUsed;
    bytes32[] private vestingSchedulesIds;
    mapping(bytes32 => VestingSchedule) private vestingSchedules;
    uint256 private vestingSchedulesTotalAmount;
    mapping(address => uint256) private holdersVestingCount;
    mapping(string => uint256) public categoryIdMapping;
    categories[] public categoryMapping;
    mapping(uint256 => tokenDistribution) public distributionMapping;
    mapping(uint256 => bool) public existsMapping;
    uint256 categoryId;
    event Released(uint256 amount);
    event Revoked();

    /**
     * @dev Reverts if no vesting schedule matches the passed identifier.
     */
    modifier onlyIfVestingScheduleExists(bytes32 vestingScheduleId) {
        require(vestingSchedules[vestingScheduleId].initialized == true);
        _;
    }

    /**
     * @dev Reverts if the vesting schedule does not exist or has been revoked.
     */
    modifier onlyIfVestingScheduleNotRevoked(bytes32 vestingScheduleId) {
        require(vestingSchedules[vestingScheduleId].initialized == true);
        require(vestingSchedules[vestingScheduleId].revoked == false);
        _;
    }

    /**
     * @dev Creates a vesting contract.
     * @param token_ address of the ERC20 token contract
     */
    constructor(address token_) {
        require(token_ != address(0x0));
        _token = Token(token_);
        //__token = IERC20(token_);
    }

    receive() external payable {}

    fallback() external payable {}

    /**
     * @dev Returns the number of vesting schedules associated to a beneficiary.
     * @return the number of vesting schedules
     */
    function getVestingSchedulesCountByBeneficiary(address _beneficiary)
        external
        view
        returns (uint256)
    {
        return holdersVestingCount[_beneficiary];
    }

    /**
     * @dev Returns the vesting schedule id at the given index.
     * @return the vesting id
     */
    function getVestingIdAtIndex(uint256 index)
        external
        view
        returns (bytes32)
    {
        require(
            index < getVestingSchedulesCount(),
            "TokenVesting: index out of bounds"
        );
        return vestingSchedulesIds[index];
    }

    /**
     * @notice Returns the vesting schedule information for a given holder and index.
     * @return the vesting schedule structure information
     */
    function getVestingScheduleByAddressAndIndex(address holder, uint256 index)
        external
        view
        returns (VestingSchedule memory)
    {
        return
            getVestingSchedule(
                computeVestingScheduleIdForAddressAndIndex(holder, index)
            );
    }

    function getVestingSchedulesTotalAmount() external view returns (uint256) {
        return vestingSchedulesTotalAmount;
    }

    function getToken() external view returns (address) {
        return address(_token);
    }

    function setCategoryParams(
        uint256 CategoryId,
        string memory categoryName,
        address[] memory memberAddresses,
        uint256 cliff,
        // uint256 start,
        uint256 duration,
        uint256 slicePeriodSeconds,
        bool revocable // uint256 released, // bool revoked
    ) public {
        require(!existsMapping[CategoryId], "Category already in use");
        categoryMapping.push(
            categories(
                CategoryId,
                categoryName,
                memberAddresses,
                cliff,
                duration,
                slicePeriodSeconds,
                revocable
            )
        );
        categoryIdMapping[categoryName] = categoryId;
        existsMapping[CategoryId] = true;
        categoryId++;
    }

    function addAddressToCategory(address walletAddress, uint256 _categoryId)
        public
    {
        categoryMapping[_categoryId].memberAddresses.push(walletAddress);
    }

    /**
     * @notice Returns the total amount of vesting schedules.
     * @return the total amount of vesting schedules
     */

    /**
     * @dev Returns the address of the ERC20 token managed by the vesting contract.
     */
    //* @param _duration duration in seconds of the period in which the tokens will vest
    //  * @param _slicePeriodSeconds duration of a slice period for the vesting in seconds
    //      * @param _revocable whether the vesting is revocable or not
    /**
     * @notice Creates a new vesting schedule for a beneficiary.
     * @param _beneficiary address of the beneficiary to whom vested tokens are transferred
     * @param _start start time of the vesting 
     * @param _amount total amount of tokens to be released at the end of the vesting
     */
    function createVestingScheduleForCategory(
        uint256 _amount,
        uint256 _start,
        address _beneficiary
    ) public onlyOwner {
       
        bytes32 vestingScheduleId = this.computeNextVestingScheduleIdForHolder(
            _beneficiary
        );
       
        for (uint256 i = 0; i < categoryMapping.length; i++) {
    
            for (
                uint256 j = 0;
                j < categoryMapping[i].memberAddresses.length;
                j++
            ) {
                if (_beneficiary == categoryMapping[i].memberAddresses[j]) {
                   
                    require(
                        this.getWithdrawableAmount() >= _amount,
                        "TokenVesting: cannot create vesting schedule because not sufficient tokens"
                    );
                    require(
                        categoryMapping[i].duration > 0,
                        "TokenVesting: duration must be > 0"
                    );
                    require(_amount > 0, "TokenVesting: amount must be > 0");
                    require(
                        categoryMapping[i].slicePeriodSeconds >= 1,
                        "TokenVesting: slicePeriodSeconds must be >= 1"
                    );
                    require(
                        distributionMapping[categoryMapping[i].categoryId]
                            .tokenAmountleft >= _amount,
                        "vesting amount is completed for this category"
                    );
                  
                    uint256 cliff = _start.add( categoryMapping[i].cliff);
                    
                    vestingSchedules[vestingScheduleId] = VestingSchedule(
                        true,
                        categoryMapping[i].memberAddresses[j],
                        cliff,
                        _start,
                        categoryMapping[i].duration,
                        categoryMapping[i].slicePeriodSeconds,
                        categoryMapping[i].revocable,
                        _amount,
                        0,
                        false
                    );
                    
                     distributionMapping[categoryMapping[i].categoryId].tokenAmountleft -= _amount;
                   
                }
            }
        }

        vestingSchedulesTotalAmount = vestingSchedulesTotalAmount.add(_amount);
        vestingSchedulesIds.push(vestingScheduleId);
        uint256 currentVestingCount = holdersVestingCount[_beneficiary];
        holdersVestingCount[_beneficiary] = currentVestingCount.add(1);
    }

    /**
     * @notice Creates a new vesting schedule for a beneficiary.
     * @param _beneficiary address of the beneficiary to whom vested tokens are transferred
     * @param _start start time of the vesting period
     * @param _cliff duration in seconds of the cliff in which tokens will begin to vest
     * @param _duration duration in seconds of the period in which the tokens will vest
     * @param _slicePeriodSeconds duration of a slice period for the vesting in seconds
     * @param _revocable whether the vesting is revocable or not
     * @param _amount total amount of tokens to be released at the end of the vesting
     */
    function createVestingSchedule(
        address _beneficiary,
        uint256 _start,
        uint256 _cliff,
        uint256 _duration,
        uint256 _slicePeriodSeconds,
        bool _revocable,
        uint256 _amount
    ) public onlyOwner {
        require(
            this.getWithdrawableAmount() >= _amount,
            "TokenVesting: cannot create vesting schedule because not sufficient tokens"
        );
        require(_duration > 0, "TokenVesting: duration must be > 0");
        require(_amount > 0, "TokenVesting: amount must be > 0");
        require(
            _slicePeriodSeconds >= 1,
            "TokenVesting: slicePeriodSeconds must be >= 1"
        );
        bytes32 vestingScheduleId = this.computeNextVestingScheduleIdForHolder(
            _beneficiary
        );
        uint256 cliff = _start.add(_cliff);
        vestingSchedules[vestingScheduleId] = VestingSchedule(
            true,
            _beneficiary,
            cliff,
            _start,
            _duration,
            _slicePeriodSeconds,
            _revocable,
            _amount,
            0,
            false
        );
        vestingSchedulesTotalAmount = vestingSchedulesTotalAmount.add(_amount);
        vestingSchedulesIds.push(vestingScheduleId);
        uint256 currentVestingCount = holdersVestingCount[_beneficiary];
        holdersVestingCount[_beneficiary] = currentVestingCount.add(1);
    }

    /**
     * @notice Revokes the vesting schedule for given identifier.
     * @param vestingScheduleId the vesting schedule identifier
     */
    function revoke(bytes32 vestingScheduleId)
        public
        onlyOwner
        onlyIfVestingScheduleNotRevoked(vestingScheduleId)
    {
        VestingSchedule storage vestingSchedule = vestingSchedules[
            vestingScheduleId
        ];
        require(
            vestingSchedule.revocable == true,
            "TokenVesting: vesting is not revocable"
        );
        uint256 vestedAmount = _computeReleasableAmount(vestingSchedule);
        if (vestedAmount > 0) {
            release(vestingScheduleId, vestedAmount);
        }
        uint256 unreleased = vestingSchedule.amountTotal.sub(
            vestingSchedule.released
        );
        vestingSchedulesTotalAmount = vestingSchedulesTotalAmount.sub(
            unreleased
        );
        vestingSchedule.revoked = true;
       
    }

    /**
     * @notice Withdraw the specified amount if possible.
     * @param amount the amount to withdraw
     */
    function withdraw(uint256 amount) public nonReentrant onlyOwner {
        require(
            this.getWithdrawableAmount() >= amount,
            "TokenVesting: not enough withdrawable funds"
        );
        bool result = _token.transfer(owner(), amount);
        require(result, "transfer failed while withdrawing");
    }

    /**
     * @notice Release vested amount of tokens.
     * @param vestingScheduleId the vesting schedule identifier
     * @param amount the amount to release
     */
    function release(bytes32 vestingScheduleId, uint256 amount)
        public
        nonReentrant
        onlyIfVestingScheduleNotRevoked(vestingScheduleId)
    {
        VestingSchedule storage vestingSchedule = vestingSchedules[
            vestingScheduleId
        ];
        bool isBeneficiary = msg.sender == vestingSchedule.beneficiary;
        bool isOwner = msg.sender == owner();
        require(
            isBeneficiary || isOwner,
            "TokenVesting: only beneficiary and owner can release vested tokens"
        );
        uint256 vestedAmount = _computeReleasableAmount(vestingSchedule);
        require(
            vestedAmount >= amount,
            "TokenVesting: cannot release tokens, not enough vested tokens"
        );
        vestingSchedule.released = vestingSchedule.released.add(amount);
        address payable beneficiaryPayable = payable(
            vestingSchedule.beneficiary
        );
        vestingSchedulesTotalAmount = vestingSchedulesTotalAmount.sub(amount);
        bool result = _token.transfer(beneficiaryPayable, amount);
        require(result, "transfer failed while withdrawing");
    }

    function addtokenDistribution(uint256 _categoryId, uint256 _tokenPercentage)
        public
    {
  
        require(
            totalPercentageUsed + _tokenPercentage <= 100,
            "100% tokens distributed"
        );
        uint256 initialSupply = _token.getInitialSupply();
       
        distributionMapping[_categoryId].tokenAmountleft = _token
            .getInitialSupply()
            .div(100)
            .mul(_tokenPercentage);
       
        totalPercentageUsed += _tokenPercentage;
    }

    /**
     * @dev Returns the number of vesting schedules managed by this contract.
     * @return the number of vesting schedules
     */
    function getVestingSchedulesCount() public view returns (uint256) {
        return vestingSchedulesIds.length;
    }

    /**
     * @notice Computes the vested amount of tokens for the given vesting schedule identifier.
     * @return the vested amount
     */
    function computeReleasableAmount(bytes32 vestingScheduleId)
        public
        view
        onlyIfVestingScheduleNotRevoked(vestingScheduleId)
        returns (uint256)
    {
        VestingSchedule storage vestingSchedule = vestingSchedules[
            vestingScheduleId
        ];
        return _computeReleasableAmount(vestingSchedule);
    }

    /**
     * @notice Returns the vesting schedule information for a given identifier.
     * @return the vesting schedule structure information
     */
    function getVestingSchedule(bytes32 vestingScheduleId)
        public
        view
        returns (VestingSchedule memory)
    {
        return vestingSchedules[vestingScheduleId];
    }

    /**
     * @dev Returns the amount of tokens that can be withdrawn by the owner.
     * @return the amount of tokens
     */
    function getWithdrawableAmount() public view returns (uint256) {
        return _token.balanceOf(address(this)).sub(vestingSchedulesTotalAmount);
    }

    /**
     * @dev Computes the next vesting schedule identifier for a given holder address.
     */
    function computeNextVestingScheduleIdForHolder(address holder)
        public
        view
        returns (bytes32)
    {
        return
            computeVestingScheduleIdForAddressAndIndex(
                holder,
                holdersVestingCount[holder]
            );
    }

    /**
     * @dev Returns the last vesting schedule for a given holder address.
     */
    function getLastVestingScheduleForHolder(address holder)
        public
        view
        returns (VestingSchedule memory)
    {
        return
            vestingSchedules[
                computeVestingScheduleIdForAddressAndIndex(
                    holder,
                    holdersVestingCount[holder] - 1
                )
            ];
    }

    /**
     * @dev Computes the vesting schedule identifier for an address and an index.
     */
    function computeVestingScheduleIdForAddressAndIndex(
        address holder,
        uint256 index
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(holder, index));
    }

    /**
     * @dev Computes the releasable amount of tokens for a vesting schedule.
     * @return the amount of releasable tokens
     */
    function _computeReleasableAmount(VestingSchedule memory vestingSchedule)
        internal
        view
        returns (uint256)
    {
        uint256 currentTime = getCurrentTime();
        if (
            (currentTime < vestingSchedule.cliff) ||
            vestingSchedule.revoked == true
        ) {
            return 0;
        } else if (
            currentTime >= vestingSchedule.start.add(vestingSchedule.duration)
        ) {
            return vestingSchedule.amountTotal.sub(vestingSchedule.released);
        } else {
            uint256 timeFromStart = currentTime.sub(vestingSchedule.start);
            uint256 secondsPerSlice = vestingSchedule.slicePeriodSeconds;
            uint256 vestedSlicePeriods = timeFromStart.div(secondsPerSlice);
            uint256 vestedSeconds = vestedSlicePeriods.mul(secondsPerSlice);
            uint256 vestedAmount = vestingSchedule
                .amountTotal
                .mul(vestedSeconds)
                .div(vestingSchedule.duration);
            vestedAmount = vestedAmount.sub(vestingSchedule.released);
            return vestedAmount;
        }
    }

    function getCurrentTime() internal view virtual returns (uint256) {
        return block.timestamp;
    }
}
