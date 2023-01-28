// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Staking {
    address public owner;

    address public tokenRewardAddress;

    uint public ethTokenRewardPrice;


    uint currentTokenId = 1;

    struct Token {
        uint tokenId;
        address tokenAddress;
        string name;
        string symbol;
        uint ethPrice;
        uint maxStorage;
    }

    mapping(address => uint) public currentTokenStorages;
    address[] public tokenAddresses;
    mapping(address => Token) public tokens;


    uint public currentDepositId = 1;

    struct Deposit {
        uint positionId;
        address walletAddress;
        address tokenAddress;
        uint createdDate;
        uint tokenQuantity;
        uint ethValue;
        uint period;
        uint apd;
        uint anticipatedInterest;
        uint closingDate;
        uint anticipatedClosingDate;
        bool open;
    }

    mapping(uint => Deposit) public deposits;
    mapping(address => uint[]) public depositIdsByWalletAddress;

    mapping(uint => uint) defaultApds;
    uint[] public lockPeriods;


    constructor(address _tokenRewardAddress, uint _ethTokenRewardPrice) {
        tokenRewardAddress = _tokenRewardAddress;
        ethTokenRewardPrice = _ethTokenRewardPrice;

        defaultApds[30] = 700;
        defaultApds[90] = 1000;
        defaultApds[180] = 1200;

        lockPeriods.push(30);
        lockPeriods.push(90);
        lockPeriods.push(180);

        owner = msg.sender;
    }

    function addToken(
        address tokenAddress,
        string calldata name,
        string calldata symbol,
        uint ethPrice,
        uint currentStorage

    ) external onlyOwner {
        tokenAddresses.push(tokenAddress);
        tokens[tokenAddress] = Token(
            currentTokenId,
            tokenAddress,
            name,
            symbol,
            ethPrice,
            currentStorage
        );
        currentTokenStorages[tokenAddress] = 0;
        currentTokenId += 1;
    }

    function stakeTokens(address tokenAddress,
        uint tokenQuantity,
        uint period) external validateTokenExist(tokenAddress) {

        IERC20(tokenAddress).transferFrom(
            msg.sender,
            address(this),
            tokenQuantity
        );

        uint apd = calculateApd(tokenAddress, period);
        uint ethValue = tokenQuantity * tokens[tokenAddress].ethPrice;
        uint anticipatedClosingDate = block.timestamp + (period * 1 days);

        deposits[currentDepositId] = Deposit(
            currentDepositId,
            msg.sender,
            tokenAddress,
            block.timestamp,
            tokenQuantity,
            ethValue,
            period,
            apd,
            calculateInterest(apd, ethValue, block.timestamp, anticipatedClosingDate),
            0,
            anticipatedClosingDate,
            true
        );
        depositIdsByWalletAddress[msg.sender].push(currentDepositId);
        currentDepositId += 1;
    }

    function closeDeposit(uint depositId) external {
        require(deposits[depositId].walletAddress == msg.sender, "Not the owner of this deposit");
        require(deposits[depositId].open = true,
            "Deposit is already closed");

        deposits[depositId].open = false;
        deposits[depositId].closingDate = block.timestamp;
        currentTokenStorages[deposits[depositId].tokenAddress] -= deposits[depositId].tokenQuantity;

        IERC20(deposits[depositId].tokenAddress)
        .transfer(msg.sender, deposits[depositId].tokenQuantity);

        uint calDate = block.timestamp;
        if (block.timestamp > deposits[depositId].anticipatedClosingDate)
            calDate = deposits[depositId].anticipatedClosingDate;

        uint calTokenRewardInterest =
        calculateInterest(deposits[depositId].apd,
            deposits[depositId].ethValue,
            deposits[depositId].createdDate,
            calDate);

        IERC20(tokenRewardAddress).transfer(msg.sender, calTokenRewardInterest);
    }


    function calculateInterest(uint apd, uint ethValue, uint startDate, uint endDate)
    public view returns (uint) {
        return apd * ethValue * (endDate - startDate) / (10000 * ethTokenRewardPrice);
    }

    function calculateApd(address tokenAddress,
        uint period)
    public view returns (uint)

    {

        if (tokens[tokenAddress].maxStorage < currentTokenStorages[tokenAddress])
            return 0;
        else
            return ((tokens[tokenAddress].maxStorage -
            currentTokenStorages[tokenAddress]) * defaultApds[period]) / tokens[tokenAddress].maxStorage;
    }


    modifier validateTokenExist(address tokenAddress) {
        require(tokens[tokenAddress].tokenId != 0,
            "This token cannot be deposited!");
        _;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "Only Owner may call this function");
        _;
    }
}