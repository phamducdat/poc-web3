const {ethers} = require("hardhat");
const hre = require("hardhat");
const {moveTime} = require("../utils/move-time");


async function main() {
    const [owner, account1] = await ethers.getSigners();

    const Staking = await ethers.getContractFactory('Staking', owner);

    const TokenReward = await ethers.getContractFactory('TokenReward', owner);
    const tokenReward = await TokenReward.deploy();


    const staking = await Staking.deploy(
        tokenReward.address,
        1
    );

    await tokenReward.connect(owner).approve(staking.address,ethers.utils.parseEther('1'))

    const Chainlink = await ethers.getContractFactory('Chainlink', owner);
    const chainlink = await Chainlink.deploy();
    const Tether = await ethers.getContractFactory('Tether', owner);
    const tether = await Tether.deploy();
    const UsdCoin = await ethers.getContractFactory('UsdCoin', owner);
    const usdCoin = await UsdCoin.deploy();
    const WrappedBitcoin = await ethers.getContractFactory('WrappedBitcoin', owner);
    const wrappedBitcoin = await WrappedBitcoin.deploy();
    const WrappedEther = await ethers.getContractFactory('WrappedEther', owner);
    const wrappedEther = await WrappedEther.deploy();
    //
    await staking.connect(owner).addToken(chainlink.address,'Chainlink', 'LINK', 1, 1500);
    await staking.connect(owner).addToken(tether.address,"Tether", 'USDT', 2, 200);
    await staking.connect(owner).addToken(usdCoin.address,"UsdCoin", 'USDC', 3, 200,);
    await staking.connect(owner).addToken(wrappedBitcoin.address,"WrappedBitcoin", 'WBTC', 4, 500);
    await staking.connect(owner).addToken(wrappedEther.address,"WrappedEther", 'WETH', 5, 1000);




    console.log("REACT_APP_CONTRACT_ADDRESS="  + staking.address );
    console.log("REACT_APP_LINK_ADDRESS=" + chainlink.address );
    console.log("REACT_APP_USDT_ADDRESS=" + tether.address );
    console.log("REACT_APP_USDC_ADDRESS="+ usdCoin.address);
    console.log("REACT_APP_WBTC_ADDRESS="+ wrappedBitcoin.address);
    console.log("REACT_APP_WETH_ADDRESS="+ wrappedEther.address);

    await chainlink.connect(owner).approve(staking.address, ethers.utils.parseEther('100'));
    await staking.connect(owner).stakeTokens(chainlink.address, ethers.utils.parseEther('100'),1)

    await tether.connect(owner).approve(staking.address, ethers.utils.parseEther('2'));
    await staking.connect(owner).stakeTokens(tether.address, ethers.utils.parseEther('2'), 2)

    await usdCoin.connect(owner).approve(staking.address, ethers.utils.parseEther('10'));
    await staking.connect(owner).stakeTokens(usdCoin.address, ethers.utils.parseEther('10'), 3)

    await wrappedBitcoin.connect(owner).approve(staking.address, ethers.utils.parseEther('0.01'));
    await staking.connect(owner).stakeTokens(wrappedBitcoin.address, ethers.utils.parseEther('0.01'),4)

    await wrappedEther.connect(owner).approve(staking.address, ethers.utils.parseEther('0.01'));
    await staking.connect(owner).stakeTokens(wrappedEther.address, ethers.utils.parseEther('0.01'),5)

    const provider = waffle.provider;

    const block = await provider.getBlock()
    const newCreatedDate = block.timestamp - (8640)
    await staking.connect(owner).modifyCreatedDate(1, newCreatedDate)
    await staking.connect(owner).modifyCreatedDate(2, newCreatedDate)
    await staking.connect(owner).modifyCreatedDate(3, newCreatedDate)
    await staking.connect(owner).modifyCreatedDate(4, newCreatedDate)
    await staking.connect(owner).modifyCreatedDate(5, newCreatedDate)


}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });