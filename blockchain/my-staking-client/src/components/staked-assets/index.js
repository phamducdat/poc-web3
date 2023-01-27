import React, {useEffect, useState} from 'react';
import {Table} from "antd";
import {displayLogo} from "../../utils";
import {UseWeb3AssetContext} from "../../App";

const StakedAssets = props => {

    const {contract, signer} = UseWeb3AssetContext()
    const [positionIds, setPositionIds] = useState()
    const [positions, setPositions] = useState()

    useEffect(() => {
        const onLoad = async () => {
            console.log("dat with signer = ", signer)
            const positionIds = await contract.connect(signer).getPositionIdsByWalletAddress()
            console.log("dat with positionIds = ", positionIds)

        }
        onLoad()

    },[])

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
            title: "Tokens Staked",
            dataIndex: "tokenStaked",
            key: "tokenStaked",
        },
        {
            title: "Market Value (USD)",
            dataIndex: "marketValue",
            key: "marketValue",
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

    return (
        <>
            <Table
                columns={columns}
            />
        </>
    );
};

StakedAssets.propTypes = {};

export default StakedAssets;