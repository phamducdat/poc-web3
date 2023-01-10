require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle")
require("hardhat-deploy")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  nameAccounts: {
    deployer: {
      default: 0, // ethers built in accounts at index 0
    }
  }
};
