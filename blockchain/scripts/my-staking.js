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
    const [owner] = await ethers.getSigners();

    const Staking = await ethers.getContractFactory('MyStaking', owner);

    const staking = await Staking.deploy(
        187848,
        {
            value: ethers.utils.parseEther('100')
        }
    );

    const Chainlink = await ethers.getContractFactory('Chainlink', owner);
    chainlink = await Chainlink.deploy();
    const Tether = await ethers.getContractFactory('Tether', owner);
    tether = await Tether.deploy();
    const UsdCoin = await ethers.getContractFactory('UsdCoin', owner);
    usdCoin = await UsdCoin.deploy();
    const WrappedBitcoin = await ethers.getContractFactory('WrappedBitcoin', owner);
    wrappedBitcoin = await WrappedBitcoin.deploy();
    const WrappedEther = await ethers.getContractFactory('WrappedEther', owner);
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

    await chainlink.connect(owner).approve(staking.address, ethers.utils.parseEther('100'));
    await staking.connect(owner).stakeTokens(chainlink.address, ethers.utils.parseEther('100'))

    await tether.connect(owner).approve(staking.address, ethers.utils.parseEther('2'));
    await staking.connect(owner).stakeTokens(tether.address, ethers.utils.parseEther('2'))

    await usdCoin.connect(owner).approve(staking.address, ethers.utils.parseEther('10'));
    await staking.connect(owner).stakeTokens(usdCoin.address, ethers.utils.parseEther('10'))

    await wrappedBitcoin.connect(owner).approve(staking.address, ethers.utils.parseEther('10'));
    await staking.connect(owner).stakeTokens(wrappedBitcoin.address, ethers.utils.parseEther('10'))

    await wrappedEther.connect(owner).approve(staking.address, ethers.utils.parseEther('10'));
    await staking.connect(owner).stakeTokens(wrappedEther.address, ethers.utils.parseEther('10'))


}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });