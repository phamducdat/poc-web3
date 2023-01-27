import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import {displayLogo, LinkToAddressToken, toEther} from "../../utils";
import {UseWeb3AssetContext} from "../../App";

const StakedAssets = props => {

    const {contract, signer} = UseWeb3AssetContext()
    const [positionIds, setPositionIds] = useState()
    const [positions, setPositions] = useState()

    useEffect(() => {
        const onLoad = async () => {
            const positionIds = await contract.connect(signer).getPositionIdsByWalletAddress()
            setPositionIds(positionIds)

            positionIds.map(async positionId => {
                const position = await contract.getPositionByPositionId(positionId)
                setPositions(prev => ({
                    ...prev,
                    [positionId]: position
                }))
            })

        }
        onLoad()

    },[])


    const columns = [
        {
            title: 'Token Address',
            dataIndex: 'tokenAddress',
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
            title: "Tokens Staked",
            dataIndex: "tokenStaked",
            key: "tokenStaked",
        },
        {
            title: "Market Value (USD)",
            dataIndex: "usdPrice",
            key: "usdPrice",
            render: (text) => {
                return toEther(text)/100
            }
        },
        {
            title: "Accrued Interest (USD)",
            dataIndex: "accruedInterest",
            key: "accruedInterest",
        },
        {
            title: "Accrued Interest (ETH)",
            dataIndex: "accruedInterest",
            key: "accruedInterest"
        }
    ]

    const mapDataSource = () => {
        if (positionIds?.length > 0 && positions !== undefined) {
            return positionIds?.map(positionId => {
                const position =positions[positionId]
                return {
                        ...position
                }
            })
        }
    }

    return (
        <>
            <Table
                columns={columns}
                dataSource={mapDataSource()}
            />
        </>
    );
};

StakedAssets.propTypes = {};

export default StakedAssets;