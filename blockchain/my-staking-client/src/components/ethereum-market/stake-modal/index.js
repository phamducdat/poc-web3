import React from 'react';
import {Form, InputNumber, Modal} from "antd";
import {displayLogo} from "../../../utils";
import {UseWeb3AssetContext} from "../../../App";
import {ethers} from "ethers";

const StakeModal = props => {

    const {signer, contract} = UseWeb3AssetContext()





    return (
        <>
            <Modal
                title={<>
                    Stake {props.data?.symbol}
                </>}
                {...props}>

                <Form>
                    <Form.Item name={"tokenQuantity"} label={displayLogo(props?.data?.symbol)}>
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