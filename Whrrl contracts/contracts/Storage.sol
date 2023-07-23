pragma solidity ^0.5.0;

contract Storage {
    struct ActiveAddress {
        address quorumAddress;
        bool isActive;
    }

    // mapping of metamask address with farmer/quorum address
    mapping(address => ActiveAddress) public linkedAddresses;

    // mappping of farmer/quorum address with metamask address
    mapping(address => address) public inverseLinkedAddresses;

    //mapping for storing receipts related witha farmer/quorum address
    mapping(address => address[]) internal userReceipts;

    function linkAddress(address metamaskAddress, address quorumAddress)
        external
    {
        require(
            linkedAddresses[metamaskAddress].isActive == false,
            "already linked"
        );
        linkedAddresses[metamaskAddress] = ActiveAddress(quorumAddress, true);
        inverseLinkedAddresses[quorumAddress] = metamaskAddress;
    }

    function updateLinkedAddress(
        address oldMetamaskAddress,
        address newMetamaskAddress,
        address quorumAddress
    ) external {
        require(
            linkedAddresses[oldMetamaskAddress].isActive == true,
            "account is not linked"
        );
        linkedAddresses[oldMetamaskAddress].isActive = false;
        linkedAddresses[newMetamaskAddress] = ActiveAddress(
            quorumAddress,
            true
        );
        inverseLinkedAddresses[quorumAddress] = newMetamaskAddress;
    }

    function addReceipt(address userAddress, address receiptAddress) public {
        userReceipts[userAddress].push(receiptAddress);
    }

    function addReceipts(
        address userAddress,
        address[] calldata receiptAddresses
    ) external {
        for (uint256 i = 0; i < receiptAddresses.length; i++) {
            addReceipt(userAddress, receiptAddresses[i]);
        }
    }

    function getReceipts(address userAddress)
        public
        view
        returns (address[] memory)
    {
        return userReceipts[userAddress];
    }
}

contract AssetInformationOnNetwork {
    struct AssetInformation {
        address assetAddress;
        bool bridgedToNetwork;
        bool borrowedOnBridgedNetwork;
        uint bridgedQuantiy;
    }

    // mapping for storing addresses of assets available/minted on polygon
    mapping(address => AssetInformation) public assetInformation;

    function bridgeAssetToNetwork(address assetAddress, uint256 bridgedQuantity)
        external
    {
        assetInformation[assetAddress] = AssetInformation(
            assetAddress,
            true,
            false,
            bridgedQuantity
        );
    }

    // function updateBridgeStatusOfAsset(address assetAddress, bool bridgeStatus)
    //     external
    // {
    //     assetInformation[assetAddress].bridgedToNetwork = bridgeStatus;
    // }

    function updateBorrowStatusOfAsset(address assetAddress, bool borrowStatus)
        external
    {
        assetInformation[assetAddress].borrowedOnBridgedNetwork = borrowStatus;
    }
}
