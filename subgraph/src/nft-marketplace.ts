import {
  ListingCancelled,
  ListingCreated,
  ListingPurchased,
  ListingUpdated,
} from "../generated/NFTMarketplace/NFTMarketplace";
import { store } from "@graphprotocol/graph-ts";
import { ListingEntity } from "../generated/schema";

export function handleListingCreated(event: ListingCreated): void {
  // Unique Id with a combination of variables
  const id =
    event.params.nftAddress.toHex() +
    "-" +
    event.params.tokenId.toString() +
    "-" +
    event.params.seller.toHex();

  // Create a new listing and assign it's ID
  let listing = new ListingEntity(id);

  // Set properties
  listing.seller = event.params.seller;
  listing.nftAddress = event.params.nftAddress;
  listing.tokenId = event.params.tokenId;
  listing.price = event.params.price;

  // Save the Listing
  listing.save();
}
export function handleListingCancelled(event: ListingCancelled): void {
  // Recreate the ID again
  const id =
    event.params.nftAddress.toHex() +
    "-" +
    event.params.tokenId.toString() +
    "-" +
    event.params.seller.toHex();

  let listing = ListingEntity.load(id);

  // If the Listing exists, remove it
  if (listing) {
    store.remove("ListingEntity", id);
  }
}
export function handleListingPurchased(event: ListingPurchased): void {
  // Get the ID
  const id =
    event.params.nftAddress.toHex() +
    "-" +
    event.params.tokenId.toString() +
    "-" +
    event.params.seller.toHex();

  let listing = ListingEntity.load(id);

  // If the listing exist, update the buyer and save
  if (listing) {
    listing.buyer = event.params.buyer;
    listing.save();
  }
}
export function handleListingUpdated(event: ListingUpdated): void {
  // Recreate the ID
  const id =
    event.params.nftAddress.toHex() +
    "-" +
    event.params.tokenId.toString() +
    "-" +
    event.params.seller.toHex();

  // Get the existing listing from ID
  let listing = ListingEntity.load(id);

  // If listing exists, update the price and save
  if (listing) {
    listing.price = event.params.newPrice;
    listing.save();
  }
}
