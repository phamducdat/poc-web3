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

    address[] public tokenAddresses;
    mapping(address => Token) public tokens;

    struct Period {
        uint periodId;
        uint numberDays;
        uint interestRate;
        bool isUnlimited;
    }

    mapping(uint => Period) public periods;
    uint[] periodIds;

    uint public currentDepositId = 1;

    struct Deposit {
        uint depositId;
        address walletAddress;
        address tokenAddress;
        uint createdDate;
        uint tokenQuantity;
        uint ethValue;
        uint numberDays;
        uint interestRate;
        bool isUnlimited;
        uint closingDate;
        bool open;
    }

    mapping(uint => Deposit) public deposits;
    mapping(address => uint[]) public depositIdsByWalletAddress;


    constructor(address _tokenRewardAddress, uint _ethTokenRewardPrice) {
        tokenRewardAddress = _tokenRewardAddress;
        ethTokenRewardPrice = _ethTokenRewardPrice;

        periods[1] = Period(
            1,
            30,
            49,
            false
        );

        periods[2] = Period(
            2,
            180,
            60,
            false
        );

        periods[3] = Period(
            3,
            365,
            74,
            false
        );

        periods[4] = Period(
            4,
            0,
            30,
            true
        );

        periodIds.push(1);
        periodIds.push(2);
        periodIds.push(3);
        periodIds.push(4);

        owner = msg.sender;
    }

    function getDepositIdsByWalletAddress() public view returns (uint256[] memory) {
        return depositIdsByWalletAddress[msg.sender];
    }

    function getDepositByDepositId(uint depositId) public view returns (Deposit memory) {
        return deposits[depositId];
    }

    function getTokenAddresses() public view returns (address[] memory) {
        return tokenAddresses;

    }

    function getTokenByTokenAddress(address tokenAddress) public view returns (Token memory) {
        return tokens[tokenAddress];
    }

    function getPeriodIds() external view returns(uint[] memory) {
        return periodIds;
    }

    function getPeriodById(uint periodId) external view returns(Period memory){
        return periods[periodId];
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
        currentTokenId += 1;
    }

    function stakeTokens(
        address tokenAddress,
        uint tokenQuantity,
        uint periodId)
    external validateTokenExist(tokenAddress) {

        IERC20(tokenAddress).transferFrom(
            msg.sender,
            address(this),
            tokenQuantity
        );

        uint ethValue = tokenQuantity * tokens[tokenAddress].ethPrice;

        deposits[currentDepositId] = Deposit(
            currentDepositId,
            msg.sender,
            tokenAddress,
            block.timestamp,
            tokenQuantity,
            ethValue,
            periods[periodId].numberDays,
            periods[periodId].interestRate,
            periods[periodId].isUnlimited,
            0,
            true
        );
        depositIdsByWalletAddress[msg.sender].push(currentDepositId);
        currentDepositId += 1;
    }

    function calculateAnticipatedInterest(uint depositId) external view returns (uint) {
        Deposit memory deposit = deposits[depositId];

        return deposit.ethValue * deposit.interestRate / 1000;
    }

    function closeDeposit(uint depositId) external {
        require(deposits[depositId].walletAddress == msg.sender, "Not the owner of this deposit");
        require(deposits[depositId].open = true, "Deposit is already closed");


        deposits[depositId].open = false;
        deposits[depositId].closingDate = block.timestamp;



        IERC20(deposits[depositId].tokenAddress)
        .transfer(msg.sender, deposits[depositId].tokenQuantity);

        uint ethInterest = calculateDepositInterest(depositId);
        uint tokenRewardInterest = ethInterest/ethTokenRewardPrice;

        IERC20(tokenRewardAddress).transfer(deposits[depositId].walletAddress, tokenRewardInterest);

    }

    function calculateDepositInterest(uint depositId) public view returns (uint)  {
        Deposit memory deposit = deposits[depositId];

        if (deposits[depositId].isUnlimited == true) {
            uint calDate = (block.timestamp - deposit.createdDate)/ (1 days);
            return deposit.ethValue * calDate * deposit.interestRate / (1000 * 365);
        } else {
            uint calDate = (block.timestamp - deposit.createdDate) / (1 days);
            if (calDate > deposit.numberDays) {
                calDate = deposit.numberDays;
            }
            return (deposit.ethValue * calDate * deposit.interestRate) / (1000 * deposit.numberDays);
        }

    }


    function calculateInterest(uint apd, uint ethValue, uint startDate, uint endDate)
    public view returns (uint) {
        return apd * ethValue * (endDate - startDate) / (10000 * ethTokenRewardPrice);
    }



    modifier validateTokenExist(address tokenAddress) {
        require(tokens[tokenAddress].tokenId != 0,
            "This token cannot be deposited!");
        _;
    }

    function modifyCreatedDate(uint depositId, uint newCreatedDate) external onlyOwner {
        deposits[depositId].createdDate = newCreatedDate;

    }


    modifier onlyOwner() {
        require(owner == msg.sender, "Only Owner may call this function");
        _;
    }
}