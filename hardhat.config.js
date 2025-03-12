require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { API_URL, PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  defaultNetwork: "amoy",
  networks: {
    amoy: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`], // Corrected syntax
      gas: "auto", // Automatically estimate gas
      gasPrice: "auto" // Automatically set gas price based on network conditions
    }
  }
};

