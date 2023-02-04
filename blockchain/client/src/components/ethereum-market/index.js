import React, {useState} from 'react';
import {Button, Card, Col, Row, Table} from "antd";
import './index.css'

import StakeModal from "./stake-modal";
import {displayLogo, LinkToAddressToken} from "../../utils";
import {UseWeb3AssetContext} from "../../App";
import StakeCard from "./stake-card";


const EthereumMarket = props => {

    const {
        signer, tokens, tokenAddresses,
        isConnected
    } = UseWeb3AssetContext()

    const [stakeModalOpen, setStakeModalOpen] = useState(false)
    const [tokenChosen, setTokenChosen] = useState(undefined)
    const [tokenClickedData, setTokenClickedData] = useState()


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

            <Row gutter={16}>
                <Col span={14}>
                    <Card title={"Tokens"}>
                        {tokenAddresses?.length > 0 &&
                            <Table
                                columns={columns}
                                dataSource={mapDataSource()}
                                onRow={(record, rowIndex) => {
                                    return {
                                        onClick: (event) => {
                                            setTokenClickedData(record)

                                        },
                                    };
                                }}
                            />

                        }
                    </Card>
                </Col>

                <Col span={10}>


                    <Card title={<>
                        <Row align={"middle"}
                             justify={"center"}
                        >
                            {displayLogo(tokenClickedData?.symbol)}
                            {tokenClickedData?.symbol}
                        </Row>
                    </>}>

                        {isConnected && tokenClickedData && <StakeCard data={tokenClickedData}/>}
                    </Card>
                </Col>

            </Row>
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