// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;


contract TokenPool {

    uint public currentTokenId = 1;

    struct Token {
        uint tokenId;
        string name;
        string symbol;
        address tokenAddress;
        uint ethPrice;
        uint apy;
    }

    address [] public tokenAddresses;
    mapping(address => Token) public tokens;


    function addToken(string calldata name,
        string calldata symbol,
        address tokenAddress,
        uint ethPrice,
        uint apy) external {
        tokenAddresses.push(tokenAddress);
        tokens[tokenAddress] = Token(
            currentTokenId,
            name,
            symbol,
            tokenAddress,
            ethPrice,
            apy
        );
        currentTokenId += 1;
    }

}