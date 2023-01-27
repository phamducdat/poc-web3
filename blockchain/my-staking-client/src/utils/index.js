import {ethers} from "ethers";
import {Link} from "react-router-dom";

export const displayLogo = symbol => {


    if (symbol === 'LINK') {
        return (<><img className="logoImg" src="link.png" alt={"link"}/></>)
    } else if (symbol === 'USDT') {
        return (<><img className="logoImg" src="usdt.png" alt={"usdt"}/></>)
    } else if (symbol === 'USDC') {
        return (<><img className="logoImg" src="usdc.png" alt={"usdc"}/></>)
    } else if (symbol === 'WBTC') {
        return (<><img className="logoImg" src="wbtc.png" alt={"wbtc"}/></>)
    } else if (symbol === 'WETH') {
        return (<><img className="logoImg" src="eth.png" alt={"eth"}/></>)
    }
}

export const toEther = wei => Number(ethers.utils.formatEther(String(wei))).toFixed(2);

export const LinkToAddressToken = (tokenAddress) => {
    return   <Link to={`https://etherscan.io/token/${tokenAddress}`}
    target={"_blank"}
    >
        {tokenAddress}
    </Link>
}
