import React, {useEffect, useState} from 'react';
import {UseWeb3AssetContext} from "../../../App";
import {Button} from "antd";

const StakeCard = props => {
    const {
        contract,
        signer,
        tokens,
        setReloadStakeAssets
    } = UseWeb3AssetContext()
    const data = props?.data
    const [periods, setPeriods] = useState({})
    const [periodIds, setPeriodIds] = useState()


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


    const displayNumberDays = (numberDays) => {
        if (Number(numberDays) === 0)
            return "Unlimited"
        else return Number(numberDays) + " " + "days";
    }


    const genPeriodButton = (periodId) => {
        const period = periods[periodId]
        return <Button>
            {
                <>
                    {displayNumberDays(period?.numberDays)}
                    {" - "}
                    {Number(period.interestRate)/100}%
                </>
            }
        </Button>
    }


    return (
        <div>
            {periodIds?.length > 0 && periodIds?.map((periodId) => genPeriodButton(periodId))}
        </div>
    );
};

StakeCard.propTypes = {};

export default StakeCard;