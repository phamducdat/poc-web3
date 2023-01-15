const {hre, ethers} = require("hardhat");
const {moveTime} = require("../utils/move-time");
const {moveBlocks} = require("../utils/move-block");

const SECONDS_IN_A_DAY = 86400
const SECONDS_IN_A_YEAR = 31449600
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

    const accounts = await ethers.getSigners();
    const deployer = accounts[0];

    const RewardToken = await ethers.getContractFactory("RewardToken");
    const rewardToken = await RewardToken.deploy()
    await rewardToken.deployed();

    const Staking = await ethers.getContractFactory("Staking");
    const staking = await Staking.deploy(rewardToken.address, rewardToken.address);
    await staking.deployed();

    const stakeAmount = ethers.utils.parseEther("2");


    // Stake
    await rewardToken.approve(staking.address, stakeAmount)
    await staking.stake(stakeAmount);
    const startingEarned = await staking.earned(deployer.address);
    console.log("Starting Earned ", startingEarned)

    await moveTime(SECONDS_IN_A_DAY)
    await moveBlocks(1)
    const endingEarned = await staking.earned(deployer.address);
    console.log("Starting ending ", endingEarned)


}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });