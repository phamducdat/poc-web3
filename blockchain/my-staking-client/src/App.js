import React, {createContext, useContext, useEffect, useState} from 'react';
import {Content} from "antd/es/layout/layout";
import {Card, Layout, Space} from "antd";
import EthereumMarket from "./components/ethereum-market";
import StakedAssets from "./components/staked-assets";
import {ethers} from "ethers";
import artifact from "./artifacts/contracts/MyStaking.sol/MyStaking.json";

const CONTRACT_ADDRESS = '0x0165878A594ca255338adfa4d48449f69242Eb8F'
const LINK_ADDRESS = '0x998abeb3E57409262aE5b751f60747921B33613E'
const USDT_ADDRESS = '0x59b670e9fA9D0A427751Af201D676719a970857b'
const USDC_ADDRESS = '0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1'
const WBTC_ADDRESS = '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44'
const WETH_ADDRESS = '0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f'

 const UserContext = createContext()

export const UseUserContext = () => {
    return useContext(UserContext)
}
const App = props => {

    const [provider, setProvider] = useState(undefined);

    const [contract, setContract] = useState(undefined);


    useEffect(() => {
        const onLoad = async () => {
            const provider = await new ethers.providers.Web3Provider(window.ethereum)
            setProvider(provider)
            const contract = await new ethers.Contract(CONTRACT_ADDRESS, artifact.abi, provider)
            setContract(contract)
        }
        onLoad()
    }, [])


    return (
        <Layout style={{backgroundColor: "#f5f5f5"}}>
            <UserContext.Provider value={[provider, contract]}>
                {provider && contract && <Content style={{textAlign: 'center'}}>
                    <Space direction={"vertical"}>
                        <Card title={"Ethereum Market"}>
                            <EthereumMarket/>
                        </Card>
                        <Card title={"Staked Assets"}>
                            <StakedAssets/>
                        </Card>
                    </Space>
                </Content>}
            </UserContext.Provider>
        </Layout>
    );
};

App.propTypes = {};

export default App;