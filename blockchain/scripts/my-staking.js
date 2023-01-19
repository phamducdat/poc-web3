const {ethers} = require("hardhat");
const hre = require("hardhat");
const {moveTime} = require("../utils/move-time");

const SECONDS_IN_30_DAY = 2592000
const SECONDS_IN_90_DAY = 7776000
const SECONDS_IN_180_DAY = 15552000

async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
    const [owner, account] = await ethers.getSigners();
    const Staking = await ethers.getContractFactory("MyStaking", owner);

    const staking = await Staking.deploy({value: ethers.utils.parseEther('200')});
    await staking.deployed();

    console.log("Staking's address = ", staking.address, owner.address)

    // 0x5FbDB2315678afecb367f032d93F642f64180aa3
    console.log("Balance of account before = ", await getBalance(account.address));
    console.log("===========================")
    const totalStakeEther = ethers.utils.parseEther('100');
    await staking.connect(account).stakeEther(180, {value: totalStakeEther});
    // console.log("Balance of account after = ", await getBalance(account.address))
    //
    // console.log("===========================")
    // await moveTime(SECONDS_IN_180_DAY)
    // console.log("===========================")
    // await staking.connect(account).closePosition(0);
    // console.log("Balance of account after 180 days = ", await getBalance(account.address))

    console.log("===========================")
    await staking.withdraw(ethers.utils.parseEther('100'))
    console.log("Balance of owner = ", await getBalance(owner.address))
    console.log("Balance of stakePool = ", await staking.getBalanceOfStaked())


}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });