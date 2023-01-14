const hre = require("hardhat");


async function main() {

    const RewardToken = await hre.ethers.getContractFactory("RewardToken");
    const rewardToken = await RewardToken.deploy();

    await rewardToken.deployed();
    console.log("Reward token deployed to: ", rewardToken.address);

}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });