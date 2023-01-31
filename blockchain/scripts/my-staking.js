const {ethers} = require("hardhat");
const hre = require("hardhat");
const {moveTime} = require("../utils/move-time");

async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
    const [owner, account1] = await ethers.getSigners();

    const Staking = await ethers.getContractFactory('MyStaking', owner);

    const staking = await Staking.deploy(
        187848,
        {
            value: ethers.utils.parseEther('0.1')
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




    console.log("REACT_APP_CONTRACT_ADDRESS="  + staking.address );
    console.log("REACT_APP_LINK_ADDRESS=" + chainlink.address );
    console.log("REACT_APP_USDT_ADDRESS=" + tether.address );
    console.log("REACT_APP_USDC_ADDRESS="+ usdCoin.address);
    console.log("REACT_APP_WBTC_ADDRESS="+ wrappedBitcoin.address);
    console.log("REACT_APP_WETH_ADDRESS="+ wrappedEther.address);

    await chainlink.connect(owner).approve(staking.address, ethers.utils.parseEther('100'));
    await staking.connect(owner).stakeTokens(chainlink.address, ethers.utils.parseEther('100'))

    await tether.connect(owner).approve(staking.address, ethers.utils.parseEther('2'));
    await staking.connect(owner).stakeTokens(tether.address, ethers.utils.parseEther('2'))

    await usdCoin.connect(owner).approve(staking.address, ethers.utils.parseEther('10'));
    await staking.connect(owner).stakeTokens(usdCoin.address, ethers.utils.parseEther('10'))

    await wrappedBitcoin.connect(owner).approve(staking.address, ethers.utils.parseEther('0.01'));
    await staking.connect(owner).stakeTokens(wrappedBitcoin.address, ethers.utils.parseEther('0.01'))

    await wrappedEther.connect(owner).approve(staking.address, ethers.utils.parseEther('0.01'));
    await staking.connect(owner).stakeTokens(wrappedEther.address, ethers.utils.parseEther('0.01'))

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