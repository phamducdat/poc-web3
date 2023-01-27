import React, {useMemo, useState} from 'react';
import {Button, Table} from "antd";
import {displayLogo, LinkToAddressToken, toEther} from "../../utils";
import {UseWeb3AssetContext} from "../../App";
import './index.css'

const StakedAssets = props => {

    const {contract,
        signer,
        tokens,
        isConnected,
        reloadStakeAssets,
        setReloadStakeAssets} = UseWeb3AssetContext()
    const [positionIds, setPositionIds] = useState()
    const [dataSource, setDataSource] = useState([])

    const calcAccruedInterest = async (apy, value, createdDate) => {
        const numberOfDays = await contract.calculateNumberDays(createdDate)
        const accruedInterest = await contract.calculateInterest(apy, value, numberOfDays)
        return Number(accruedInterest)
    }

    async function getData() {
        await setDataSource([])
        await   setPositionIds(undefined)
        const positionIdsHex = await contract.connect(signer).getPositionIdsByWalletAddress()
        const positionIds = positionIdsHex.map(id => Number(id))
        setPositionIds(positionIds)


        const positions = await Promise.all(
            positionIds.map(id =>
                contract.connect(signer).getPositionById(
                    Number(id)
                ))
        )

        positions.map(async position => {
            const token = tokens[position.tokenAddress]

            const ethAccruedInterestWei =
                await calcAccruedInterest(position.apy,
                    position.ethPrice,
                    position.createdDate)

            const ethAccruedInterest = toEther(ethAccruedInterestWei)

            const data = {
                ...position,
                asset: token.asset,
                symbol: token.symbol,
                ethAccruedInterest,
            }
            setDataSource(prev => [...prev, data])
        })
    }

    useMemo(() => {
        const onLoad = async () => {
            if (isConnected) {
                await getData();
                setReloadStakeAssets(false)
            }
        }
        onLoad()

    }, [isConnected])


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
            dataIndex: "tokenQuantity",
            key: "tokenQuantity",
            render: (text) => {
                return toEther(text)
            }
        },
        {
            title: "Market Value (USD)",
            dataIndex: "usdPrice",
            key: "usdPrice",
            render: (text) => {
                return toEther(text) / 100
            }
        },
        {
            title: "Accrued Interest (USD)",
            dataIndex: "accruedInterest",
            key: "accruedInterest",
        },
        {
            title: "Accrued Interest (ETH)",
            dataIndex: "ethAccruedInterest",
            key: "ethAccruedInterest"
        },
        {
            title: "",
            dataIndex: "open",
            key: "open",
            render: (text, record) => {
                return <>
                    {text ? <Button type={"primary"}
                                    onClick={() => {
                                        contract.connect(signer).closePosition(record.positionId)
                                    }}
                        >Withdraw</Button>
                        : <Button disabled={true}>Close</Button>}
                </>

            }
        }
    ]


    return (
        <div>
            <Table
                columns={columns}
                dataSource={dataSource}
            />
        </div>
    );
};

StakedAssets.propTypes = {};

export default StakedAssets;