const hre = require("hardhat");


async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
    let idx = 0;
    for (const address of addresses) {
        console.log(`Address ${idx} balance: `, await getBalance(address));
        idx ++;
    }
}
async function main() {
    const [owner] = await hre.ethers.getSigners();
    const ownerAddress = owner.address;


    console.log("dat with getBalance = ", await getBalance(ownerAddress))

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });