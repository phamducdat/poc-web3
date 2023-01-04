const hre = require("hardhat");

// Returns the Ether balance of a given address.

async function main() {
    // Get the example accounts we'll be working with.
    const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

    const Staking = await hre.ethers.getContractFactory("Staking");
    const staking = await Staking.deploy();

    // Deploy the contract.
    await staking.deployed()
    console.log("Staking deployed to: ", staking.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });