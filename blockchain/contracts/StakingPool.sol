// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeCastUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/structs/EnumerableSetUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract StakingPool is Initializable,
OwnableUpgradeable,
PausableUpgradeable,
ReentrancyGuardUpgradeable,
AccessControlUpgradeable {
    using SafeERC20 for IERC20;
    // hash role admin
    bytes32 public constant ADMIN = keccak256("ADMIN");

    // hash role super admin
    bytes32 public constant SUPER_ADMIN = keccak256("SUPER_ADMIN");

    uint32 private constant ONE_YEAR = 365 days;

    // The reward distribution address
    address public rewardDistributor;

    // address to receive the money
    address public coldWalletAddress;

    // info each pool
    StakingPoolInfo[] public poolInfo;

    //data staking of user in a pool
    mapping(uint256 => mapping(address => StakingData)) userStakingData;

    // pool info
    struct StakingPoolInfo {
        IERC20 acceptedToken;
        uint256 cap;
        uint256 totalStaked;
        uint256 APR;
        uint256 lockDuration;
        uint256 delayDuration;
    }

    // data staking in user
    struct UserStakingData {
        uint256 balance;
        uint256 stakeTime;
        uint256 lastClaimTime;
        uint256 pendingReward;
        uint256 APR;
    }

    // data withdraw of user
    struct UserPendingWithdrawl {
        uint256 amount;
        uint256 applicableAt;
    }

    // data of all user
    struct StakingData {
        uint256 balance;
        uint256 stakingDataRecordCount;
        mapping(uint256 => UserStakingData) stakingDatas;
        mapping(uint256 => mapping(uint256 => UserPendingWithdrawl)) totalWithdrawals;
        mapping(uint256 => uint256) totalWithdrawalsCount;
    }

    event StakingPoolCreate(
        uint256 indexed poolId,
        IERC20 acceptedToken,
        uint256 cap,
        uint256 APR,
        uint256 lockDuration,
        uint256 delayDuration
    );

    event StakingPoolDeposit(address account, uint256 poolId, uint256 amount, uint256 stakedId, uint256 time);
    event StakingPoolWithdraw(address account, uint256 poolId, uint256 amount, uint256 stakedId, uint256 time);
    event StakingPoolClaimReward(address account, uint256 poolId, uint256 totalReward, uint256 stakedId, uint256 time);

    function __StakingPool_init() public initializer {
        __AccessControl_init();
        _setRoleAdmin(ADMIN, SUPER_ADMIN);
        _setupRole(SUPER_ADMIN, msg.sender);
        _setupRole(ADMIN, msg.sender);
        // set owner is msg.sender
        __Ownable_init();

        // stop contract
        __Pausable_init();

        coldWalletAddress = address(0xf42857DA0Bf94d8C57Bc9aE62cfAAE3722ed9DAb);
    }

    function createPool(
        IERC20 _acceptedToken,
        uint256 _cap,
    // uint256 _minInvestment,
    // uint256 _maxInvestment,
        uint256 _APR,
        uint256 _lockDuration,
        uint256 _delayDuration
    ) external onlyRole(ADMIN) {
        poolInfo.push(
            StakingPoolInfo({
        acceptedToken : _acceptedToken,
        cap : _cap,
        totalStaked : 0,
        // minInvestment: _minInvestment,
        // maxInvestment: _maxInvestment,
        APR : _APR,
        lockDuration : _lockDuration,
        delayDuration : _delayDuration
        })
        );
        emit StakingPoolCreate(
            poolInfo.length - 1,
            _acceptedToken,
            _cap,
            _APR,
            _lockDuration,
            _delayDuration
        );
    }

    function deposit(uint256 _poolId, uint256 _amount) external {
        address account = msg.sender;

        StakingPoolInfo storage pool = poolInfo[_poolId];
        StakingData storage user = userStakingData[_poolId][account];

        require(
            coldWalletAddress != address(0),
            "StakingPool: Cold Wallet address is not address 0"
        );

        pool.acceptedToken.tranferFrom(account, coldWalletAddress, _amount);

        uint256 recordId = user.stakingDataRecordCount ++;
        user.stakingDatas[recordId] = UserStakingData({
        balance : _amount,
        stakeTime : block.timestamp,
        lastClaimTime : 0,
        pendingReward : 0,
        APR : pool.APR
        });

        user.balance += _amount;
        pool.totalStaked +=_amount;

        emit StakingPoolDeposit(account, _poolId, _amount, recordId, block.timestamp);

    }
}