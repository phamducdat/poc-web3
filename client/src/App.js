import React, {useState} from 'react';
import {ethers} from 'ethers' ;
import artifacts from 'blockchain/artifacts/contracts/MyStaking.sol/MyStaking.json'

const CONTRACT_ADDRESS =  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const App = props => {
    const [provider, setProvider] = useState(undefined)
    const [signer, setSigner] = useState(undefined)
    const [contract, setContract] = useState(undefined)
    return (
        <div>

            datpd
        </div>
    );
};

App.propTypes = {};

export default App;