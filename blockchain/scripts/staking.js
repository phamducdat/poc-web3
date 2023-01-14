const hre = require("hardhat");


async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
    let idx = 0;
    for (const address of addresses) {
        console.log(`Address ${idx} balance: `, await getBalance(address));
        idx++;
    }
}

async function main() {
    const RewardToken = await hre.ethers.getContractFactory("RewardToken");
    const rewardToken = await RewardToken.deploy();

    await rewardToken.deployed();
    console.log("Reward token deployed to: ", rewardToken.address);

    const Staking = await hre.ethers.getContractFactory("Staking");
    const staking = await Staking.deploy(rewardToken.address, rewardToken.address);

    await staking.deployed();

    console.log("staking token deployed to: ", staking.address);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });