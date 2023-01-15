const {ethers} = require("hardhat");


async function main() {
   const [signer1, signer2] = await ethers.getSigners();
   const Staking = await ethers.getContractFactory("MyStaking", signer1);

   const staking = await Staking.deploy({value: ethers.utils.parseEther('10')});
   await staking.deployed();
    console.log("dat with staking = ", await staking.owner());
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });