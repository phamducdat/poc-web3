import React, {createContext, useContext, useEffect, useState} from 'react';
import {Content} from "antd/es/layout/layout";
import {Button, Layout, Tabs} from "antd";
import EthereumMarket from "./components/ethereum-market";
import {ethers} from "ethers";
import artifact from "./artifacts/contracts/Staking.sol/Staking.json";
import linkArtifact from './artifacts/contracts/Chainlink.sol/Chainlink.json'
import usdtArtifact from './artifacts/contracts/Tether.sol/Tether.json'
import usdcArtifact from './artifacts/contracts/UsdCoin.sol/UsdCoin.json'
import wbtcArtifact from './artifacts/contracts/WrappedBitcoin.sol/WrappedBitcoin.json'
import wethArtifact from './artifacts/contracts/WrappedEther.sol/WrappedEther.json'
import StakedAssets from "./components/staked-assets";
import {BarChartOutlined, PoundOutlined} from "@ant-design/icons";


const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS
const LINK_ADDRESS = process.env.REACT_APP_LINK_ADDRESS
const USDT_ADDRESS = process.env.REACT_APP_USDT_ADDRESS
const USDC_ADDRESS = process.env.REACT_APP_USDC_ADDRESS
const WBTC_ADDRESS = process.env.REACT_APP_WBTC_ADDRESS
const WETH_ADDRESS = process.env.REACT_APP_WETH_ADDRESS


export const Web3AssetContext = createContext()

export const UseWeb3AssetContext = () => {
    return useContext(Web3AssetContext)
}
const App = props => {

    const [provider, setProvider] = useState(undefined);
    const [contract, setContract] = useState(undefined);
    const [signer, setSigner] = useState(undefined);
    const [signerAddress, setSignerAddress] = useState(undefined);
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
        const signerAddress = await signer.getAddress();
        setSignerAddress(signerAddress)
        setSigner(signer)
        return signer
    }

    const connectWallet = async () => {
        const signer = await getSigner(provider)
        setSigner(signer)
    }


    const items = [
        {
            key: 'market',
            label:
                <>
                    <BarChartOutlined/>
                    Market
                </>,
            children: <EthereumMarket/>

        },
        {
            key: 'stakeAssets',
            label: <>
                <PoundOutlined />
                Stake Assets
                </>,
            children: isConnected && <StakedAssets/>,
            disabled: !isConnected
        }
    ]


    return (
        <Layout style={{backgroundColor: "white"}}>
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
                {provider && contract && <Content style={{textAlign: 'center', margin: "16px"}}>
                    <Tabs
                        type="card"
                        defaultActiveKey="market" items={items}
                        tabBarExtraContent={{
                            right:
                                <>
                                    <Button onClick={connectWallet} type={"primary"}>
                                        {isConnected ?
                                            <>
                                                Hello
                                                {" " + signerAddress}
                                            </>
                                            : <>
                                                Connect
                                            </>}

                                    </Button>
                                </>
                        }
                        }
                    />
                </Content>
                }
            </Web3AssetContext.Provider>
        </Layout>
    )
        ;
};

App.propTypes = {};

export default App;