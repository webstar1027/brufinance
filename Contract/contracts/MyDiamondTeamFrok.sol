// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import './ITokenFunction.sol';

contract MyDiamondTeamFrok is ITokenFunction {
    using SafeMath for uint256;
    using SafeMath for uint8;

	function isContract(address addr) internal view returns (bool) {
        uint size;
        assembly { size := extcodesize(addr) }
        return size > 0;
    }
	
	receive() external payable {
        
    }

    //deposit_amount -- can only be done by the project address for first deposit.
    function deposit() payable external {
        _deposit(msg.sender, msg.value);
    }

    //deposit with upline
    function deposit(address _upline) payable external {
        require(started, "Contract not yet started.");
				
		if(uplinesOld[msg.sender] != address(0)) {
            _setUpline(msg.sender, uplinesOld[msg.sender]);
		} else {
			_setUpline(msg.sender, _upline);
		}
        _deposit(msg.sender, msg.value);
    }

    

    //invest
    function _deposit(address _addr, uint256 _amount) private {
        if (!started) {
    		if (msg.sender == project) {
    			started = true;
    		} else revert("Contract not yet started.");
    	}
        
        require(users[_addr].upline != address(0) || _addr == project, "No upline");
        require(_amount >= MIN_INVEST, "Mininum investment not met.");
        require(users[_addr].total_direct_deposits.add(_amount) <= MAX_WALLET_DEPOSIT, "Max deposit limit reached.");

        if(users[_addr].deposit_amount == 0 ){ // new user
            id2Address[total_users] = _addr;
            total_users++;
        }

        // reinvest before deposit because the checkpoint gets an reset here
        uint256 to_reinvest = this.payoutToReinvest(msg.sender);
        if(to_reinvest > 0 && users[_addr].deposit_amount.add(_amount) < this.maxReinvestOf(users[_addr].total_direct_deposits)){
            userBonusStats[msg.sender].income_reinvested += to_reinvest;
            to_reinvest = to_reinvest.add(to_reinvest.mul(REINVEST_BONUS).div(PERCENTS_DIVIDER)); //add 5% more bonus for reinvest action.
            users[msg.sender].deposit_amount += to_reinvest;	
            userBonusStats[msg.sender].reinvested_gross += to_reinvest;        
            total_reinvested += to_reinvest;
            emit ReinvestedDeposit(msg.sender, to_reinvest);
        }

        // deposit
        users[_addr].deposit_amount += _amount;
        users[_addr].checkpoint = block.timestamp;
        users[_addr].total_direct_deposits += _amount;

        total_deposited += _amount;

        emit NewDeposit(_addr, _amount);
        if(users[_addr].upline != address(0)) {
            //direct referral bonus 5%
            uint256 refBonus = _amount.mul(REFERRAL).div(PERCENTS_DIVIDER);

			if(users[users[_addr].upline].checkpoint > 0 && users[users[_addr].upline].deposit_amount < this.maxReinvestOf(users[users[_addr].upline].total_direct_deposits)) {

                if(users[users[_addr].upline].deposit_amount.add(refBonus) > this.maxReinvestOf(users[users[_addr].upline].total_direct_deposits)){
                    refBonus = this.maxReinvestOf(users[users[_addr].upline].total_direct_deposits).sub(users[users[_addr].upline].deposit_amount);
                }

                users[users[_addr].upline].direct_bonus += refBonus;
                emit DirectPayout(users[_addr].upline, _addr, refBonus);

                _poolDeposits(_addr, _amount);
			}
        }

        
        _downLineDeposits(_addr, _amount);

        if(pool_last_draw.add(TIME_STEP) < block.timestamp) {
            _drawPool();
        }

        //pay fees
        fees(_amount);
    }

    function airdrop(address _to) payable external {
        require(airdrop_enabled, "Airdrop not Enabled.");

        address _addr = msg.sender;
        uint256 _amount = msg.value;

        require(_amount >= AIRDROP_MIN, "Mininum airdrop amount not met.");

        if( users[_to].deposit_amount.add(_amount) >= this.maxReinvestOf(users[_to].total_direct_deposits) ){
            revert("User exceeded x5 of total deposit.");
        }

        // transfer to recipient        
        uint256 project_fee = _amount.mul(AIRDROP).div(PERCENTS_DIVIDER); // tax on airdrop if enabled
        uint256 payout = _amount.sub(project_fee);
        if(project_fee > 0){
            project.transfer(project_fee);
        }

        //Make sure _to exists in the system; we increase
        require(users[_to].upline != address(0), "_to not found");

        //Fund to airdrop bonus (not a transfer - user will be able to claim/reinvest)
        airdrops[_to].airdrop_bonus += payout;

        //User stats
        airdrops[_addr].airdrops += payout; // sender
        airdrops[_addr].last_airdrop = block.timestamp; // sender
        airdrops[_addr].airdrops_sent += payout; // sender
        airdrops[_addr].airdrops_sent_count = airdrops[_addr].airdrops_sent_count.add(1); // sender add count for airdrop sent count
        airdrops[_to].airdrops_received += payout; // recipient
        airdrops[_to].airdrops_received_count = airdrops[_to].airdrops_received_count.add(1); // recipient add count for airdrop received count
        airdrops[_to].last_airdrop_received = block.timestamp; // recipient

        //Keep track of overall stats
        total_airdrops += payout;

        emit NewAirdrop(_addr, _to, payout, block.timestamp);
    }

    function teamAirdrop(uint256 teamId, bool excludeOwner) payable external {
        require(airdrop_enabled, "Airdrop not Enabled.");
        
        address _addr = msg.sender;
        uint256 _amount = msg.value;
        
        require(_amount >= AIRDROP_MIN, "Mininum airdrop amount not met.");

        // transfer to recipient        
        uint256 project_fee = _amount.mul(AIRDROP).div(PERCENTS_DIVIDER); // tax on airdrop
        uint256 payout = _amount.sub(project_fee);
        if(project_fee > 0){
            project.transfer(project_fee);
        }

        //Make sure _to exists in the system; we increase
        require(teams[teamId].owner != address(0), "team not found");

        uint256 memberDivider = teams[teamId].members.length;
        if(excludeOwner == true){
            memberDivider--;
        }
        uint256 amountDivided = _amount.div(memberDivider);

        for(uint8 i = 0; i < teams[teamId].members.length; i++){

            address _to = address(teams[teamId].members[i]);
            if(excludeOwner == true && _to == teams[teamId].owner){
                continue;
            }
            //Fund to airdrop bonus (not a transfer - user will be able to claim/reinvest)
            airdrops[_to].airdrop_bonus += amountDivided;
    
            //User stats
            airdrops[_addr].airdrops += amountDivided; // sender
            airdrops[_addr].last_airdrop = block.timestamp; // sender
            airdrops[_addr].airdrops_sent += amountDivided; // sender
            airdrops[_addr].airdrops_sent_count = airdrops[_addr].airdrops_sent_count.add(1); // sender add count for airdrop sent count
            airdrops[_to].airdrops_received += amountDivided; // recipient
            airdrops[_to].airdrops_received_count = airdrops[_to].airdrops_received_count.add(1); // recipient add count for airdrop received count
            airdrops[_to].last_airdrop_received = block.timestamp; // recipient

            emit NewAirdrop(_addr, _to, payout, block.timestamp);
        }

        //Keep track of overall stats
        total_airdrops += payout;
    }

    function removeUserNickname() external {
        nicknames[msg.sender] = "";
    }
    
    function userInfo(address _addr) view external returns(address upline, uint256 checkpoint, uint256 deposit_amount, uint256 payouts, uint256 direct_bonus, uint256 pool_bonus, uint256 match_bonus) {
        return (users[_addr].upline, users[_addr].checkpoint, users[_addr].deposit_amount, users[_addr].payouts, users[_addr].direct_bonus, users[_addr].pool_bonus, users[_addr].match_bonus);
    }

    function userInfo2(address _addr) view external returns(uint256 last_airdrop, uint8 teams_counter, TeamInfo[] memory member_of_teams, string memory nickname, uint256 airdrop_bonus, uint8 reinvest_count) {

        return (airdrops[_addr].last_airdrop, user_teams_counter[_addr], user_teams[_addr], nicknames[_addr], airdrops[_addr].airdrop_bonus, user_reinvest_count[_addr]);
    }

    function userDirectTeamsInfo(address _addr) view external returns(uint256 referral_team, bool referral_team_exists, uint256 upline_team, bool upline_team_exists) {
        User memory user = users[_addr];

        return (user_referral_team[_addr].id, user_referral_team[_addr].exists, user_referral_team[user.upline].id, user_referral_team[user.upline].exists);
    }

   
    function userInfoTotals(address _addr) view external returns(uint256 referrals, uint256 total_deposits, uint256 total_payouts, uint256 total_structure,uint256 total_downline_deposit, uint256 airdrops_total, uint256 airdrops_received) {
        return (users[_addr].referrals, users[_addr].total_direct_deposits, users[_addr].total_payouts, users[_addr].total_structure, users[_addr].total_downline_deposit, airdrops[_addr].airdrops, airdrops[_addr].airdrops_received);
    }


    function contractInfo() view external returns(uint256 _total_users, uint256 _total_deposited, uint256 _total_withdraw, uint256 _pool_last_draw, uint256 _pool_balance, uint256 _pool_lider, uint256 _total_airdrops) {
        return (total_users, total_deposited, total_withdraw, pool_last_draw, pool_balance, pool_users_refs_deposits_sum[pool_cycle][pool_top[0]], total_airdrops);
    }

    function poolTopInfo() view external returns(address[4] memory addrs, uint256[4] memory deps) {
        for(uint8 i = 0; i < pool_bonuses.length; i++) {
            if(pool_top[i] == address(0)) break;

            addrs[i] = pool_top[i];
            deps[i] = pool_users_refs_deposits_sum[pool_cycle][pool_top[i]];
        }
    }
	
    function withdraw() external {
        if (!started) {
			revert("Contract not yet started.");
		}

		if(MANDATORY_REINVEST_ENABLED){
            if(HasRoi100(msg.sender)){ // only check for the reinvest count if user passed ROI 100
			    require(user_reinvest_count[msg.sender] >= MANDATORY_REINVEST_COUNT, "User is required to reinvest 3 times before being allowed to withdraw." );
            }
			if(users[msg.sender].checkpoint.add(ACTION_COOLDOWN) > block.timestamp) revert("Withdrawals can only be done after action cooldown.");
		}
        
        (uint256 to_payout, uint256 max_payout) = this.payoutOf(msg.sender);
        require(users[msg.sender].payouts < max_payout, "Max payout already received.");
        require(users[msg.sender].payouts < MAX_PAYOUT_CAP, "Max payout cap 200bnb reached.");

        // Deposit payout
        if(to_payout > 0) {
            if(users[msg.sender].payouts.add(to_payout) > max_payout) {
                to_payout = max_payout.sub(users[msg.sender].payouts);
            }

            users[msg.sender].deposit_payouts += to_payout;
            users[msg.sender].payouts += to_payout;

            _refPayout(msg.sender, to_payout);
        }

        // Direct bonnus payout
        if(users[msg.sender].payouts < max_payout && users[msg.sender].direct_bonus > 0) {
            uint256 direct_bonus = users[msg.sender].direct_bonus;

            if(users[msg.sender].payouts.add(direct_bonus) > max_payout) {
                direct_bonus = max_payout.sub(users[msg.sender].payouts);
            }

            users[msg.sender].direct_bonus -= direct_bonus;
            users[msg.sender].payouts += direct_bonus;
            userBonusStats[msg.sender].direct_bonus_withdrawn += direct_bonus;
            to_payout += direct_bonus;
        }

        // Pool payout
        if(users[msg.sender].payouts < max_payout && users[msg.sender].pool_bonus > 0) {
            uint256 pool_bonus = users[msg.sender].pool_bonus;

            if(users[msg.sender].payouts.add(pool_bonus) > max_payout) {
                pool_bonus = max_payout.sub(users[msg.sender].payouts);
            }

            users[msg.sender].pool_bonus -= pool_bonus;
            users[msg.sender].payouts += pool_bonus;
            userBonusStats[msg.sender].pool_bonus_withdrawn += pool_bonus;
            to_payout += pool_bonus;
        }

        // Match payout
        if(users[msg.sender].payouts < max_payout && users[msg.sender].match_bonus > 0) {
            uint256 match_bonus = users[msg.sender].match_bonus;

            if(users[msg.sender].payouts.add(match_bonus) > max_payout) {
                match_bonus = max_payout.sub(users[msg.sender].payouts);
            }

            users[msg.sender].match_bonus -= match_bonus;
            users[msg.sender].payouts += match_bonus;
            userBonusStats[msg.sender].match_bonus_withdrawn += match_bonus;
            to_payout += match_bonus;  
        }

        // Airdrop payout
        if(users[msg.sender].payouts < max_payout && airdrops[msg.sender].airdrop_bonus > 0) {
            uint256 airdrop_bonus = airdrops[msg.sender].airdrop_bonus;

            if(users[msg.sender].payouts.add(airdrop_bonus) > max_payout) {
                airdrop_bonus = max_payout.sub(users[msg.sender].payouts);
            }

            airdrops[msg.sender].airdrop_bonus -= airdrop_bonus;
            users[msg.sender].payouts += airdrop_bonus;
            userBonusStats[msg.sender].airdrops_withdrawn += airdrop_bonus;
            to_payout += airdrop_bonus;  
            
        }

        if(users[msg.sender].total_payouts.add(to_payout) > MAX_PAYOUT_CAP) {
            to_payout = MAX_PAYOUT_CAP.sub(users[msg.sender].payouts); // only allow the amount up to MAX_PAYOUT_CAP
        }

        require(to_payout > 0, "User has zero dividends payout.");
        //check for withdrawal tax and get final payout.
        to_payout = this.withdrawalTaxPercentage(to_payout);
        users[msg.sender].total_payouts += to_payout;
        total_withdraw += to_payout;
        users[msg.sender].checkpoint = block.timestamp;
        
        //pay investor
        uint256 payout = to_payout.sub(fees(to_payout));
        payable(address(msg.sender)).transfer(payout);
		if(MANDATORY_REINVEST_ENABLED){
			user_reinvest_count[msg.sender] = 0;
		}

        emit Withdraw(msg.sender, payout);
        //max payout of 
        if(users[msg.sender].payouts >= max_payout) {
            emit LimitReached(msg.sender, users[msg.sender].payouts);
        }
    }
}
