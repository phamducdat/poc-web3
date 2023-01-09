// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

    error Staking__TransferFailed();

contract Staking {

    IERC20 public s_stakingToken;
    // someone address -> how much they staked
    mapping(address => uint256) public s_balances;

    uint256 public s_totalSupply;



    constructor(address stakingToken) {
        s_stakingToken = IERC20(stakingToken);


    }

    // do we allow any tokens?
    // or just a specific token?
    function stake(uint256 amount) external {
        // keep track of how much this user has staked
        // keep track of how much token we have total
        // transfer the token this contract

        s_balances[msg.sender] = s_balances[msg.sender] + amount;
        s_totalSupply = s_totalSupply + amount;

        bool success = s_stakingToken.transferFrom(msg.sender, address(this), amount);
        if (!success) {
            revert Staking__TransferFailed();
        }
    }

    function withdraw(uint256 amount) external  {
        s_balances[msg.sender] = s_balances[msg.sender] - amount;
        s_totalSupply = s_totalSupply - amount;
        bool success = s_stakingToken.transfer(msg.sender, amount);

        
    }
}