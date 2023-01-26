import React, {useEffect, useState} from 'react';
import {Button, Table} from "antd";
import {ethers} from "ethers";
import './index.css'

import artifact from '../../artifacts/contracts/MyStaking.sol/MyStaking.json'
import StakeModal from "./stake-modal";
import {displayLogo} from "../../utils";
import {UseUserContext} from "../../App";


const CONTRACT_ADDRESS = '0x0165878A594ca255338adfa4d48449f69242Eb8F'

const EthereumMarket = props => {

    const provider = UseUserContext()
    const [contract, setContract] = useState(undefined);
    const [tokenAddresses, setTokenAddresses] = useState([]);
    const [tokens, setTokens] = useState({});
    const [dataSource, setDataSource] = useState([]);
    const [stakeModalOpen, setStakeModalOpen] = useState(false)
    const [tokenChosen, setTokenChosen] = useState(undefined)


    const columns = [
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: "Asset",
            dataIndex: "asset",
            key: 'asset',
            render: (text, record) => {
                return displayLogo(record.symbol)
            }
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol',
        },
        {
            title: 'Price (USD)',
            dataIndex: 'usdPrice',
            key: 'usdPrice',
            render: (text) => {
                return (Number(text) / 100).toFixed(0)
            }
        },
        {
            title: 'APY',
            dataIndex: 'apy',
            key: 'apy',
            render: (text) => {
                return <>
                    {(Number(text) / 100).toFixed(0)}%
                </>
            }
        },
        {
            title: "",
            dataIndex: "stake",
            key: "stake",
            render: (text, record) => {
                return <>
                    <Button type={"primary"} onClick={() => {
                        setStakeModalOpen(true)
                        setTokenChosen(record)
                    }}>
                        Stake
                    </Button>

                </>
            }
        }
    ];

    useEffect(() => {

        const onLoad = async () => {


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


        }
        onLoad()

    }, [])


    const mapDataSource = () => {
        if (tokenAddresses?.length > 0) {
            return tokenAddresses.map(address => {

                const token = tokens[address]
                return {
                    address: address,
                    ...token

                }
            })
        }
    }

    return (
        <>
            {tokenAddresses?.length > 0 &&
                <Table
                    columns={columns}
                    dataSource={mapDataSource()}
                />}

            <StakeModal
                open={stakeModalOpen}
                onOk={() => setStakeModalOpen(false)}
                onCancel={() => setStakeModalOpen(false)}
                data={tokenChosen}
            />

        </>
    );
};

EthereumMarket.propTypes = {};

export default EthereumMarket;