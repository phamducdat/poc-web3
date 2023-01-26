import React from 'react';
import {Modal} from "antd";

const StakeModal = props => {
    return (
        <>
            <Modal{...props}/>

        </>
    );
};

StakeModal.propTypes = {
    ...Modal.propTypes
};

export default StakeModal;