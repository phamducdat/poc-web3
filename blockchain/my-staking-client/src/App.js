import React, {createContext, useContext, useEffect, useState} from 'react';
import {Content} from "antd/es/layout/layout";
import {Button, Card, Layout, Space} from "antd";
import EthereumMarket from "./components/ethereum-market";
import StakedAssets from "./components/staked-assets";
import {ethers} from "ethers";
import artifact from "./artifacts/contracts/MyStaking.sol/MyStaking.json";
import linkArtifact from './artifacts/contracts/Chainlink.sol/Chainlink.json'
import usdtArtifact from './artifacts/contracts/Tether.sol/Tether.json'
import usdcArtifact from './artifacts/contracts/UsdCoin.sol/UsdCoin.json'
import wbtcArtifact from './artifacts/contracts/WrappedBitcoin.sol/WrappedBitcoin.json'
import wethArtifact from './artifacts/contracts/WrappedEther.sol/WrappedEther.json'

const CONTRACT_ADDRESS = '0x09635F643e140090A9A8Dcd712eD6285858ceBef'
const LINK_ADDRESS = '0xc5a5C42992dECbae36851359345FE25997F5C42d'
const USDT_ADDRESS = '0x67d269191c92Caf3cD7723F116c85e6E9bf55933'
const USDC_ADDRESS = '0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E'
const WBTC_ADDRESS = '0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690'
const WETH_ADDRESS = '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB'

const Web3AssetContext = createContext()

export const UseWeb3AssetContext = () => {
    return useContext(Web3AssetContext)
}
const App = props => {


    const [provider, setProvider] = useState(undefined);
    const [contract, setContract] = useState(undefined);
    const [signer, setSigner] = useState(undefined);
    const [isConnected, setIsConnected] = useState(false);
    const [tokenAddresses, setTokenAddresses] = useState([]);
    const [tokenContracts, setTokenContracts] = useState({})
    const [tokens, setTokens] = useState({});

    const [reloadStakeAssets, setReloadStakeAssets] = useState(false)


    useEffect(() => {

        const onLoad = async () => {
            const provider = await new ethers.providers.Web3Provider(window.ethereum)
            setProvider(provider)
            const contract = await new ethers.Contract(CONTRACT_ADDRESS, artifact.abi, provider)
            setContract(contract)

            const tokenAddresses = await contract.getTokenAddresses()
            setTokenAddresses(tokenAddresses)

            tokenAddresses.map(async tokenAddress => {
                const token = await contract.getTokenByTokenAddress(tokenAddress)
                setTokens(prev => ({
                    ...prev,
                    [tokenAddress]: token
                }))
            })

            const linkContract = await new ethers.Contract(LINK_ADDRESS, linkArtifact.abi, provider)
            const usdtContract = await new ethers.Contract(USDT_ADDRESS, usdtArtifact.abi, provider)
            const usdcContract = await new ethers.Contract(USDC_ADDRESS, usdcArtifact.abi, provider)
            const wbtcContract = await new ethers.Contract(WBTC_ADDRESS, wbtcArtifact.abi, provider)
            const wethContract = await new ethers.Contract(WETH_ADDRESS, wethArtifact.abi, provider)

            setTokenContracts(prev => ({...prev, [linkContract.address]: linkContract}))
            setTokenContracts(prev => ({...prev, [usdtContract.address]: usdtContract}))
            setTokenContracts(prev => ({...prev, [usdcContract.address]: usdcContract}))
            setTokenContracts(prev => ({...prev, [wbtcContract.address]: wbtcContract}))
            setTokenContracts(prev => ({...prev, [wethContract.address]: wethContract}))
        }
        onLoad()
    }, [])

    useEffect(() => {
        if (signer !== undefined)
            setIsConnected(true)
        else
            setIsConnected(false)
    }, [signer])

    const getSigner = async () => {
        const signer = provider.getSigner();
        setSigner(signer)
        return signer
    }

    const connectWallet = async () => {
        const signer = await getSigner(provider)
        setSigner(signer)
    }




    return (
        <Layout style={{backgroundColor: "#f5f5f5"}}>
            <Web3AssetContext.Provider value={{
                provider,
                contract,
                signer,
                isConnected,
                tokenAddresses,
                tokens,
                tokenContracts,
                setReloadStakeAssets,
                reloadStakeAssets
            }}>
                {provider && contract && <Content style={{textAlign: 'center'}}>
                    <Space direction={"vertical"}>
                        <Card
                            title={"Ethereum Market"}
                            style={{width: "1500px"}}
                            key={"ethereumMarket"}
                        >
                            <EthereumMarket/>
                        </Card>
                        <Card
                            style={{width: "1500px"}}
                            title={"Staked Assets"}
                            key={reloadStakeAssets}
                            extra={<>
                                {!isConnected && <Button type={"primary"} onClick={connectWallet}>
                                    Connect Wallet
                                </Button>}
                            </>}>
                            {isConnected && <StakedAssets/>}
                        </Card>
                    </Space>
                </Content>}
            </Web3AssetContext.Provider>
        </Layout>
    )
        ;
};

App.propTypes = {};

export default App;