import React from "react";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAccount, useContract, useProvider } from "wagmi";
import { erc721ABI } from "wagmi";
import styles from "../styles/Listing.module.css";
import { formatEther } from "ethers/lib/utils";

const Listing: NextPage<any> = (props) => {
  // State variables to hold information about the NFT
  const [imageURI, setImageURI] = useState("");
  const [name, setName] = useState("");

  // Loading state
  const [loading, setLoading] = useState(true);

  // Get the provider, connected address, and a contract instance
  // for the NFT contract using wagmi
  const provider = useProvider();
  const { address } = useAccount();
  const ERC721Contract = useContract({
    addressOrName: props.nftAddress,
    contractInterface: erc721ABI,
    signerOrProvider: provider,
  });

  // Check if the NFT seller is the connected user
  const isOwner = address?.toLowerCase() === props.seller.toLowerCase();

  // Fetch NFT details by resolving the token URI
  async function fetchNFTDetails() {
    try {
      // Get token URI from contract
      let tokenURI = await ERC721Contract.tokenURI(0);
      // If it's an IPFS URI, replace it with an HTTP Gateway link
      tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");

      // Resolve the Token URI
      const metadata = await fetch(tokenURI);
      const metadataJSON = await metadata.json();

      // Extract image URI from the metadata
      let image = metadataJSON.imageUrl;
      // If it's an IPFS URI, replace it with an HTTP Gateway link
      image = image.replace("ipfs://", "https://ipfs.io/ipfs/");

      // Update state variables
      setName(metadataJSON.name);
      setImageURI(image);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  // Fetch the NFT details when component is loaded
  useEffect(() => {
    fetchNFTDetails();
  }, []);

  return (
    <div>
      {loading ? (
        <span>Loading...</span>
      ) : (
        <div className={styles.card}>
          <img src={imageURI} />
          <div className={styles.container}>
            <span>
              <b>
                {name} - #{props.tokenId}
              </b>
            </span>
            <span>Price: {formatEther(props.price)} CELO</span>
            <span>
              Seller: {isOwner ? "You" : props.seller.substring(0, 6) + "..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Listing;
