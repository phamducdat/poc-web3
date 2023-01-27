import React from 'react';
import {Form, InputNumber, Modal} from "antd";
import {displayLogo} from "../../../utils";
import {UseWeb3AssetContext} from "../../../App";
import {ethers} from "ethers";

const StakeModal = props => {

    const [form] = Form.useForm()

    const {signer, contract, setReloadStakeAssets, tokenContracts} = UseWeb3AssetContext()

    const tokenAddress = props?.data?.tokenAddress


    const onFinish = async (value) => {
        const stakeTokenQuantityWei =
            ethers.utils.parseEther(value?.tokenQuantity.toString())

        await tokenContracts[tokenAddress].connect(signer).approve(contract.address,
            stakeTokenQuantityWei)


        const res = await contract.connect(signer).stakeTokens(tokenAddress, stakeTokenQuantityWei);
        await res.wait()

        setReloadStakeAssets(true)


    }


    return (
        <>
            <Modal
                title={<>
                    Stake {props.data?.symbol}
                </>}
                {...props}
                onOk={() => {
                    form?.submit()
                    props?.onOk()
                }
                }
            >

                <Form
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item name={"tokenQuantity"}
                               label={displayLogo(props?.data?.symbol)}>
                        <InputNumber
                            style={{width: "100%"}}
                        />
                    </Form.Item>
                </Form>

            </Modal>

        </>
    )
        ;
};

StakeModal.propTypes = {
    ...Modal.propTypes
};

export default StakeModal;