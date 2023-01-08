// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

contract MyERC20 is IERC20, IERC20Metadata {
    string private _name;
    string private _symbol;
    uint256 private _totalSupply;

    mapping(address => uint256) _balances;
    mapping(address => mapping(address => uint256))  _allowances;

    constructor(string memory name_, string memory symbol_, uint256 initialSupply) {
        _name = name_;
        _symbol = symbol_;
        _totalSupply = initialSupply;
        _balances[msg.sender] = initialSupply;
        emit Transfer(address(0), msg.sender, initialSupply);
    }

    function name() external view override returns (string memory) {
        return _name;
    }

    function symbol() external view override returns (string memory) {
        return _symbol;

    }

    function decimals() external view override returns (uint8) {
        return 18;

    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;

    }

    function balanceOf(address account)
    external
    view
    override
    returns (uint256)
    {
        return _balances[account];

    }

    function allowance(address owner, address spender)
    external
    view
    override
    returns (uint256)
    {
        return _allowances[owner][spender];

    }

    function approve(address spender, uint256 amount) external override returns (bool) {
        _allowances[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint256 amount)
    external override returns (bool)
    {
        _transfer(msg.sender, to, amount);
        return true;

    }

    function transferFrom(address from,
        address to, uint256 amount) external override returns (bool)  {

        uint256 allowance_ = _allowances[from][msg.sender];
        require(allowance_ >= amount, "Allowance is not enough!");
        _allowances[from][msg.sender] -= amount;
        emit Approval(from, msg.sender, allowance_, - amount);

        _transfer(from, to, amount);
        return true;

    }


    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "from must not be zero address");
        require(to != address(0), "to must not be zero address");
        require(_balances[from] >= amount, "balance is not enough");
        _balances[from] -= amount;
        _balances[to] += amount;
        emit Transfer(from, to, amount);

    }


}