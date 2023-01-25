// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract DappToken is ERC20 {

    constructor() ERC20("DApp Token", "DAPP") {
        _mint(msg.sender, 100000000000000000000);
    }
}