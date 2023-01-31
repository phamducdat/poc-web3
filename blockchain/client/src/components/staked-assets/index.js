import React, {useMemo, useState} from 'react';
import {Button, Table} from "antd";
import {displayLogo, LinkToAddressToken, toEther} from "../../utils";
import {UseWeb3AssetContext} from "../../App";
import './index.css'
import moment from 'moment'
import {ethers} from "ethers";

const StakedAssets = props => {
    const {
        contract,
        signer,
        tokens,
        setReloadStakeAssets
    } = UseWeb3AssetContext()
    const [depositIds, setDepositIds] = useState()
    const [totalCount, setTotalCount] = useState()
    const [dataSource, setDataSource] = useState([])

    const calcAccruedInterest = async (apy, value, createdDate) => {
        const numberOfDays = await contract.calculateNumberDays(createdDate)
        const accruedInterest = await contract.calculateInterest(apy, value, numberOfDays)
        return Number(accruedInterest)

    }

    async function getData() {
        await setDataSource([])
        await setDepositIds(undefined)
        const depositIdsHex = await contract.connect(signer).getDepositIdsByWalletAddress()
        const depositIds = depositIdsHex.map(id => Number(id))
        setDepositIds(depositIds)


        const deposits = await Promise.all(
            depositIds.map(id =>
                contract.connect(signer).getDepositByDepositId(
                    Number(id)
                ))
        )


        setTotalCount(deposits.length)


        deposits.map(async deposit => {
            const token = tokens[deposit.tokenAddress]


            const calculateDepositInterest = await contract.connect(signer).calculateDepositInterest(deposit.depositId)

            const data = {
                ...deposit,
                asset: token.asset,
                symbol: token.symbol,
                ethAccruedInterest:Number(ethers.utils.formatEther(String(calculateDepositInterest))).toFixed(4)
            }
            setDataSource(prev => [...prev, data])
        })
    }


    useMemo(() => {
        const onLoad = async () => {
            await getData();
            setReloadStakeAssets(false)
        }
        onLoad()

    }, [])


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
            title: "Accrued Interest (ETH)",
            dataIndex: "ethAccruedInterest",
            key: "ethAccruedInterest"
        },
        {
            title: "Created Date",
            dataIndex: "createdDate",
            key: "createdDate",
            render: (text) => {
                const timeInSeconds = parseInt(text._hex, 16)
                return moment(timeInSeconds * 1000).format("DD/MM/YYYY HH:mm:ss")
            }
        },
        {
            title: "",
            dataIndex: "open",
            key: "open",
            render: (text, record) => {
                return <>
                    {text ? <Button type={"primary"}
                                    onClick={async () => {
                                        const res = await contract.connect(signer).closeDeposit(record.depositId)
                                        await res.wait()
                                        setReloadStakeAssets(true)
                                    }}
                        >Withdraw</Button>
                        : <Button disabled={true}>Close</Button>}
                </>

            }
        }
    ]


    const showTotal = (total) => `Total ${total} items`;
    return (
        <div>
            <Table
                columns={columns}
                dataSource={dataSource}
                pagination={{
                    total: totalCount,
                    showTotal: showTotal
                }}
            />
        </div>
    );
};

StakedAssets.propTypes = {};

export default StakedAssets;