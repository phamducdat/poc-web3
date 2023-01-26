import React, {useEffect, useState} from 'react';
import {Button, Table} from "antd";
import {ethers} from "ethers";
import './index.css'

import StakeModal from "./stake-modal";
import {displayLogo} from "../../utils";
import {UseWeb3AssetContext} from "../../App";




const EthereumMarket = props => {

    const {contract, signer} = UseWeb3AssetContext()
    const [tokenAddresses, setTokenAddresses] = useState([]);
    const [tokens, setTokens] = useState({});
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
                    {signer !== undefined && <Button type={"primary"} onClick={() => {
                        setStakeModalOpen(true)
                        setTokenChosen(record)
                    }}>
                        Stake
                    </Button>}

                </>
            }
        }
    ];

    useEffect(() => {

        const onLoad = async () => {

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