module.exports = async ({getNameAccounts, deployments}) => {
    const {deploy} = deployments
    const {deployer} = await getNameAccounts()

    const rewardToken = await deploy("RewardToken", {
        from: deployer,
        args: [],
        log: true,
    })
}

module.exports.tags = ["all", "rewardToken"]