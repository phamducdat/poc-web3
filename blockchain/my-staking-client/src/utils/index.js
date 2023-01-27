import {ethers} from "ethers";
import {Link} from "react-router-dom";
import {Button, Col, message, Row} from "antd";
import {CopyOutlined} from "@ant-design/icons";

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

export const toEther = wei => Number(ethers.utils.formatEther(String(wei))).toFixed(10);

export const LinkToAddressToken = (tokenAddress) => {
    return <Row gutter={12} justify={"space-between"}>
        <Col>
            <Link to={`https://etherscan.io/token/${tokenAddress}`}
                  target={"_blank"}
            >
                {tokenAddress}
            </Link>

        </Col>
        <Col>
            <Button icon={<CopyOutlined/>}
                    onClick={() => {
                        navigator.clipboard.writeText(tokenAddress)
                        message.success(`Copied ${tokenAddress}`)
                    }}
                    type={"text"}/>
        </Col>
    </Row>
}
