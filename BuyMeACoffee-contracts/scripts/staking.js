const hre = require("hardhat");

// Returns the Ether balance of a given address.

async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}
async function printBalances(addresses) {
    let idx = 0;
    for (const address of addresses) {
        console.log(`Address ${idx} balance: `, await getBalance(address));
        idx ++;
    }
}
async function main() {
    // Get the example accounts we'll be working with.
    const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

    const Staking = await hre.ethers.getContractFactory("Staking");
    const staking = await Staking.deploy();

    // Deploy the contract.
    await staking.deployed()
    console.log("Staking deployed to: ", staking.address)

    const addresses = [owner.address, tipper.address, staking.address];
    console.log("== start ==");
    await printBalances(addresses);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });