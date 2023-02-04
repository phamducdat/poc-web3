import React, {useEffect, useState} from 'react';
import {UseWeb3AssetContext} from "../../../App";
import {Button, Descriptions, Form, InputNumber, Row, Space} from "antd";

const StakeCard = props => {
    const {
        contract,
    } = UseWeb3AssetContext()
    const data = props?.data
    const [periods, setPeriods] = useState({})
    const [periodIds, setPeriodIds] = useState()
    const [quantity, setQuantity] = useState(0)
    const [periodIdClicked, setPeriodIdClicked] = useState(undefined)


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


    const displayPeriod = (periodId) => {
        const period = periods[periodId]
        if (!period) return  null
        if (Number(period?.numberDays) === 0)
            return "Unlimited - " + Number(period?.interestRate) / 100 + "% / year";
        else {
            let str;
            if (Number(period?.numberDays) === 30)
                str = "1 month";
            if (Number(period?.numberDays) === 180)
                str = "6 month";
            if (Number(period?.numberDays) === 365)
                str = "1 year";
            return str + " - " + Number(period?.interestRate) / 100 + "%"
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
                <InputNumber value={quantity} style={{width: "100%"}}/>
            </Form.Item>
            <Space
                align={"start"}
                style={{marginBottom: "16px"}}
            >
                {periodIds?.length > 0 && periodIds?.map((periodId) =>
                    genPeriodButton(periodId))
                }
            </Space>

            <Descriptions title={"Details"} column={1}>

                <Descriptions.Item label={"Quantity"}>22</Descriptions.Item>
                <Descriptions.Item label={"Ether Price"}>22</Descriptions.Item>
                <Descriptions.Item
                    label={"Period"}>{displayPeriod(periodIdClicked)}</Descriptions.Item>
                <Descriptions.Item label={"Excepted Closing Days"}>22</Descriptions.Item>
                <Descriptions.Item label={"Anticipated Interest"}>22</Descriptions.Item>
                <Descriptions.Item label={"Unlimited"}>No</Descriptions.Item>

            </Descriptions>

            <Row justify={"space-between"}>
                <Button type={"primary"}>
                    Stake
                </Button>
                <Button>
                    Cancel

                </Button>
            </Row>
        </div>
    );
};

StakeCard.propTypes = {};

export default StakeCard;