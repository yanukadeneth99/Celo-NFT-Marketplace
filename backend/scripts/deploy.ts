import { ethers } from "hardhat";

async function main() {
  // Load the NFT contract artifacts
  const CeloNFTFactory = await ethers.getContractFactory("CeloNFT");

  // Deploy the contract
  const celoNftContract = await CeloNFTFactory.deploy();
  await celoNftContract.deployed();

  // Print the address of the NFT contract
  console.log("Celo NFT deployed to:", celoNftContract.address);

  // Load the marketplace contract artifacts
  const NFTMarketplaceFactory = await ethers.getContractFactory(
    "NFTMarketplace"
  );

  // Deploy the contract
  const nftMarketplaceContract = await NFTMarketplaceFactory.deploy();

  // Wait for deployment to finish
  await nftMarketplaceContract.deployed();

  // Log the address of the new contract
  console.log("NFT Marketplace deployed to:", nftMarketplaceContract.address);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

//Celo NFT deployed to: 0x89A57A47D6CE051076C914EEBBA8607e8E3aCc3A
//NFT Marketplace deployed to: 0x627f152f97d431B844604B4421313CA979712006

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
