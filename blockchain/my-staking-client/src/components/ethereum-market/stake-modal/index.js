import React from 'react';
import {Modal} from "antd";
import {displayLogo} from "../../../utils";

const StakeModal = props => {
    return (
        <>
            <Modal
                title={<>
                    Stake {displayLogo(props.data.symbol)} {props.data.symbol}
                </>}
                {...props}>

            </Modal>

        </>
    );
};

StakeModal.propTypes = {
    ...Modal.propTypes
};

export default StakeModal;