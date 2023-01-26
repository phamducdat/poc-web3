import React from 'react';
import {Form, InputNumber, Modal} from "antd";
import {displayLogo} from "../../../utils";

const StakeModal = props => {


    const onFinish = (value) => {

    }

    return (
        <>
            <Modal
                title={<>
                    Stake {props.data?.symbol}
                </>}
                {...props}>

                <Form>
                    <Form.Item name={"token"} label={displayLogo(props?.data?.symbol)}>
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