const { ethers} = require("hardhat");
const {moveTime} = require("../utils/move-time");
const {moveBlocks} = require("../utils/move-block");

const SECONDS_IN_A_DAY = 86400
const SECONDS_IN_A_YEAR = 31449600

async function getBalance(address) {
    const balanceBigInt = await ethers.provider.getBalance(address);
    return ethers.utils.formatEther(balanceBigInt);
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

    const [deployer,account1] = await ethers.getSigners();

    const RewardToken = await ethers.getContractFactory("RewardToken");
    const rewardToken = await RewardToken.deploy();
    await rewardToken.deployed();


    const Staking = await ethers.getContractFactory("Staking");
    const staking = await Staking.deploy(rewardToken.address, rewardToken.address);
    await staking.deployed();

    const stakeAmount = ethers.utils.parseEther("2");
    const totalTransferForAccount1 = ethers.utils.parseEther("1");


    await rewardToken.connect(deployer).approve(staking.address, stakeAmount);
    await rewardToken.transfer(account1.address, totalTransferForAccount1)
    await rewardToken.connect(account1).approve(staking.address, totalTransferForAccount1)




    await staking.connect(deployer).stake(stakeAmount);
    // await staking.connect(account1).stake(totalTransferForAccount1)
    await moveTime(SECONDS_IN_A_DAY)
    await moveBlocks(1)
    console.log("Balance before deployer = ", await rewardToken.balanceOf(deployer.address))
    console.log("===========")
    console.log("Balance before account1 = ", await rewardToken.balanceOf(account1.address))


    console.log("==============Withdraw============")
    // Withdraw
    await staking.connect(deployer).claimReward()
    await staking.connect(account1).claimReward()
    // await staking.connect(deployer).withdraw(stakeAmount)
    // await staking.connect(account1).withdraw(totalTransferForAccount1)
    console.log("Balance after deployer = ", await rewardToken.balanceOf(deployer.address))
    console.log("===========")
    console.log("Balance after account1 = ", await rewardToken.balanceOf(account1.address))






}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });