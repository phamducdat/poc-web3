// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract WrappedBitcoin is ERC20 {

    constructor() ERC20('WrappedBitcoin', 'WBC') {
        _mint(msg.sender, 5000 * 10 ** 10);
    }
}


