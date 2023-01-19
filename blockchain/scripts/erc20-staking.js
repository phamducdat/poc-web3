const {ethers} = require("hardhat");


async function main() {
    const [owner] = await ethers.getSigners();

    const Staking = await ethers.getContractFactory('Staking', owner);

    const staking = await Staking.deploy(187848, {
        value: ethers.utils.parseEther('100')
    });

    const Chainlink = await ethers.getContractFactory('Chainlink', owner);          const  chainlink = await Chainlink.deploy();
    const Tether = await ethers.getContractFactory('Tether', owner);                const  tether = await Tether.deploy();
    const UsdCoin = await ethers.getContractFactory('UsdCoin', owner);               const usdCoin = await UsdCoin.deploy();
    const WrappedBitcoin = await ethers.getContractFactory('WrappedBitcoin', owner);  const wrappedBitcoin = await WrappedBitcoin.deploy();
    const WrappedEther = await ethers.getContractFactory('WrappedEther', owner);     const wrappedEther = await WrappedEther.deploy();

    await staking.connect(owner).addToken('Chainlink',     'LINK', chainlink.address, 867, 1500);
    await staking.connect(owner).addToken('Tether',        'USDT', tether.address, 100, 200);
    await staking.connect(owner).addToken('UsdCoin',       'USDC', usdCoin.address, 100, 200, );
    await staking.connect(owner).addToken('WrappedBitcoin','WBTC', wrappedBitcoin.address, 2382096, 500);
    await staking.connect(owner).addToken('WrappedEther',  'WETH', wrappedEther.address, 187848, 1000);

    console.log("Staking:",        staking.address);
    console.log("Chainlink:",      chainlink.address);
    console.log("Tether:",         tether.address);
    console.log("UsdCoin:",        usdCoin.address);
    console.log("WrappedBitcoin:", wrappedBitcoin.address);
    console.log("WrappedEther:",   wrappedEther.address);


    await chainlink.connect(owner).approve(staking.address, ethers.utils.parseEther('100'));
    await staking.connect(owner).stakeTokens('LINK',ethers.utils.parseEther('100'))

    // await wrappedBitcoin.connect(owner).approve(staking.address, ethers.utils.parseEther('2'));
    // await staking.connect(owner).stakeTokens('WBTC',ethers.utils.parseEther('2'))
    //
    // await wrappedBitcoin.connect(owner).approve(staking.address, ethers.utils.parseEther('10'));
    // await staking.connect(owner).stakeTokens('WBTC',ethers.utils.parseEther('10'))
    //
    // await wrappedEther.connect(owner).approve(staking.address, ethers.utils.parseEther('10'));
    // await staking.connect(owner).stakeTokens('WETH',ethers.utils.parseEther('10'))

    const provider = ethers.provider
    const block = await provider.getBlock()
    const newCreatedDate = block.timestamp - (86400 * 365)
    await staking.connect(owner).modifyCreatedDate(1, newCreatedDate)
    await staking.connect(owner).modifyCreatedDate(2, newCreatedDate)
    await staking.connect(owner).modifyCreatedDate(3, newCreatedDate)
}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
