import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    alfajores: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY as string],
    },
  },
};

export default config;
