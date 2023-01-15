const hre = require("hardhat");


async function main() {
    const [owner] = await hre.ethers.getSigners();

    const MyStaking = await hre.ethers.getContractFactory("MyStaking");
    const myStaking = await MyStaking.deploy();

    await myStaking.deployed();
}


main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });