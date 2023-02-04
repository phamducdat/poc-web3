import {ethers} from "ethers";
import {Link} from "react-router-dom";
import {Button, Col, message, Row, Tag} from "antd";
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

export const displayPeriod = (period) => {
    const numberDays = Number(period)
    switch (numberDays) {
        case 0:
            return <Tag>
                Unlimited
            </Tag>
        case 30:
            return <Tag>
                1 month
            </Tag>
        case 180:
            return <Tag>
                6 months
            </Tag>
        case 365:
            return <Tag>
                1 year
            </Tag>
        default:
            return  null;

    }
}

export const toEther = wei => {
    try {

        return Number(ethers.utils.formatEther(wei)).toFixed(2)
    } catch (error) {
        return error.message;
    }

};


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
