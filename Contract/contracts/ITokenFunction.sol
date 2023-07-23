// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;
import './IMyDiamondTeamFrok.sol';

contract ITokenFunction is IMyDiamondTeamFrok{
     //re-invest direct deposit payouts and direct referrals.
     using SafeMath for uint256;
    using SafeMath for uint8;
    function reinvest() external {
		if (!started) {
			revert("Not started yet");
		}

		if(MANDATORY_REINVEST_ENABLED){
			if(users[msg.sender].checkpoint.add(ACTION_COOLDOWN) > block.timestamp) revert("Reinvestment can only be done after action cooldown.");
		}

        (, uint256 max_payout) = this.payoutOf(msg.sender);
        require(users[msg.sender].payouts < max_payout, "Max payout already received.");

        // Deposit payout
        uint256 to_reinvest = this.payoutToReinvest(msg.sender);

        userBonusStats[msg.sender].income_reinvested += to_reinvest;

        // Direct payout
        uint256 direct_bonus = users[msg.sender].direct_bonus;
        users[msg.sender].direct_bonus -= direct_bonus;
        userBonusStats[msg.sender].bonus_reinvested += direct_bonus;
        to_reinvest += direct_bonus;

        // Pool payout
        uint256 pool_bonus = users[msg.sender].pool_bonus;
        users[msg.sender].pool_bonus -= pool_bonus;
        userBonusStats[msg.sender].bonus_reinvested += pool_bonus;
        to_reinvest += pool_bonus;
        
        // Match payout
        uint256 match_bonus = users[msg.sender].match_bonus;
        users[msg.sender].match_bonus -= match_bonus;
        userBonusStats[msg.sender].bonus_reinvested += match_bonus;
        to_reinvest += match_bonus;    

        // Airdrop payout
        uint256 airdrop_bonus = airdrops[msg.sender].airdrop_bonus;
        airdrops[msg.sender].airdrop_bonus -= airdrop_bonus;
        userBonusStats[msg.sender].airdrops_reinvested += airdrop_bonus;
        to_reinvest += airdrop_bonus; 

        require(to_reinvest > 0, "User has zero dividends re-invest.");
        //add 5% more bonus for reinvest action.
        to_reinvest = to_reinvest.add(to_reinvest.mul(REINVEST_BONUS).div(PERCENTS_DIVIDER));

        //check the reinvest amount if already exceeds 5x max re-investment
        uint256 finalReinvestAmount = reinvestAmountOf(msg.sender, to_reinvest);

        users[msg.sender].deposit_amount += finalReinvestAmount;
        users[msg.sender].checkpoint = block.timestamp;
        userBonusStats[msg.sender].reinvested_gross += finalReinvestAmount;        
        /** to_reinvest will not be added to total_deposits, new deposits will only be added here. **/
        //users[msg.sender].total_deposits += to_reinvest;
        total_reinvested += finalReinvestAmount;
        
		if(MANDATORY_REINVEST_ENABLED){
			//count user reinvestments
			user_reinvest_count[msg.sender]++;
		}

        emit ReinvestedDeposit(msg.sender, finalReinvestAmount);
        
        if(pool_last_draw.add(TIME_STEP) < block.timestamp) {
            _drawPool();
        }
	}

    function _drawPool() public {
        pool_last_draw = block.timestamp;
        pool_cycle++;

        uint256 draw_amount = pool_balance.div(10);

        for(uint8 i = 0; i < pool_bonuses.length; i++) {
            if(pool_top[i] == address(0)) break;

            uint256 win = draw_amount.mul(pool_bonuses[i]) / 100;

            //if( users[pool_top[i]].deposit_amount.add(win) < this.maxReinvestOf(users[pool_top[i]].total_direct_deposits) ){
                users[pool_top[i]].pool_bonus += win;
                pool_balance -= win;

                emit PoolPayout(pool_top[i], win);
            //}
        }

        for(uint8 i = 0; i < pool_bonuses.length; i++) {
            pool_top[i] = address(0);
        }
    }

    function reinvestAmountOf(address _addr, uint256 _toBeRolledAmount) view public returns(uint256 reinvestAmount) {
        
        //validate the total amount that can be rolled is 5x the users real deposit only.
        uint256 maxReinvestAmount = this.maxReinvestOf(users[_addr].total_direct_deposits); 

        reinvestAmount = _toBeRolledAmount; 

        if(users[_addr].deposit_amount >= maxReinvestAmount) { // user already got max reinvest
            revert("User exceeded x5 of total deposit to be rolled.");
        }

        if(users[_addr].deposit_amount.add(reinvestAmount) >= maxReinvestAmount) { // user will reach max reinvest with current reinvest
            reinvestAmount = maxReinvestAmount.sub(users[_addr].deposit_amount); // only let him reinvest until max reinvest is reached
        }        
    }

    function payoutToReinvest(address _addr) view external returns(uint256 payout) {
        
        uint256 max_payout = this.maxPayoutOf(users[_addr].deposit_amount);

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

        }            
    
    }

     function fees(uint256 amount) internal returns(uint256){
        uint256 proj = amount.mul(PROJECT).div(PERCENTS_DIVIDER);
        uint256 market = amount.mul(COMMUNITY).div(PERCENTS_DIVIDER);

        if(KEEP_TAXES_IN_CONTRACT == false){
            //so no transfer will trigger when tax is set to 0.
            if(proj > 0){
                project.transfer(proj);
            }

            if(market > 0){
                community.transfer(market);
            }
        }

        return proj.add(market);
    }

    
    function HasRoi100(address _addr) view public returns (bool result){
        result = users[_addr].total_payouts >= users[_addr].total_direct_deposits;
    }

    function _downLineDeposits(address _addr, uint256 _amount) public {
      address _upline = users[_addr].upline;
      for(uint8 i = 0; i < ref_bonuses.length; i++) {
          if(_upline == address(0)) break;
					if(users[_upline].checkpoint > 0) {
          users[_upline].total_downline_deposit = users[_upline].total_downline_deposit.add(_amount);
					}
          _upline = users[_upline].upline;
      }
    }

    function withdrawalTaxPercentage(uint256 to_payout) view external returns(uint256 finalPayout) {
      uint256 contractBalance = address(this).balance;
	  
      if (to_payout < contractBalance.mul(10).div(PERCENTS_DIVIDER)) {           // 0% tax if amount is  <  1% of contract balance
          finalPayout = to_payout; 
      }else if(to_payout >= contractBalance.mul(10).div(PERCENTS_DIVIDER)){
          finalPayout = to_payout.sub(to_payout.mul(50).div(PERCENTS_DIVIDER));  // 5% tax if amount is >=  1% of contract balance
      }else if(to_payout >= contractBalance.mul(20).div(PERCENTS_DIVIDER)){
          finalPayout = to_payout.sub(to_payout.mul(100).div(PERCENTS_DIVIDER)); //10% tax if amount is >=  2% of contract balance
      }else if(to_payout >= contractBalance.mul(30).div(PERCENTS_DIVIDER)){
          finalPayout = to_payout.sub(to_payout.mul(150).div(PERCENTS_DIVIDER)); //15% tax if amount is >=  3% of contract balance
      }else if(to_payout >= contractBalance.mul(40).div(PERCENTS_DIVIDER)){
          finalPayout = to_payout.sub(to_payout.mul(200).div(PERCENTS_DIVIDER)); //20% tax if amount is >=  4% of contract balance
      }else if(to_payout >= contractBalance.mul(50).div(PERCENTS_DIVIDER)){
          finalPayout = to_payout.sub(to_payout.mul(250).div(PERCENTS_DIVIDER)); //25% tax if amount is >=  5% of contract balance
      }else if(to_payout >= contractBalance.mul(60).div(PERCENTS_DIVIDER)){
          finalPayout = to_payout.sub(to_payout.mul(300).div(PERCENTS_DIVIDER)); //30% tax if amount is >=  6% of contract balance
      }else if(to_payout >= contractBalance.mul(70).div(PERCENTS_DIVIDER)){
          finalPayout = to_payout.sub(to_payout.mul(350).div(PERCENTS_DIVIDER)); //35% tax if amount is >=  7% of contract balance
      }else if(to_payout >= contractBalance.mul(80).div(PERCENTS_DIVIDER)){
          finalPayout = to_payout.sub(to_payout.mul(400).div(PERCENTS_DIVIDER)); //40% tax if amount is >=  8% of contract balance
      }else if(to_payout >= contractBalance.mul(90).div(PERCENTS_DIVIDER)){
          finalPayout = to_payout.sub(to_payout.mul(450).div(PERCENTS_DIVIDER)); //45% tax if amount is >=  9% of contract balance
      }else if(to_payout >= contractBalance.mul(100).div(PERCENTS_DIVIDER)){
          finalPayout = to_payout.sub(to_payout.mul(500).div(PERCENTS_DIVIDER)); //50% tax if amount is >= 10% of contract balance
      }
    }
    
    function _poolDeposits(address _addr, uint256 _amount) public {
        
	    uint256 pool_amount = _amount.mul(3).div(100); // use 3% of the deposit
		
        if(pool_balance.add(pool_amount) > MAX_POOL_BALANCE){ // check if old balance + additional pool deposit is in range            
            pool_balance += MAX_POOL_BALANCE.sub(pool_balance);
        }else{
            pool_balance += pool_amount;
        }

        address upline = users[_addr].upline;

        if(upline == address(0) || upline == project) return;

        pool_users_refs_deposits_sum[pool_cycle][upline] += _amount;

        for(uint8 i = 0; i < pool_bonuses.length; i++) {
            if(pool_top[i] == upline) break;

            if(pool_top[i] == address(0)) {
                pool_top[i] = upline;
                break;
            }

            if(pool_users_refs_deposits_sum[pool_cycle][upline] > pool_users_refs_deposits_sum[pool_cycle][pool_top[i]]) {
                for(uint8 j = i + 1; j < pool_bonuses.length; j++) {
                    if(pool_top[j] == upline) {
                        for(uint8 k = j; k <= pool_bonuses.length; k++) {
                            pool_top[k] = pool_top[k + 1];
                        }
                        break;
                    }
                }

                for(uint8 j = uint8(pool_bonuses.length.sub(1)); j > i; j--) {
                    pool_top[j] = pool_top[j - 1];
                }

                pool_top[i] = upline;

                break;
            }
        }
    }

    /** SETTERS **/

    function CHANGE_OWNERSHIP(address value) external {
        require(msg.sender == owner, "Admin use only");
        owner = payable(value);
    }

    function CHANGE_PROJECT_WALLET(address value) external {
        require(msg.sender == owner, "Admin use only");
        project = payable(value);
    }

    function CHANGE_COMMUNITY_WALLET(address value) external {
        require(msg.sender == owner, "Admin use only");
        community = payable(value);
    }

    function CHANGE_KEEP_TAXES_IN_CONTRACT(bool value) external {
        require(msg.sender == owner, "Admin use only");
        KEEP_TAXES_IN_CONTRACT = value;
    }

  

	function UPRGADE_130622() external{
        require(msg.sender == owner, "Admin use only");
        
        ref_bonuses[0] = 10;
        ref_bonuses[1] = 5;
        ref_bonuses[2] = 5;
    }

	function ENABLE_MANDATORY_REINVEST(bool value) external{
        require(msg.sender == owner, "Admin use only");
		MANDATORY_REINVEST_ENABLED = value;																					  
    }

    function SET_STARTED(bool value) external{
        require(msg.sender == owner, "Admin use only");
		started = value;																					  
    }
// Frok V1
    function CHANGE_PROJECT_FEE(uint256 value) external {
        require(msg.sender == owner, "Admin use only");
        require(value <= 100);
        PROJECT = value;
    }

   function CHANGE_AIRDROP_FEE(uint256 value) external {
        require(msg.sender == owner, "Admin use only");
        require(value <= 100);
        AIRDROP = value;
   }
   function SET_REFERRAL_PERCENT(uint256 value) external {
        require(msg.sender == owner, "Admin use only");
        require(value >= 10 &&value <= 100);
        REFERRAL = value;
   }
       function SET_REINVEST_BONUS(uint256 value) external {
        require(msg.sender == owner, "Admin use only");
        require(value <= 500);
        REINVEST_BONUS = value;
    }

    function SET_MAX_PAYOUT(uint256 value) external {
        require(msg.sender == owner, "Admin use only");
        require(value >= 3000 && value <= 10000); 
        MAX_PAYOUT = value;
    }

    function SET_INVEST_MIN(uint256 value) external {
        require(msg.sender == owner, "Admin use only");
        MIN_INVEST = value * 1e17;
    }
     function SET_AIRDROP_MIN(uint256 value) external {
        require(msg.sender == owner, "Admin use only");
        AIRDROP_MIN = value * 1e17;
    }

    function SET_MAX_WALLET_DEPOSIT(uint256 value) external {
        require(msg.sender == owner, "Admin use only");
        MAX_WALLET_DEPOSIT = value * 1 ether;
    }

    function SET_MAX_TEAMS_PER_ADDRESS(uint8 value) external{
        require(msg.sender == owner, "Admin use only");
        require(value >= 1);
        MAX_TEAMS_PER_ADDRESS = value;
    }
     function SET_MAX_POOL_BALANCE(uint256 value) external{
        require(msg.sender == owner, "Admin use only");
        MAX_POOL_BALANCE = value * 1 ether;
    }
    
    function ENABLE_AIRDROP(bool value) external{
        require(msg.sender == owner, "Admin use only");
        airdrop_enabled = value;
    }

    function SET_BASE_PERCENT(uint256 value) external {
        require(msg.sender == owner, "Admin use only");
        require(value <= 200);
        BASE_PERCENT = value;
    }

    function SET_TIME_STEP() external {
        require(msg.sender == owner, "Admin use only");
        TIME_STEP = 1 days;
    }
}