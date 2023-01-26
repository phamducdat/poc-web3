import React from 'react';
import {Table} from "antd";
import {displayLogo} from "../../utils";

const StakedAssets = props => {

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