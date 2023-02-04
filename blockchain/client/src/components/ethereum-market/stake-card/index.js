import React, {useEffect, useState} from 'react';
import {UseWeb3AssetContext} from "../../../App";
import {Button, Descriptions, Divider, Form, InputNumber, Row, Space, Tag} from "antd";
import moment from "moment";
import {ethers} from "ethers";

const StakeCard = props => {
    const {
        contract,
        signer ,
        tokenContracts
    } = UseWeb3AssetContext()
    const data = props?.data
    const [periods, setPeriods] = useState({})
    const [periodIds, setPeriodIds] = useState()
    const [quantity, setQuantity] = useState(0)
    const [periodIdClicked, setPeriodIdClicked] = useState(undefined)
    const [details, setDetails] = useState(null)


    const onStake = async () => {
        console.log("dat in async")
        const stakeTokenQuantityWei =
            ethers.utils.parseEther(quantity.toString())

        await tokenContracts[data?.tokenAddress].connect(signer).approve(contract.address,
            stakeTokenQuantityWei)
        await contract.connect(signer).stakeTokens(data?.tokenAddress,
            quantity, periodIdClicked)
    }

    function clearDetails() {
        setDetails({
            ethPrice: Number(data?.ethPrice)
        })
        setQuantity(0)
        setPeriodIdClicked(null)
    }

    useEffect(() => {
        clearDetails();
    }, [data])

    useEffect(() => {
        const onLoad = async () => {
            const periodIds = await contract.getPeriodIds()
            setPeriodIds(periodIds)

            periodIds.map(async periodId => {
                const period = await contract.getPeriodById(periodId)

                setPeriods(prev => ({
                    ...prev,
                    [periodId]: period
                }))
            })
        }
        onLoad()
    }, [])


    useEffect(() => {
        if (quantity) {
            setDetails({
                ...details,
                quantity: quantity
            })
        }
        if (periodIdClicked) {
            const period = periods[periodIdClicked]
            const anticipatedInterest =
                (quantity * Number(data?.ethPrice) * period?.interestRate) / 1000

            setDetails({
                quantity: quantity,
                ethPrice: Number(data?.ethPrice),
                period:
                    <Tag color={"orange"}>
                        {displayPeriod(periodIdClicked)}
                    </Tag>,
                exceptedClosingDay:
                    <Tag color={"green"}>

                        {period?.isUnlimited ? "Unlimited" : moment().add(Number(period?.numberDays), 'days').format("DD/MM/YYYY HH:mm:ss")}
                    </Tag>,
                anticipatedInterest:
                    <Tag color={"gold"}>

                        {anticipatedInterest}
                    </Tag>,
                unlimited: period?.isUnlimited === true ? <Tag color={"red"}>Yes</Tag> : <Tag color={"blue"}>No</Tag>,
            })
        }

    }, [quantity, periodIdClicked])


    const displayPeriod = (periodId) => {
        const period = periods[periodId]
        if (!period) return null
        if (Number(period?.numberDays) === 0)
            return "Unlimited - " + Number(period?.interestRate) / 100 + "% / year";
        else {
            let str;
            if (Number(period?.numberDays) === 30)
                str = "1 month";
            if (Number(period?.numberDays) === 180)
                str = "6 months";
            if (Number(period?.numberDays) === 365)
                str = "1 year";
            return str + " - " + Number(period?.interestRate) / 10 + "%"
        }
    }


    const genPeriodButton = (periodId) => {
        const period = periods[periodId]
        return <Button
            type={
                periodId === periodIdClicked ? "primary" : "default"
            }

            onClick={() => setPeriodIdClicked(periodId)}
        >
            {
                <>
                    {displayPeriod(periodId)}

                </>
            }
        </Button>
    }


    return (
        <div>
            <Form.Item
                label={"Quantity"}
            >
                <InputNumber
                    onChange={(value) => setQuantity(value)}
                    value={quantity}
                    style={{width: "100%"}}/>
            </Form.Item>
            <Space
                align={"start"}
                style={{marginBottom: "16px"}}
            >
                {periodIds?.length > 0 && periodIds?.map((periodId) =>
                    genPeriodButton(periodId))
                }
            </Space>

            <Divider/>
            <Descriptions size={"middle"} title={"Details"} column={1}>

                <Descriptions.Item label={"Quantity"}>{details?.quantity}</Descriptions.Item>
                <Descriptions.Item label={"Ether Price"}>{details?.ethPrice}</Descriptions.Item>
                <Descriptions.Item
                    label={"Period"}>

                    {details?.period}
                </Descriptions.Item>
                <Descriptions.Item label={"Excepted Closing Day"}>
                    {details?.exceptedClosingDay}
                </Descriptions.Item>
                <Descriptions.Item label={"Anticipated Interest"}>
                    {details?.anticipatedInterest}
                </Descriptions.Item>
                <Descriptions.Item label={"Unlimited"}>{details?.unlimited}</Descriptions.Item>

            </Descriptions>

            <Row justify={"space-between"}>
                <Button
                    type={"primary"}
                    onClick={onStake}
                    disabled={!quantity || !periodIdClicked}
                >
                    Stake
                </Button>
                <Button onClick={() => clearDetails()}>
                    Cancel
                </Button>
            </Row>
        </div>
    );
};

StakeCard.propTypes = {};

export default StakeCard;