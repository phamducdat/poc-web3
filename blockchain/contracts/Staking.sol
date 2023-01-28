// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "./token/TokenPool.sol";

contract Staking {

    address public owner;

    TokenPool public tokenPool;


    function addToken(
        string calldata name,
        string calldata symbol,
        address tokenAddress,
        uint ethPrice,
        uint apy
    ) external onlyOwner {
        tokenPool.addToken(name,symbol,tokenAddress,ethPrice,apy);
    }

    constructor() payable {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Only Owner may call this function");
        _;
    }

}