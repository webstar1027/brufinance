// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BToken.sol";

contract PriceOracle {
    // @notice Indicator that this is a PriceOracle contract (for inspection)
    bool public constant isPriceOracle = true;

    mapping(address => uint256) prices;
    event PricePosted(
        address asset,
        uint256 previousPriceMantissa,
        uint256 requestedPriceMantissa,
        uint256 newPriceMantissa
    );

    function _getUnderlyingAddress(BToken bToken)
        internal
        view
        returns (address)
    {
        address asset;
        if (compareStrings(bToken.symbol(), "BTKN")) {
            asset = 0xaa4B45A5280BbA44b2A3C84ADf85E00256a58E3a;
        } else {
            asset = address(BToken(address(bToken)).underlying());
        }
        return asset;
    }

    /*
     * @notice Get the underlying price of a bToken asset
     * @param bToken The bToken to get the underlying price of
     * @return The underlying asset price mantissa (scaled by 1e18).
     *  Zero means the price is unavailable.
     */
    function getUnderlyingPrice(BToken bToken) public view returns (uint256) {
        return prices[_getUnderlyingAddress(bToken)];
    }

    function setUnderlyingPrice(BToken bToken, uint256 underlyingPriceMantissa)
        public
    {
        address asset = _getUnderlyingAddress(bToken);
        emit PricePosted(
            asset,
            prices[asset],
            underlyingPriceMantissa,
            underlyingPriceMantissa
        );
        prices[asset] = underlyingPriceMantissa;
    }

    function setDirectPrice(address asset, uint256 price) public {
        emit PricePosted(asset, prices[asset], price, price);
        prices[asset] = price;
    }

    // v1 price oracle interface for use as backing of proxy
    function assetPrices(address asset) external view returns (uint256) {
        return prices[asset];
    }

    function compareStrings(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
