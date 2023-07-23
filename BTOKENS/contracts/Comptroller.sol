// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ErrorReporter.sol";
import "./PriceOracle.sol";
import "./ComptrollerInterface.sol";
import "./ComptrollerStorage.sol";
import "./Unitroller.sol";
import "./BRU.sol";
import "./ExponentialNoError.sol";

contract Comptroller is
    ComptrollerV6Storage,
    ComptrollerInterface,
    ComptrollerErrorReporter,
    ExponentialNoError
{
    event MarketListed(BToken bToken);

    event MarketEntered(BToken bToken, address account);

    event MarketExited(BToken bToken, address account);

    event NewCloseFactor(
        uint256 oldCloseFactorMantissa,
        uint256 newCloseFactorMantissa
    );

    event NewCollateralFactor(
        BToken bToken,
        uint256 oldCollateralFactorMantissa,
        uint256 newCollateralFactorMantissa
    );

    event NewLiquidationIncentive(
        uint256 oldLiquidationIncentiveMantissa,
        uint256 newLiquidationIncentiveMantissa
    );

    event NewPriceOracle(
        PriceOracle oldPriceOracle,
        PriceOracle newPriceOracle
    );

    event NewPauseGuardian(address oldPauseGuardian, address newPauseGuardian);

    event ActionPaused(string action, bool pauseState);

    event ActionPaused(BToken bToken, string action, bool pauseState);

    event CompBorrowSpeedUpdated(BToken indexed bToken, uint256 newSpeed);

    event CompSupplySpeedUpdated(BToken indexed bToken, uint256 newSpeed);

    event ContributorCompSpeedUpdated(
        address indexed contributor,
        uint256 newSpeed
    );

    event DistributedSupplierComp(
        BToken indexed bToken,
        address indexed supplier,
        uint256 compDelta,
        uint256 compSupplyIndex
    );

    event DistributedBorrowerComp(
        BToken indexed bToken,
        address indexed borrower,
        uint256 compDelta,
        uint256 compBorrowIndex
    );

    event NewBorrowCap(BToken indexed bToken, uint256 newBorrowCap);

    event NewBorrowCapGuardian(
        address oldBorrowCapGuardian,
        address newBorrowCapGuardian
    );

    event CompGranted(address recipient, uint256 amount);

    uint224 public constant compInitialIndex = 1e36;

    uint256 internal constant closeFactorMinMantissa = 0.05e18; // 0.05

    uint256 internal constant closeFactorMaxMantissa = 0.9e18; // 0.9

    uint256 internal constant collateralFactorMaxMantissa = 0.9e18; // 0.9

    constructor() {
        admin = msg.sender;
    }

    function getAssetsIn(address account)
        external
        view
        returns (BToken[] memory)
    {
        BToken[] memory assetsIn = accountAssets[account];

        return assetsIn;
    }

    function checkMembership(address account, BToken bToken)
        external
        view
        returns (bool)
    {
        return markets[address(bToken)].accountMembership[account];
    }

    function enterMarkets(address[] memory bTokens)
        public
        override
        returns (uint256[] memory)
    {
        uint256 len = bTokens.length;

        uint256[] memory results = new uint256[](len);
        for (uint256 i = 0; i < len; i++) {
            BToken bToken = BToken(bTokens[i]);

            results[i] = uint256(addToMarketInternal(bToken, msg.sender));
        }

        return results;
    }

    function addToMarketInternal(BToken bToken, address borrower)
        internal
        returns (Error)
    {
        Market storage marketToJoin = markets[address(bToken)];
        // marketToJoin.isListed = true;
        if (!marketToJoin.isListed) {
            // market is not listed, cannot join
            return Error.MARKET_NOT_LISTED;
        }

        if (marketToJoin.accountMembership[borrower] == true) {
            // already joined
            return Error.NO_ERROR;
        }

        marketToJoin.accountMembership[borrower] = true;
        accountAssets[borrower].push(bToken);

        emit MarketEntered(bToken, borrower);

        return Error.NO_ERROR;
    }

    function exitMarket(address bTokenAddress)
        external
        override
        returns (uint256)
    {
        BToken bToken = BToken(bTokenAddress);

        (uint256 oErr, uint256 tokensHeld, uint256 amountOwed, ) = bToken
            .getAccountSnapshot(msg.sender);
        require(oErr == 0, "exitMarket: getAccountSnapshot failed");

        if (amountOwed != 0) {
            return
                fail(
                    Error.NONZERO_BORROW_BALANCE,
                    FailureInfo.EXIT_MARKET_BALANCE_OWED
                );
        }

        uint256 allowed = redeemAllowedInternal(
            bTokenAddress,
            msg.sender,
            tokensHeld
        );
        if (allowed != 0) {
            return
                failOpaque(
                    Error.REJECTION,
                    FailureInfo.EXIT_MARKET_REJECTION,
                    allowed
                );
        }

        Market storage marketToExit = markets[address(bToken)];

        if (!marketToExit.accountMembership[msg.sender]) {
            return uint256(Error.NO_ERROR);
        }

        delete marketToExit.accountMembership[msg.sender];

        BToken[] memory userAssetList = accountAssets[msg.sender];
        uint256 len = userAssetList.length;
        uint256 assetIndex = len;
        for (uint256 i = 0; i < len; i++) {
            if (userAssetList[i] == bToken) {
                assetIndex = i;
                break;
            }
        }

        assert(assetIndex < len);

        BToken[] storage storedList = accountAssets[msg.sender];
        storedList[assetIndex] = storedList[storedList.length - 1];
        storedList.pop();

        emit MarketExited(bToken, msg.sender);

        return uint256(Error.NO_ERROR);
    }

    function mintAllowed(
        address bToken,
        address minter,
        uint256 mintAmount
    ) external override returns (uint256) {
        require(!mintGuardianPaused[bToken], "mint is paused");

        minter;
        mintAmount;

        if (!markets[bToken].isListed) {
            return uint256(Error.MARKET_NOT_LISTED);
        }

        // Keep the flywheel moving
        updateCompSupplyIndex(bToken);
        distributeSupplierComp(bToken, minter);

        return uint256(Error.NO_ERROR);
    }

    function mintVerify(
        address bToken,
        address minter,
        uint256 actualMintAmount,
        uint256 mintTokens
    ) external override {
        bToken;
        minter;
        actualMintAmount;
        mintTokens;

        // Shh - we don't ever want this hook to be marked pure
        if (false) {
            maxAssets = maxAssets;
        }
    }

    function redeemAllowed(
        address bToken,
        address redeemer,
        uint256 redeemTokens
    ) external override returns (uint256) {
        uint256 allowed = redeemAllowedInternal(
            (bToken),
            (redeemer),
            redeemTokens
        );
        if (allowed != uint256(Error.NO_ERROR)) {
            return allowed;
        }

        // Keep the flywheel moving
        updateCompSupplyIndex(bToken);
        distributeSupplierComp(bToken, redeemer);

        return uint256(Error.NO_ERROR);
    }

    function redeemAllowedInternal(
        address bToken,
        address redeemer,
        uint256 redeemTokens
    ) internal view returns (uint256) {
        if (!markets[bToken].isListed) {
            return uint256(Error.MARKET_NOT_LISTED);
        }

        if (!markets[bToken].accountMembership[redeemer]) {
            return uint256(Error.NO_ERROR);
        }

        (
            Error err,
            ,
            uint256 shortfall
        ) = getHypotheticalAccountLiquidityInternal(
                redeemer,
                BToken(bToken),
                redeemTokens,
                0
            );
        if (err != Error.NO_ERROR) {
            return uint256(err);
        }
        if (shortfall > 0) {
            return uint256(Error.INSUFFICIENT_LIQUIDITY);
        }

        return uint256(Error.NO_ERROR);
    }

    function redeemVerify(
        address bToken,
        address redeemer,
        uint256 redeemAmount,
        uint256 redeemTokens
    ) external pure override {
        bToken;
        redeemer;

        if (redeemTokens == 0 && redeemAmount > 0) {
            revert("redeemTokens zero");
        }
    }

    function borrowAllowed(
        address bToken,
        address borrower,
        uint256 borrowAmount
    ) external override returns (uint256) {
        Error err;

        require(!borrowGuardianPaused[bToken], "borrow is paused");

        if (!markets[bToken].isListed) {
            return uint256(Error.MARKET_NOT_LISTED);
        }

        if (!markets[bToken].accountMembership[borrower]) {
            require(msg.sender == bToken, "sender must be cToken");

            err = addToMarketInternal(BToken(msg.sender), borrower);
            if (err != Error.NO_ERROR) {
                return uint256(err);
            }

            // it should be impossible to break the important invariant
            assert(markets[bToken].accountMembership[borrower]);
        }

        if (oracle.getUnderlyingPrice(BToken(bToken)) == 0) {
            return uint256(Error.PRICE_ERROR);
        }

        uint256 borrowCap = borrowCaps[bToken];

        if (borrowCap != 0) {
            uint256 totalBorrows = BToken(bToken).totalBorrows();
            uint256 nextTotalBorrows = add_(totalBorrows, borrowAmount);
            require(nextTotalBorrows < borrowCap);
        }

        (
            Error error,
            ,
            uint256 shortfall
        ) = getHypotheticalAccountLiquidityInternal(
                borrower,
                BToken(bToken),
                0,
                borrowAmount
            );
        if (error != Error.NO_ERROR) {
            return uint256(err);
        }
        if (shortfall > 0) {
            return uint256(Error.INSUFFICIENT_LIQUIDITY);
        }

        // Keep the flywheel moving
        Exp memory borrowIndex = Exp({mantissa: BToken(bToken).borrowIndex()});
        updateCompBorrowIndex(bToken, borrowIndex);
        distributeBorrowerComp(bToken, borrower, borrowIndex);

        return uint256(Error.NO_ERROR);
    }

    function borrowVerify(
        address bToken,
        address borrower,
        uint256 borrowAmount
    ) external override {
        bToken;
        borrower;
        borrowAmount;

        if (false) {
            maxAssets = maxAssets;
        }
    }

    function repayBorrowAllowed(
        address bToken,
        address payer,
        address borrower,
        uint256 repayAmount
    ) external override returns (uint256) {
        // Shh - currently unused
        payer;
        borrower;
        repayAmount;

        if (!markets[bToken].isListed) {
            return uint256(Error.MARKET_NOT_LISTED);
        }

        Exp memory borrowIndex = Exp({mantissa: BToken(bToken).borrowIndex()});
        updateCompBorrowIndex(bToken, borrowIndex);
        distributeBorrowerComp(bToken, borrower, borrowIndex);

        return uint256(Error.NO_ERROR);
    }

    function repayBorrowVerify(
        address bToken,
        address payer,
        address borrower,
        uint256 actualRepayAmount,
        uint256 borrowerIndex
    ) external override {
        bToken;
        payer;
        borrower;
        actualRepayAmount;
        borrowerIndex;

        if (false) {
            maxAssets = maxAssets;
        }
    }

    function liquidateBorrowAllowed(
        address bTokenBorrowed,
        address bTokenCollateral,
        address liquidator,
        address borrower,
        uint256 repayAmount
    ) external view override returns (uint256) {
        liquidator;

        if (
            !markets[bTokenBorrowed].isListed ||
            !markets[bTokenCollateral].isListed
        ) {
            return uint256(Error.MARKET_NOT_LISTED);
        }

        uint256 borrowBalance = BToken(bTokenBorrowed).borrowBalanceStored(
            borrower
        );

        if (isDeprecated(BToken(bTokenBorrowed))) {
            require(
                borrowBalance >= repayAmount,
                "Can not repay more than the total borrow"
            );
        } else {
            (Error err, , uint256 shortfall) = getAccountLiquidityInternal(
                borrower
            );
            if (err != Error.NO_ERROR) {
                return uint256(err);
            }

            if (shortfall == 0) {
                return uint256(Error.INSUFFICIENT_SHORTFALL);
            }

            uint256 maxClose = mul_ScalarTruncate(
                Exp({mantissa: closeFactorMantissa}),
                borrowBalance
            );
            if (repayAmount > maxClose) {
                return uint256(Error.TOO_MUCH_REPAY);
            }
        }
        return uint256(Error.NO_ERROR);
    }

    function liquidateBorrowVerify(
        address cTokenBorrowed,
        address cTokenCollateral,
        address liquidator,
        address borrower,
        uint256 actualRepayAmount,
        uint256 seizeTokens
    ) external override {
        cTokenBorrowed;
        cTokenCollateral;
        liquidator;
        borrower;
        actualRepayAmount;
        seizeTokens;

        if (false) {
            maxAssets = maxAssets;
        }
    }

    function seizeAllowed(
        address bTokenCollateral,
        address bTokenBorrowed,
        address liquidator,
        address borrower,
        uint256 seizeTokens
    ) external override returns (uint256) {
        require(!seizeGuardianPaused, "seize is paused");

        seizeTokens;

        if (
            !markets[bTokenCollateral].isListed ||
            !markets[bTokenBorrowed].isListed
        ) {
            return uint256(Error.MARKET_NOT_LISTED);
        }

        if (
            BToken(bTokenCollateral).comptroller() !=
            BToken(bTokenBorrowed).comptroller()
        ) {
            return uint256(Error.COMPTROLLER_MISMATCH);
        }

        updateCompSupplyIndex(bTokenCollateral);
        distributeSupplierComp(bTokenCollateral, borrower);
        distributeSupplierComp(bTokenCollateral, liquidator);

        return uint256(Error.NO_ERROR);
    }

    function seizeVerify(
        address cTokenCollateral,
        address cTokenBorrowed,
        address liquidator,
        address borrower,
        uint256 seizeTokens
    ) external override {
        // Shh - currently unused
        cTokenCollateral;
        cTokenBorrowed;
        liquidator;
        borrower;
        seizeTokens;

        // Shh - we don't ever want this hook to be marked pure
        if (false) {
            maxAssets = maxAssets;
        }
    }

    function transferAllowed(
        address bToken,
        address src,
        address dst,
        uint256 transferTokens
    ) external override returns (uint256) {
        // Pausing is a very serious situation - we revert to sound the alarms
        require(!transferGuardianPaused, "transfer is paused");

        uint256 allowed = redeemAllowedInternal(
            (bToken),
            (src),
            transferTokens
        );
        if (allowed != uint256(Error.NO_ERROR)) {
            return allowed;
        }

        // Keep the flywheel moving
        updateCompSupplyIndex((bToken));
        distributeSupplierComp((bToken), (src));
        distributeSupplierComp((bToken), (dst));

        return uint256(Error.NO_ERROR);
    }

    function transferVerify(
        address bToken,
        address src,
        address dst,
        uint256 transferTokens
    ) external override {
        // Shh - currently unused
        (bToken);
        (src);
        (dst);
        transferTokens;

        if (false) {
            maxAssets = maxAssets;
        }
    }

    struct AccountLiquidityLocalVars {
        uint256 sumCollateral;
        uint256 sumBorrowPlusEffects;
        uint256 cTokenBalance;
        uint256 borrowBalance;
        uint256 exchangeRateMantissa;
        uint256 oraclePriceMantissa;
        Exp collateralFactor;
        Exp exchangeRate;
        Exp oraclePrice;
        Exp tokensToDenom;
    }

    function getAccountLiquidity(address account)
        public
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        (
            Error err,
            uint256 liquidity,
            uint256 shortfall
        ) = getHypotheticalAccountLiquidityInternal(
                account,
                BToken(address(uint160(0))),
                0,
                0
            );

        return (uint256(err), liquidity, shortfall);
    }

    function getAccountLiquidityInternal(address account)
        internal
        view
        returns (
            Error,
            uint256,
            uint256
        )
    {
        return
            getHypotheticalAccountLiquidityInternal(
                account,
                BToken(address(uint160(0))),
                0,
                0
            );
    }

    function getHypotheticalAccountLiquidity(
        address account,
        address bTokenModify,
        uint256 redeemTokens,
        uint256 borrowAmount
    )
        public
        view
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        (
            Error err,
            uint256 liquidity,
            uint256 shortfall
        ) = getHypotheticalAccountLiquidityInternal(
                account,
                BToken(bTokenModify),
                redeemTokens,
                borrowAmount
            );
        return (uint256(err), liquidity, shortfall);
    }

    function getHypotheticalAccountLiquidityInternal(
        address account,
        BToken bTokenModify,
        uint256 redeemTokens,
        uint256 borrowAmount
    )
        internal
        view
        returns (
            Error,
            uint256,
            uint256
        )
    {
        AccountLiquidityLocalVars memory vars;
        uint256 oErr;

        BToken[] memory assets = accountAssets[account];
        for (uint256 i = 0; i < assets.length; i++) {
            BToken asset = assets[i];

            (
                oErr,
                vars.cTokenBalance,
                vars.borrowBalance,
                vars.exchangeRateMantissa
            ) = asset.getAccountSnapshot(account);
            if (oErr != 0) {
                return (Error.SNAPSHOT_ERROR, 0, 0);
            }
            vars.collateralFactor = Exp({
                mantissa: markets[address(asset)].collateralFactorMantissa
            });
            vars.exchangeRate = Exp({mantissa: vars.exchangeRateMantissa});

            vars.oraclePriceMantissa = oracle.getUnderlyingPrice(asset);
            if (vars.oraclePriceMantissa == 0) {
                return (Error.PRICE_ERROR, 0, 0);
            }
            vars.oraclePrice = Exp({mantissa: vars.oraclePriceMantissa});

            vars.tokensToDenom = mul_(
                mul_(vars.collateralFactor, vars.exchangeRate),
                vars.oraclePrice
            );

            vars.sumCollateral = mul_ScalarTruncateAddUInt(
                vars.tokensToDenom,
                vars.cTokenBalance,
                vars.sumCollateral
            );

            vars.sumBorrowPlusEffects = mul_ScalarTruncateAddUInt(
                vars.oraclePrice,
                vars.borrowBalance,
                vars.sumBorrowPlusEffects
            );

            if (asset == bTokenModify) {
                vars.sumBorrowPlusEffects = mul_ScalarTruncateAddUInt(
                    vars.tokensToDenom,
                    redeemTokens,
                    vars.sumBorrowPlusEffects
                );
                vars.sumBorrowPlusEffects = mul_ScalarTruncateAddUInt(
                    vars.oraclePrice,
                    borrowAmount,
                    vars.sumBorrowPlusEffects
                );
            }
        }

        if (vars.sumCollateral > vars.sumBorrowPlusEffects) {
            return (
                Error.NO_ERROR,
                vars.sumCollateral - vars.sumBorrowPlusEffects,
                0
            );
        } else {
            return (
                Error.NO_ERROR,
                0,
                vars.sumBorrowPlusEffects - vars.sumCollateral
            );
        }
    }

    function liquidateCalculateSeizeTokens(
        address bTokenBorrowed,
        address bTokenCollateral,
        uint256 actualRepayAmount
    ) external view override returns (uint256, uint256) {
        /* Read oracle prices for borrowed and collateral markets */
        uint256 priceBorrowedMantissa = oracle.getUnderlyingPrice(
            BToken(bTokenBorrowed)
        );
        uint256 priceCollateralMantissa = oracle.getUnderlyingPrice(
            BToken(bTokenCollateral)
        );
        if (priceBorrowedMantissa == 0 || priceCollateralMantissa == 0) {
            return (uint256(Error.PRICE_ERROR), 0);
        }

        uint256 exchangeRateMantissa = BToken(bTokenCollateral)
            .exchangeRateStored(); // Note: reverts on error
        uint256 seizeTokens;
        Exp memory numerator;
        Exp memory denominator;
        Exp memory ratio;

        numerator = mul_(
            Exp({mantissa: liquidationIncentiveMantissa}),
            Exp({mantissa: priceBorrowedMantissa})
        );
        denominator = mul_(
            Exp({mantissa: priceCollateralMantissa}),
            Exp({mantissa: exchangeRateMantissa})
        );
        ratio = div_(numerator, denominator);

        seizeTokens = mul_ScalarTruncate(ratio, actualRepayAmount);

        return (uint256(Error.NO_ERROR), seizeTokens);
    }

    function _setPriceOracle(PriceOracle newOracle) public returns (uint256) {
        // Check caller is admin
        if (msg.sender != admin) {
            return
                fail(
                    Error.UNAUTHORIZED,
                    FailureInfo.SET_PRICE_ORACLE_OWNER_CHECK
                );
        }

        PriceOracle oldOracle = oracle;

        oracle = newOracle;

        emit NewPriceOracle(oldOracle, newOracle);

        return uint256(Error.NO_ERROR);
    }

    function _setCloseFactor(uint256 newCloseFactorMantissa)
        external
        returns (uint256)
    {
        require(msg.sender == admin);

        uint256 oldCloseFactorMantissa = closeFactorMantissa;
        closeFactorMantissa = newCloseFactorMantissa;
        emit NewCloseFactor(oldCloseFactorMantissa, closeFactorMantissa);

        return uint256(Error.NO_ERROR);
    }

    function _setCollateralFactor(
        BToken bToken,
        uint256 newCollateralFactorMantissa
    ) external returns (uint256) {
        if (msg.sender != admin) {
            return
                fail(
                    Error.UNAUTHORIZED,
                    FailureInfo.SET_COLLATERAL_FACTOR_OWNER_CHECK
                );
        }

        Market storage market = markets[address(bToken)];
        if (!market.isListed) {
            return
                fail(
                    Error.MARKET_NOT_LISTED,
                    FailureInfo.SET_COLLATERAL_FACTOR_NO_EXISTS
                );
        }

        Exp memory newCollateralFactorExp = Exp({
            mantissa: newCollateralFactorMantissa
        });

        Exp memory highLimit = Exp({mantissa: collateralFactorMaxMantissa});
        if (lessThanExp(highLimit, newCollateralFactorExp)) {
            return
                fail(
                    Error.INVALID_COLLATERAL_FACTOR,
                    FailureInfo.SET_COLLATERAL_FACTOR_VALIDATION
                );
        }

        if (
            newCollateralFactorMantissa != 0 &&
            oracle.getUnderlyingPrice(bToken) == 0
        ) {
            return
                fail(
                    Error.PRICE_ERROR,
                    FailureInfo.SET_COLLATERAL_FACTOR_WITHOUT_PRICE
                );
        }

        uint256 oldCollateralFactorMantissa = market.collateralFactorMantissa;
        market.collateralFactorMantissa = newCollateralFactorMantissa;

        emit NewCollateralFactor(
            bToken,
            oldCollateralFactorMantissa,
            newCollateralFactorMantissa
        );

        return uint256(Error.NO_ERROR);
    }

    function _setLiquidationIncentive(uint256 newLiquidationIncentiveMantissa)
        external
        returns (uint256)
    {
        // Check caller is admin
        if (msg.sender != admin) {
            return
                fail(
                    Error.UNAUTHORIZED,
                    FailureInfo.SET_LIQUIDATION_INCENTIVE_OWNER_CHECK
                );
        }

        uint256 oldLiquidationIncentiveMantissa = liquidationIncentiveMantissa;

        liquidationIncentiveMantissa = newLiquidationIncentiveMantissa;

        emit NewLiquidationIncentive(
            oldLiquidationIncentiveMantissa,
            newLiquidationIncentiveMantissa
        );

        return uint256(Error.NO_ERROR);
    }

    function _supportMarket(BToken bToken) external returns (uint256) {
        if (msg.sender != admin) {
            return
                fail(
                    Error.UNAUTHORIZED,
                    FailureInfo.SUPPORT_MARKET_OWNER_CHECK
                );
        }

        if (markets[address(bToken)].isListed) {
            return
                fail(
                    Error.MARKET_ALREADY_LISTED,
                    FailureInfo.SUPPORT_MARKET_EXISTS
                );
        }

        bToken.isBToken();

        Market storage market = markets[address(bToken)];
        market.isListed = true;
        market.isComped = false;
        market.collateralFactorMantissa = 0;

        _addMarketInternal(address(bToken));
        _initializeMarket(address(bToken));

        emit MarketListed(bToken);

        return uint256(Error.NO_ERROR);
    }

    function _addMarketInternal(address bToken) internal {
        for (uint256 i = 0; i < allMarkets.length; i++) {
            require(allMarkets[i] != BToken(bToken), "market already added");
        }
        allMarkets.push(BToken(bToken));
    }

    function _initializeMarket(address bToken) internal {
        uint32 blockNumber = safe32(
            getBlockNumber(),
            "block number exceeds 32 bits"
        );

        CompMarketState storage supplyState = compSupplyState[bToken];
        CompMarketState storage borrowState = compBorrowState[bToken];

        if (supplyState.index == 0) {
            supplyState.index = compInitialIndex;
        }

        if (borrowState.index == 0) {
            borrowState.index = compInitialIndex;
        }

        supplyState.block = borrowState.block = blockNumber;
    }

    function _setMarketBorrowCaps(
        BToken[] calldata bTokens,
        uint256[] calldata newBorrowCaps
    ) external {
        require(msg.sender == admin || msg.sender == borrowCapGuardian);

        uint256 numMarkets = bTokens.length;
        uint256 numBorrowCaps = newBorrowCaps.length;

        require(numMarkets != 0 && numMarkets == numBorrowCaps);

        for (uint256 i = 0; i < numMarkets; i++) {
            borrowCaps[address(bTokens[i])] = newBorrowCaps[i];
            emit NewBorrowCap(bTokens[i], newBorrowCaps[i]);
        }
    }

    function _setBorrowCapGuardian(address newBorrowCapGuardian) external {
        require(msg.sender == admin);

        address oldBorrowCapGuardian = borrowCapGuardian;

        borrowCapGuardian = newBorrowCapGuardian;

        emit NewBorrowCapGuardian(oldBorrowCapGuardian, newBorrowCapGuardian);
    }

    function _setPauseGuardian(address newPauseGuardian)
        public
        returns (uint256)
    {
        if (msg.sender != admin) {
            return
                fail(
                    Error.UNAUTHORIZED,
                    FailureInfo.SET_PAUSE_GUARDIAN_OWNER_CHECK
                );
        }
        address oldPauseGuardian = pauseGuardian;

        pauseGuardian = newPauseGuardian;
        emit NewPauseGuardian(oldPauseGuardian, pauseGuardian);

        return uint256(Error.NO_ERROR);
    }

    function _setMintPaused(BToken bToken, bool state) public returns (bool) {
        require(markets[address(bToken)].isListed);
        require(msg.sender == pauseGuardian || msg.sender == admin);
        require(msg.sender == admin || state == true);

        mintGuardianPaused[address(bToken)] = state;
        emit ActionPaused(bToken, "Mint", state);
        return state;
    }

    function _setBorrowPaused(BToken bToken, bool state) public returns (bool) {
        require(markets[address(bToken)].isListed);
        require(msg.sender == pauseGuardian || msg.sender == admin);
        require(msg.sender == admin || state == true);

        borrowGuardianPaused[address(bToken)] = state;
        emit ActionPaused(bToken, "Borrow", state);
        return state;
    }

    function _setTransferPaused(bool state) public returns (bool) {
        require(msg.sender == pauseGuardian || msg.sender == admin);
        require(msg.sender == admin || state == true);

        transferGuardianPaused = state;
        emit ActionPaused("Transfer", state);
        return state;
    }

    function _setSeizePaused(bool state) public returns (bool) {
        require(msg.sender == pauseGuardian || msg.sender == admin);
        require(msg.sender == admin || state == true);

        seizeGuardianPaused = state;
        emit ActionPaused("Seize", state);
        return state;
    }

    function _become(Unitroller unitroller) public {
        require(msg.sender == unitroller.admin());
        require(unitroller._acceptImplementation() == 0);
    }

    function adminOrInitializing() internal view returns (bool) {
        return msg.sender == admin || msg.sender == comptrollerImplementation;
    }

    function setCompSpeedInternal(
        BToken bToken,
        uint256 supplySpeed,
        uint256 borrowSpeed
    ) internal {
        Market storage market = markets[address(bToken)];
        require(market.isListed);

        if (compSupplySpeeds[address(bToken)] != supplySpeed) {
            updateCompSupplyIndex((address(bToken)));

            // Update speed and emit event
            compSupplySpeeds[address(bToken)] = supplySpeed;
            emit CompSupplySpeedUpdated(bToken, supplySpeed);
        }

        if (compBorrowSpeeds[address(bToken)] != borrowSpeed) {
            Exp memory borrowIndex = Exp({mantissa: bToken.borrowIndex()});
            updateCompBorrowIndex(address(bToken), borrowIndex);

            compBorrowSpeeds[address(bToken)] = borrowSpeed;
            emit CompBorrowSpeedUpdated(bToken, borrowSpeed);
        }
    }

    function updateCompSupplyIndex(address bToken) public {
        CompMarketState storage supplyState = compSupplyState[(bToken)];
        uint256 supplySpeed = compSupplySpeeds[(bToken)];
        uint32 blockNumber = safe32(
            getBlockNumber(),
            "block number exceeds 32 bits"
        );
        uint256 deltaBlocks = sub_(
            uint256(blockNumber),
            uint256(supplyState.block)
        );
        if (deltaBlocks > 0 && supplySpeed > 0) {
            uint256 supplyTokens = BToken(bToken).totalSupply();
            uint256 compAccrued = mul_(deltaBlocks, supplySpeed);
            Double memory ratio = supplyTokens > 0
                ? fraction(compAccrued, supplyTokens)
                : Double({mantissa: 0});
            supplyState.index = safe224(
                add_(Double({mantissa: supplyState.index}), ratio).mantissa,
                "new index exceeds 224 bits"
            );
            supplyState.block = blockNumber;
        } else if (deltaBlocks > 0) {
            supplyState.block = blockNumber;
        }
    }

    function updateCompBorrowIndex(address bToken, Exp memory marketBorrowIndex)
        internal
    {
        CompMarketState storage borrowState = compBorrowState[bToken];
        uint256 borrowSpeed = compBorrowSpeeds[bToken];
        uint32 blockNumber = safe32(
            getBlockNumber(),
            "block number exceeds 32 bits"
        );
        uint256 deltaBlocks = sub_(
            uint256(blockNumber),
            uint256(borrowState.block)
        );
        if (deltaBlocks > 0 && borrowSpeed > 0) {
            uint256 borrowAmount = div_(
                BToken(bToken).totalBorrows(),
                marketBorrowIndex
            );
            uint256 compAccrued = mul_(deltaBlocks, borrowSpeed);
            Double memory ratio = borrowAmount > 0
                ? fraction(compAccrued, borrowAmount)
                : Double({mantissa: 0});
            borrowState.index = safe224(
                add_(Double({mantissa: borrowState.index}), ratio).mantissa,
                "new index exceeds 224 bits"
            );
            borrowState.block = blockNumber;
        } else if (deltaBlocks > 0) {
            borrowState.block = blockNumber;
        }
    }

    function distributeSupplierComp(address bToken, address supplier) public {
        CompMarketState storage supplyState = compSupplyState[(bToken)];
        uint256 supplyIndex = supplyState.index;
        uint256 supplierIndex = compSupplierIndex[(bToken)][(supplier)];

        compSupplierIndex[(bToken)][(supplier)] = supplyIndex;

        if (supplierIndex == 0 && supplyIndex >= compInitialIndex) {
            supplierIndex = compInitialIndex;
        }

        Double memory deltaIndex = Double({
            mantissa: sub_(supplyIndex, supplierIndex)
        });

        uint256 supplierTokens = BToken(bToken).balanceOf(supplier);

        uint256 supplierDelta = mul_(supplierTokens, deltaIndex);

        uint256 supplierAccrued = add_(compAccrued[(supplier)], supplierDelta);
        compAccrued[(supplier)] = supplierAccrued;

        emit DistributedSupplierComp(
            BToken(bToken),
            (supplier),
            supplierDelta,
            supplyIndex
        );
    }

    function distributeBorrowerComp(
        address bToken,
        address borrower,
        Exp memory marketBorrowIndex
    ) internal {
        CompMarketState storage borrowState = compBorrowState[bToken];
        uint256 borrowIndex = borrowState.index;
        uint256 borrowerIndex = compBorrowerIndex[bToken][borrower];

        // Update borrowers's index to the current index since we are distributing accrued COMP
        compBorrowerIndex[bToken][borrower] = borrowIndex;

        if (borrowerIndex == 0 && borrowIndex >= compInitialIndex) {
            borrowerIndex = compInitialIndex;
        }

        Double memory deltaIndex = Double({
            mantissa: sub_(borrowIndex, borrowerIndex)
        });

        uint256 borrowerAmount = div_(
            BToken(bToken).borrowBalanceStored(borrower),
            marketBorrowIndex
        );

        // Calculate COMP accrued: cTokenAmount * accruedPerBorrowedUnit
        uint256 borrowerDelta = mul_(borrowerAmount, deltaIndex);

        uint256 borrowerAccrued = add_(compAccrued[borrower], borrowerDelta);
        compAccrued[borrower] = borrowerAccrued;

        emit DistributedBorrowerComp(
            BToken(bToken),
            borrower,
            borrowerDelta,
            borrowIndex
        );
    }

    function updateContributorRewards(address contributor) public {
        uint256 compSpeed = compContributorSpeeds[contributor];
        uint256 blockNumber = getBlockNumber();
        uint256 deltaBlocks = sub_(
            blockNumber,
            lastContributorBlock[contributor]
        );
        if (deltaBlocks > 0 && compSpeed > 0) {
            uint256 newAccrued = mul_(deltaBlocks, compSpeed);
            uint256 contributorAccrued = add_(
                compAccrued[contributor],
                newAccrued
            );

            compAccrued[contributor] = contributorAccrued;
            lastContributorBlock[contributor] = blockNumber;
        }
    }

    function claimComp(address holder) public {
        return claimComp(holder, allMarkets);
    }

    function claimComp(address holder, BToken[] memory bTokens) public {
        address[] memory holders = new address[](1);
        holders[0] = holder;
        claimComp(holders, bTokens, true, true);
    }

    function claimComp(
        address[] memory holders,
        BToken[] memory bTokens,
        bool borrowers,
        bool suppliers
    ) public {
        for (uint256 i = 0; i < bTokens.length; i++) {
            BToken bToken = bTokens[i];
            require(markets[address(bToken)].isListed, "market must be listed");
            if (borrowers == true) {
                Exp memory borrowIndex = Exp({mantissa: bToken.borrowIndex()});
                updateCompBorrowIndex(address(bToken), borrowIndex);
                for (uint256 j = 0; j < holders.length; j++) {
                    distributeBorrowerComp(
                        address(bToken),
                        holders[j],
                        borrowIndex
                    );
                }
            }
            if (suppliers == true) {
                updateCompSupplyIndex((address(bToken)));
                for (uint256 j = 0; j < holders.length; j++) {
                    distributeSupplierComp(address(bToken), holders[j]);
                }
            }
        }
        for (uint256 j = 0; j < holders.length; j++) {
            compAccrued[holders[j]] = grantCompInternal(
                holders[j],
                compAccrued[holders[j]]
            );
        }
    }

    function grantCompInternal(address user, uint256 amount)
        internal
        returns (uint256)
    {
        for (uint256 i = 0; i < allMarkets.length; ++i) {
            address market = address(allMarkets[i]);

            bool noOriginalSpeed = compBorrowSpeeds[market] == 0;
            bool invalidSupply = noOriginalSpeed &&
                compSupplierIndex[market][user] > 0;
            bool invalidBorrow = noOriginalSpeed &&
                compBorrowerIndex[market][user] > 0;

            if (invalidSupply || invalidBorrow) {
                return amount;
            }
        }

        BRU bru = BRU(getCompAddress());
        uint256 compRemaining = bru.balanceOf(address(this));
        if (amount > 0 && amount <= compRemaining) {
            bru.transfer(user, amount);
            return 0;
        }
        return amount;
    }

    function _grantComp(address recipient, uint256 amount) public {
        require(adminOrInitializing(), "only admin can grant comp");
        uint256 amountLeft = grantCompInternal(recipient, amount);
        require(amountLeft == 0, "insufficient comp for grant");
        emit CompGranted(recipient, amount);
    }

    function _setCompSpeeds(
        BToken[] memory bTokens,
        uint256[] memory supplySpeeds,
        uint256[] memory borrowSpeeds
    ) public {
        require(adminOrInitializing());

        uint256 numTokens = bTokens.length;
        require(
            numTokens == supplySpeeds.length && numTokens == borrowSpeeds.length
        );

        for (uint256 i = 0; i < numTokens; ++i) {
            setCompSpeedInternal(bTokens[i], supplySpeeds[i], borrowSpeeds[i]);
        }
    }

    function _setContributorCompSpeed(address contributor, uint256 compSpeed)
        public
    {
        require(adminOrInitializing());

        // note that COMP speed could be set to 0 to halt liquidity rewards for a contributor
        updateContributorRewards(contributor);
        if (compSpeed == 0) {
            // release storage
            delete lastContributorBlock[contributor];
        } else {
            lastContributorBlock[contributor] = getBlockNumber();
        }
        compContributorSpeeds[contributor] = compSpeed;

        emit ContributorCompSpeedUpdated(contributor, compSpeed);
    }

    function getAllMarkets() public view returns (BToken[] memory) {
        return allMarkets;
    }

    function isDeprecated(BToken bToken) public view returns (bool) {
        return
            markets[address(bToken)].collateralFactorMantissa == 0 &&
            borrowGuardianPaused[address(bToken)] == true &&
            bToken.reserveFactorMantissa() == 1e18;
    }

    function getBlockNumber() public view returns (uint256) {
        return block.number;
    }

    function getCompAddress() public pure returns (address) {
        return 0x0fC5025C764cE34df352757e82f7B5c4Df39A836;
    }
}
