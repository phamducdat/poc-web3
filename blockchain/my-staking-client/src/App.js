import React from 'react';
import {Content} from "antd/es/layout/layout";
import {Card, Layout, Space} from "antd";
import EthereumMarket from "./components/ethereum-market";

const CONTRACT_ADDRESS = '0x95401dc811bb5740090279Ba06cfA8fcF6113778'
const LINK_ADDRESS = '0x998abeb3E57409262aE5b751f60747921B33613E'
const USDT_ADDRESS = '0x59b670e9fA9D0A427751Af201D676719a970857b'
const USDC_ADDRESS = '0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1'
const WBTC_ADDRESS = '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44'
const WETH_ADDRESS = '0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f'
const App = props => {
    return (
        <Layout style={{backgroundColor:"#f5f5f5"}}>
            <Content style={{textAlign: 'center'}}>
                <Space direction={"vertical"}>
                    <Card>
                        <EthereumMarket/>
                    </Card>
                    <Card>
                        test
                    </Card>
                </Space>
            </Content>
        </Layout>
    );
};

App.propTypes = {};

export default App;