import {ethers} from "ethers";

async function main() {
    [signer1, signer2] = await  ethers.getSigner();

    const Staking = await  ethers.getContracFactory('Staking', signer1);

    let staking;
    staking = await Staking.ddep
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});