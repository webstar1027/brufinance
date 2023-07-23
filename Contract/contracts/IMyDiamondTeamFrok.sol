// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

contract IMyDiamondTeamFrok {
    using SafeMath for uint256;
    using SafeMath for uint8;
     struct User {
        address upline;
        uint256 referrals;
        uint256 payouts;
        uint256 direct_bonus;
        uint256 pool_bonus;
        uint256 match_bonus;
        uint256 deposit_amount;
        uint256 deposit_payouts;
        uint256 total_direct_deposits;
        uint256 total_payouts;
        uint256 total_structure;
        uint256 total_downline_deposit;
        uint256 checkpoint;
    }

    struct Airdrop {
        uint256 airdrops;
        uint256 airdrops_sent;
        uint256 airdrops_sent_count;
        uint256 airdrops_received;
        uint256 airdrops_received_count;
        uint256 last_airdrop;
        uint256 last_airdrop_received;
        uint256 airdrop_bonus;
    }

    struct Team {
        address[] members; // owner is also in member-array!
        address owner; // owner is able to add users
        uint256 id;
        uint256 created_at;
        string name;
        bool is_referral_team; // first team of upline-user is the referral team. all ref users are added automatically
    }

    struct TeamInfo {
        uint256 id;
        bool exists;
    }

    struct UserBonusStats {
        uint256 direct_bonus_withdrawn;
        uint256 match_bonus_withdrawn;
        uint256 pool_bonus_withdrawn;
        uint256 airdrops_withdrawn;
        uint256 income_reinvested;
        uint256 bonus_reinvested;
        uint256 airdrops_reinvested;
        uint256 reinvested_gross;
    }
		
	mapping(address => address) public uplinesOld;
		
    
    mapping(address => UserBonusStats) public userBonusStats;
    mapping(address => string) nicknames;
    mapping(address => User) public users;
    mapping(uint256 => address) public id2Address;
    mapping(address => Airdrop) public airdrops;
    mapping(uint256 => Team) public teams;
    mapping(address => uint8) public user_teams_counter; // holds the number of teams of a user
    mapping(address => TeamInfo[]) public user_teams;
    mapping(address => TeamInfo) public user_referral_team;

    address payable public owner;
    address payable public project;
    address payable public community;

    uint256 public REFERRAL;
    uint256 public PROJECT;
	uint256 public COMMUNITY;
    uint256 public AIRDROP; // 0% Tax on airdrop
    uint256 public REINVEST_BONUS;
    uint256 public MAX_PAYOUT;
    uint256 public BASE_PERCENT;
    uint256 public TIME_STEP;
    uint8 public MAX_TEAMS_PER_ADDRESS;
    uint8 public MAX_LENGTH_NICKNAME;
    uint256 constant public PERCENTS_DIVIDER = 1000;

    uint8[] public ref_bonuses;
    uint8[] public pool_bonuses;
    uint256 public pool_last_draw;
    uint256 public pool_cycle;
    uint256 public pool_balance;
    uint256 constant public ref_depth = 3;

    mapping(uint256 => mapping(address => uint256)) public pool_users_refs_deposits_sum;
    mapping(uint8 => address) public pool_top;

    uint256 public total_users;
    uint256 public total_deposited;
    uint256 public total_withdraw;
    uint256 public total_reinvested;
    uint256 public total_airdrops;
    uint256 public total_teams_created;

    bool public started;
    bool public initialized;
    bool public airdrop_enabled;
    uint256 public MIN_INVEST; //0.1 BNB
    uint256 public AIRDROP_MIN; //0.1 BNB
    uint256 public MAX_WALLET_DEPOSIT; //25 BNB
    uint256 public MAX_POOL_BALANCE; //25 BNB

    bool public KEEP_TAXES_IN_CONTRACT;

    mapping(address => uint256) public usersRealDepositsBeforeMigration;
    uint256 public MAX_REINVEST_MULTIPLIER; // set this to 5 after execution of UpgradeUsersForSustainabilityUpgrade
    uint256 public MAX_PAYOUT_CAP; // no wallet can withdraw more than this
	
	mapping(address => uint8) public user_reinvest_count; // holds the user's reinvest count.
	uint256 public ACTION_COOLDOWN; //WITHDRAW_COOLDOWN = 24 * 60 * 60;
    uint8 public MANDATORY_REINVEST_COUNT; //3 MANDATORY REINVEST
	bool public MANDATORY_REINVEST_ENABLED; // enable/disable the new feature global

    event Upline(address indexed addr, address indexed upline);
    event NewDeposit(address indexed addr, uint256 amount);
    event DirectPayout(address indexed addr, address indexed from, uint256 amount);
    event MatchPayout(address indexed addr, address indexed from, uint256 amount);
    event PoolPayout(address indexed addr, uint256 amount);
    event Withdraw(address indexed addr, uint256 amount);
    event LimitReached(address indexed addr, uint256 amount);
	event ReinvestedDeposit(address indexed user, uint256 amount);
    event NewAirdrop(address indexed from, address indexed to, uint256 amount, uint256 timestamp);
 
    
    function checkUplineValid(address _addr, address _upline) external view returns (bool isValid) {
        if (uplinesOld[_addr] == _upline && users[_addr].checkpoint == 0) {
            isValid = true;
        }		
        if(users[_addr].upline == address(0) && _upline != _addr && _addr != project && (users[_upline].checkpoint > 0 || _upline == project)) {
            isValid = true;        
        }
    }

    function _createTeam(address userAddress, bool is_referral_team) private returns(uint256 teamId){
        uint8 numberOfExistingTeams = user_teams_counter[userAddress];

        require(numberOfExistingTeams <= MAX_TEAMS_PER_ADDRESS, "Max number of teams reached.");

        teamId = total_teams_created++;
        teams[teamId].id = teamId;
        teams[teamId].created_at = block.timestamp;
        teams[teamId].owner = userAddress;
        teams[teamId].members.push(userAddress);
        teams[teamId].is_referral_team = is_referral_team;

        user_teams[userAddress].push(TeamInfo(teamId, true));

        user_teams_counter[userAddress]++;
    }

    function _addTeamMember(uint256 teamId, address member) private {
        // on private call, there is no limit on memers. if someone has many referras, the referral team can get huge
        // also no check if member is invested since the addTeamMember is used in setUpline before the investment
        Team storage team = teams[teamId];

        team.members.push(member);
        user_teams[member].push(TeamInfo(teamId, true));
        user_teams_counter[member]++;
    }

    function _setUpline(address _addr, address _upline) public {
        if(this.checkUplineValid(_addr, _upline)) {
            users[_addr].upline = _upline;
            users[_upline].referrals++;

            if(user_referral_team[_upline].exists == false){
                uint256 teamId = _createTeam(_upline, true); // create first team on upline-user. this contains the direct referrals
                user_referral_team[_upline].id = teamId;
                user_referral_team[_upline].exists = true;
            }

            // check if current user is in ref-team
            bool memberExists = false;
            for(uint256 i = 0; i < teams[user_referral_team[_upline].id].members.length; i++){
                if(teams[user_referral_team[_upline].id].members[i] == _addr){
                    memberExists = true;
                }
            }
            if(memberExists == false){
                _addTeamMember(user_referral_team[_upline].id, _addr); // add referral user to upline users referral-team
            }

            emit Upline(_addr, _upline);

            for(uint8 i = 0; i < ref_bonuses.length; i++) {
                if(_upline == address(0)) break;

                users[_upline].total_structure++;

                _upline = users[_upline].upline;
            }
        }
    }


    function _checkNickname(string memory name) public view returns (bool){
        name = _toLower(name);
        if(checkAlphaNumericStr(name) == false){
            return false; // illegal characters
        }
        if(bytes(name).length > MAX_LENGTH_NICKNAME){
            return false; // too long str
        }
        for( uint256 i = 0; i < total_users; i++){
            string memory nick = nicknames[id2Address[i]];
            if( strcmp(nick, name)){
                return false;
            }
        }
        return true;
    }

    function getAddressToNickname(string memory name) public view returns (address){
        for( uint256 i = 0; i < total_users; i++){
            string memory nick = nicknames[id2Address[i]];
            if( strcmp(nick, name)){
                return id2Address[i];
            }
        }

        return address(0);
    }

    function getNicknameToAddress(address _addr) public view returns (string memory nick){
        return nicknames[_addr];
    }

    function _toLower(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint i = 0; i < bStr.length; i++) {
            // Uppercase character...
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                // So we add 32 to make it lowercase
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }

    
    function checkAlphaNumericStr(string memory str) public pure returns (bool){
        bytes memory b = bytes(str);

        for(uint i; i<b.length; i++){
            bytes1 char = b[i];

            if(
                !(char >= 0x30 && char <= 0x39) && //9-0
                !(char >= 0x41 && char <= 0x5A) && //A-Z
                !(char >= 0x61 && char <= 0x7A) //a-z
            ){
                return false;
            }
        }

        return true;
    }
   

    function checkNickname(string memory name) external view returns (bool){
        return _checkNickname(name);
    }


    // string helper function --- START
    //
    function memcmp(bytes memory a, bytes memory b) internal pure returns(bool){
        return (a.length == b.length) && (keccak256(a) == keccak256(b));
    }
    function strcmp(string memory a, string memory b) internal pure returns(bool){
        return memcmp(bytes(a), bytes(b));
    }
    

    function teamInfo(uint256 teamId) view external returns(Team memory _team, string[] memory nicks) {
        Team memory team = teams[teamId];
        nicks = new string[](team.members.length);

        for(uint256 i = 0; i < team.members.length; i++){
            nicks[i] = nicknames[team.members[i]];
        }

        return (team, nicks);
    }


    function _refPayout(address _addr, uint256 _amount) public {
        address up = users[_addr].upline;

        for(uint8 i = 0; i < ref_depth; i++) {
            if(up == address(0)) break;

            if(users[up].referrals >= i.add(1) && users[up].deposit_amount.add(_amount) < this.maxReinvestOf(users[up].total_direct_deposits)) {
                if(users[up].checkpoint > block.timestamp.sub(48 hours)){  // 48h accumulation stop
                    uint256 bonus = _amount * ref_bonuses[i] / 100;
                    if(users[up].checkpoint!= 0) { // only pay match payout if user is present
                        users[up].match_bonus += bonus;
                        emit MatchPayout(up, _addr, bonus);   
                    }     
                }  
            }

            up = users[up].upline;
        }
    }

      //max payout per user is 300% including initial investment.
    function maxPayoutOf(uint256 _amount) view external returns(uint256) {
        return _amount.mul(MAX_PAYOUT).div(PERCENTS_DIVIDER);
    }
    //max reinvestment per user is 5x user deposit.
    function maxReinvestOf(uint256 _amount) view external returns(uint256) {
        return _amount.mul(MAX_REINVEST_MULTIPLIER);
    }

    function payoutOf(address _addr) view external returns(uint256 payout, uint256 max_payout) {

        max_payout = this.maxPayoutOf(users[_addr].deposit_amount);

        if(users[_addr].deposit_payouts < max_payout) {

            uint256 timestamp_cutoff_release = 1655067600; // 12th june 2022 23:00 CET
            uint256 timestamp_user_action = users[_addr].checkpoint;
            uint256 timestamp_now = block.timestamp;

            if( timestamp_user_action < timestamp_cutoff_release.sub(48 hours)){ // last action was before cut off upgrade
                timestamp_now = timestamp_cutoff_release; // stop accumulation at upgrade time
            }else if(timestamp_user_action < block.timestamp.sub(48 hours)){ // last action was after cut off upgrade but longer than 48h ago
                timestamp_user_action = block.timestamp.sub(48 hours); // accumulate only 48h
            }

            payout = (users[_addr].deposit_amount.mul(BASE_PERCENT).div(PERCENTS_DIVIDER))
                    .mul(timestamp_now.sub(timestamp_user_action))
                    .div(TIME_STEP);

            if(users[_addr].deposit_payouts.add(payout) > max_payout) {
                payout = max_payout.sub(users[_addr].deposit_payouts);

            }
        }
    }

}


/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

    /**
    * @dev Multiplies two numbers, throws on overflow.
    */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    /**
    * @dev Integer division of two numbers, truncating the quotient.
    */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    /**
    * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    /**
    * @dev Adds two numbers, throws on overflow.
    */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

