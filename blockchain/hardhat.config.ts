import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

console.log("AMOY_URL", process.env.AMOY_URL);
console.log("PRIVATE_KEY", process.env.PRIVATE_KEY);
console.log("POLYGONSCAN_API_KEY", process.env.POLYGONSCAN_API_KEY);

const config: HardhatUserConfig = {
  solidity: "0.8.29",
  networks: {
    amoy: {
      url: process.env.AMOY_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || "",
    },
  },
};

export default config;
