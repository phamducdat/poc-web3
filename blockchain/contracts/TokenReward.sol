// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract TokenReward is ERC20 {

    constructor() ERC20('TokenReward', 'TKR') {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }
}
