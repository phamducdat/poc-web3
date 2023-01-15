const {ethers} = require("hardhat");
const hre = require("hardhat");
const {moveTime} = require("../utils/move-time");

async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
    const [owner, account] = await ethers.getSigners();
    const Staking = await ethers.getContractFactory("MyStaking", owner);

    const staking = await Staking.deploy({value: ethers.utils.parseEther('200')});
    await staking.deployed();

    console.log("Balance of account before = ", await getBalance(account.address));
    console.log("===========================")
    const totalStakeEther = ethers.utils.parseEther('100');
    await staking.connect(account).stakeEther(180, {value:totalStakeEther});
    console.log("Balance of account after = ", await getBalance(account.address))
    // console.log("Position before 30 day = ", await staking.positions(0)) ;

    console.log("===========================")
    await moveTime(17280001)
    console.log("===========================")
    await staking.connect(account).closePosition(0);
    // console.log("Position after 30 day = ", await staking.positions(0)) ;
    console.log("Balance of account after 200 days = ", await getBalance(account.address))

    
    
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });