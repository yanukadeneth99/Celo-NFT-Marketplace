//SPDX-License-Identifier:MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarketplace {
    /// @notice The Object which contains a listing
    struct Listing {
        uint256 price;
        address seller;
    }

    /// @dev Contract Address => (TokenID => Listing Data)
    mapping(address => mapping(uint256 => Listing)) public listings;

    /// @notice Event triggered when a listing is created
    event ListingCreated(
        address nftAddress,
        uint256 tokenId,
        uint256 price,
        address seller
    );

    /// @notice Event triggered when the listing is cancelled
    event ListingCancelled(address nftAddress, uint256 tokenId, address seller);

    /// @notice Event triggered when an existing even updates
    event ListingUpdated(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice,
        address seller
    );

    /// @notice Event triggered when a person buys an NFT
    event ListingPurchased(
        address nftAddress,
        uint256 tokenId,
        address seller,
        address buyer
    );

    /// @notice Checks whether the tokenID of that contract address is owned by the caller
    modifier isNFTOwner(address nftAddress, uint256 tokenId) {
        require(
            IERC721(nftAddress).ownerOf(tokenId) == msg.sender,
            "MRKT: Not the Owner!"
        );
        _;
    }

    /// @notice Checks whether the NFT is not already listed here
    modifier isNotListed(address nftAddress, uint256 tokenId) {
        require(
            listings[nftAddress][tokenId].price == 0,
            "MRKT: Already listed!"
        );
        _;
    }

    /// @notice Checks whether the NFT is already listed here
    modifier isListed(address nftAddress, uint256 tokenId) {
        require(listings[nftAddress][tokenId].price > 0, "MRKT: Not listed");
        _;
    }

    /// @notice Create a Listing if the price is above zero and the tokenID does not exist
    function createListing(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    )
        external
        isNotListed(nftAddress, tokenId)
        isNFTOwner(nftAddress, tokenId)
    {
        require(price >= 0, "MRKT: Price must be > 0");

        IERC721 nftContract = IERC721(nftAddress);
        require(
            nftContract.isApprovedForAll(msg.sender, address(this)) ||
                nftContract.getApproved(tokenId) == address(this),
            "MRKT: No approval for NFT!"
        );

        listings[nftAddress][tokenId] = Listing({
            price: price,
            seller: msg.sender
        });

        emit ListingCreated(nftAddress, tokenId, price, msg.sender);
    }

    /// @notice Cancel and Already listed event
    function cancelListing(address nftAddress, uint256 tokenId)
        external
        isListed(nftAddress, tokenId)
        isNFTOwner(nftAddress, tokenId)
    {
        delete listings[nftAddress][tokenId];
        emit ListingCancelled(nftAddress, tokenId, msg.sender);
    }

    /// @notice Updating an Exising listing
    function updateListing(
        address nftAddress,
        uint256 tokenId,
        uint256 newPrice
    ) external isListed(nftAddress, tokenId) isNFTOwner(nftAddress, tokenId) {
        require(newPrice > 0, "MRKT: Price must be > 0");
        listings[nftAddress][tokenId].price = newPrice;
        emit ListingUpdated(nftAddress, tokenId, newPrice, msg.sender);
    }

    /// @notice Purchasing an existing Listing
    function purchaseListing(address nftAddress, uint256 tokenId)
        external
        payable
        isListed(nftAddress, tokenId)
    {
        Listing memory listing = listings[nftAddress][tokenId];
        require(msg.value == listing.price, "MRKT: Incorrect Eth Supplied!");
        IERC721(nftAddress).safeTransferFrom(
            listing.seller,
            msg.sender,
            tokenId
        );
        (bool sent, ) = payable(listing.seller).call{value: msg.value}("");
        require(sent, "Failed to transfer eth");
        delete listings[nftAddress][tokenId];
        emit ListingPurchased(nftAddress, tokenId, listing.seller, msg.sender);
    }
}
