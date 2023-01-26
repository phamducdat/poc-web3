// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract MyStaking {

    address public owner;

    uint public currentTokenId = 1;

    uint public ethUsdPrice;

    event closePositionEvent (
        uint positionId,
        uint blockTimeStamp,
        uint createdDate
    );

    struct Token {
        uint tokenId;
        string name;
        string symbol;
        address tokenAddress;
        uint usdPrice;
        uint ethPrice;
        uint apy;
    }

    uint public currentPositionId = 1;

    struct Position {
        uint positionId;
        address walletAddress;
        address tokenAddress;
        uint createdDate;
        uint tokenQuantity;
        bool open;
        uint usdPrice;
        uint ethPrice;
        uint apy;
    }

    mapping(address => Token) public tokens;
    mapping(uint => Position) public positions;
    address [] public tokenAddresses;


    constructor(uint currentEthPrice) payable {
        ethUsdPrice = currentEthPrice;
        owner = msg.sender;
    }



    function getTokenAddresses() public view returns (address[] memory)  {
        return tokenAddresses;
    }

    function getTokenByTokenAddress(address tokenAddress) public view returns(Token memory) {
        return tokens[tokenAddress];
    }


    function addToken(
        string calldata name,
        string calldata symbol,
        address tokenAddress,
        uint usdPrice,
        uint apy
    ) external onlyOwner {

        tokenAddresses.push(tokenAddress);
        tokens[tokenAddress] = Token(
            currentTokenId,
            name,
            symbol,
            tokenAddress,
            usdPrice,
            usdPrice / ethUsdPrice,
            apy
        );
        currentTokenId += 1;
    }


    function stakeTokens(address tokenAddress, uint tokenQuantity) external {
        require(tokens[tokenAddress].tokenId != 0, "This token cannot be staked!");
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), tokenQuantity);

        positions[currentPositionId] = Position(
            currentPositionId,
            msg.sender,
            tokenAddress,
            block.timestamp,
            tokenQuantity,
            true,
            tokens[tokenAddress].usdPrice * tokenQuantity,
            (tokens[tokenAddress].usdPrice * tokenQuantity) / ethUsdPrice,
            tokens[tokenAddress].apy
        );

        currentPositionId += 1;
    }

    function getPositionById(uint positionId) public view returns (Position memory)  {

        return positions[positionId];

    }

    function closePosition(uint positionId) external {
        require(positions[positionId].walletAddress == msg.sender, "Not the owner of this position");
        require(positions[positionId].open == true, "Position is already closed");


        positions[positionId].open = false;

        IERC20(positions[positionId].tokenAddress).transfer(msg.sender, positions[positionId].tokenQuantity);

        uint numberDays = calculateNumberDays(positions[positionId].createdDate);
        uint weiAmount = calculateInterest(
            positions[positionId].apy,
            positions[positionId].ethPrice,
            numberDays
        );


        payable(msg.sender).call{value : weiAmount}("");
    }

    function calculateInterest(uint apy, uint ethPrice, uint numberDays)
    public pure returns (uint) {
        return apy * ethPrice * numberDays / 10000 / 356;
    }

    function calculateNumberDays(uint createdDate) public view returns (uint) {
        return (block.timestamp - createdDate) / 60 / 60 / 24;

    }


    modifier onlyOwner() {
        require(owner == msg.sender, "Only Owner may call this function");
        _;
    }
}