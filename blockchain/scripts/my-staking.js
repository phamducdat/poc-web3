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
    const [owner, datpd] = await ethers.getSigners();

    const Staking = await ethers.getContractFactory('MyStaking', owner);

    const staking = await Staking.deploy(
        187848,
        {
            value: ethers.utils.parseEther('100')
        }
    );

    const Chainlink = await ethers.getContractFactory('Chainlink', datpd);
    chainlink = await Chainlink.deploy();
    const Tether = await ethers.getContractFactory('Tether', datpd);
    tether = await Tether.deploy();
    const UsdCoin = await ethers.getContractFactory('UsdCoin', datpd);
    usdCoin = await UsdCoin.deploy();
    const WrappedBitcoin = await ethers.getContractFactory('WrappedBitcoin', datpd);
    wrappedBitcoin = await WrappedBitcoin.deploy();
    const WrappedEther = await ethers.getContractFactory('WrappedEther', datpd);
    wrappedEther = await WrappedEther.deploy();

    await staking.connect(owner).addToken('Chainlink', 'LINK', chainlink.address, 867, 1500);
    await staking.connect(owner).addToken('Tether', 'USDT', tether.address, 100, 200);
    await staking.connect(owner).addToken('UsdCoin', 'USDC', usdCoin.address, 100, 200,);
    await staking.connect(owner).addToken('WrappedBitcoin', 'WBTC', wrappedBitcoin.address, 2382096, 500);
    await staking.connect(owner).addToken('WrappedEther', 'WETH', wrappedEther.address, 187848, 1000);

    console.log("Staking:", staking.address);
    console.log("Chainlink:", chainlink.address);
    console.log("Tether:", tether.address);
    console.log("UsdCoin:", usdCoin.address);
    console.log("WrappedBitcoin:", wrappedBitcoin.address);
    console.log("WrappedEther:", wrappedEther.address);

    await chainlink.connect(datpd).approve(staking.address, ethers.utils.parseEther('50'));
    await staking.connect(datpd).stakeTokens(chainlink.address, ethers.utils.parseEther('50'))
    console.log("balance of datpd = ", await getBalance(datpd.address))

    await staking.connect(datpd).closePosition(1);

    console.log("balance of datpd = ", await getBalance(datpd.address))


}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });