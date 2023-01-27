import React, {useState} from 'react';
import {Button, Table} from "antd";
import './index.css'

import StakeModal from "./stake-modal";
import {displayLogo, LinkToAddressToken} from "../../utils";
import {UseWeb3AssetContext} from "../../App";


const EthereumMarket = props => {

    const {signer, tokens, tokenAddresses} = UseWeb3AssetContext()

    const [stakeModalOpen, setStakeModalOpen] = useState(false)
    const [tokenChosen, setTokenChosen] = useState(undefined)


    const columns = [
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (text) => {
                return LinkToAddressToken(text)
            }
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
                    {signer !== undefined &&
                        <Button
                            style={{backgroundColor: "#87d068"}}
                            onClick={() => {
                                setStakeModalOpen(true)
                                setTokenChosen(record)
                            }}>
                            Stake
                        </Button>}

                </>
            }
        }
    ];


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