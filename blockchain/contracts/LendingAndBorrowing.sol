// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./LendingHelper.sol";


contract LendingAndBorrow is Ownable {

    using LendingHelper for address;

    address[] public lenders;
    address[] public borrowers;

    mapping(address => mapping(address => uint256)) public tokensLentAmount;
    mapping(address => mapping(address => uint256)) public tokensBorrowedAmount;

    mapping(uint256 => mapping(address => address)) public tokensLent;
    mapping(uint256 => mapping(address => address)) public tokensBorrowed;

    mapping(address => address) public tokenToPriceFeed;

    event Withdraw (
        address sender,
        uint256 amount,
        uint256 tokenToWithdrawInDDollars,
        uint256 avaiableToWithdraw,
        uint256 totalAmountLentInDollars,
        uint256 larTokenToRemove
    );

    event PayDebt (
        address sender,
        int256 index,
        uint256 tokenAmountBorrowed,
        uint256 tokenAmountToCollectFromUser,
        address[] borrowers
    );

    event Borrow (
        address sender,
        uint56 amountInDollars,
        uint256 totalAmountAvailableForBorrowInDollars,
        bool userPresent,
        int256 userIndex,
        address[] borrowers,
        uint256 currentUserTokentBorrowedAmount
    );
    event Supply(address sender, address[] lenders, uint256 currentUserTokenLentAmount);
    event WithdrawTesting(address sender, uint256 tokentoWithdrawInDollars, uint256 availableToWithdraw);
    event BorrowTesting1(address sender, uint256 amountInDollars, uint256 totalAmountAvailableForBorrowInDollars);
    event BorrowTesting2(address sender, uint256 balance, uint256 amount);
    event RepayTesting1(address sender, int256 index);
    event RepayTesting2(address sender, uint256 tokenBorrowed);

    struct Token {
        address tokenAddress;
        uint256 LTV;
        uint256 stableRate;
        string name;
    }

    Token[] public tokensForLending;
    Token[] public tokensForBorrowing;

    IERC20 public larToken;

    uint256 public noOfTokensLent = 0;
    uint256 public noOfTokensBorrowed = 0;


    constructor(address _token) {
        larToken = IERC20(_token);

    }

    // Add Tokens for lending

    function addTokensForLending(string memory name,
        address tokenAddress,
        uint256 LTV,
        uint256 borrowStableRate) external onlyOwner {
        Token memory token = Token(
            tokenAddress,
            LTV,
            borrowStableRate,
            name
        );

        if (!tokenIsAlreadyThere(token, tokensForLending)) {
            tokensForLending.push(token);
        }

    }

    // Add tokens for borrowing
    function addTokensForBorrowing(
        string memory name,
        address tokenAddress,
        uint256 LTV,
        uint256 borrowStableRate
    ) external onlyOwner {
        Token memory token = Token(tokenAddress, LTV, borrowStableRate, name);

        if (!tokenIsAlreadyThere(token, tokensForBorrowing)) {
            tokensForBorrowing.push(token);
        }
    }


    // Add Tokens for Borrowing
    function addTokenToPriceFeedMapping(address tokenAddress, address tokenToUsdPriceFeed)
    external onlyOwner {
        tokenToPriceFeed[tokenAddress] =
        tokenToUsdPriceFeed;

    }

    function getLendersArray() public view returns (address[] memory) {
        return lenders;
    }

    function getBorrowersArray() public view returns (address[] memory) {
        return borrowers;
    }

    function getTokensForLendingArray() public view returns (Token[] memory) {
        return tokensForLending;
    }

    function getTokensForBorrowingArray() public view returns (Token[] memory) {
        return tokensForBorrowing;
    }

    function lend(address tokenAddress, uint256 amount) external payable {
        require(tokenIsAllowed(tokenAddress, tokensForLending));
        require(amount > 0);

        IERC20 token = IERC20(tokenAddress);

        require(token.balanceOF(msg.sender) >= amount);

        token.transferFrom(msg.sender, address(this), amount);

        (bool userPresent, int256 userIndex) = msg.sender.isUserPresentIn(lenders);

        if (userPresent) {
            updateUserTokensBorrowedOrLent(tokenAddress, amount, userIndex, "lenders");
        } else {
            lenders.push(msg.sender);
            tokensLentAmount[tokenAddress][msg.sender] = amount;
            tokensLent[noOfTokensLent++][msg.sender] = tokenAddress;
        }

        // Send some tokens to the user equivalent to the token amount lent.

        larToken.transfer(msg.sender, getAmountInDollar(amount, tokenAddress));

        emit Supply(msg.sender, lenders, tokensLentAmount[tokenAddress][msg.sender]);
    }

    function Borrow(uint256 amount, address tokenAddress) external {
        require(tokenIsAlreadyThere(tokenAddress, tokensForBorrowing));
        require(amount > 0);

        uint256 totalAmountAvailableForBorrowInDollars = getUserTotalAmountAvailableForBorrowInDollars(msg.sender);
        uint256 amountInDollars = getAmountInDollars(amount, tokenAddress);

        emit BorrowTesting1(msg.sender, amountInDollars, totalAmountAvailableForBorrowInDollars);

        require(amountInDollars <= totalAmountAvailableForBorrowInDollars);

        IERC20 token = IERC20(tokenAddress);

        emit BorrowTesting2(msg.sender, token.balanceOf(address(this)), amount);

        require(token.balanceOf(address(this)) >= amount, "Insufficient Token");

        token.transfer(msg.sender, amount);

        (bool userPresent, int256 userIndex) = msg.sender.isUserPresentIn(borrowers);

        if (userPresent) {
            updateUserTokensBorrowedOrLent(tokenAddress, amount, userIndex, "borrowers");
        } else {
            borrowers.push(msg.sender);
            tokensBorrowedAmount[tokenAddress][msg.sender] = amount;
            tokensBorrowed[noOfTokensBorrowed++][msg.sender] = tokenAddress;
        }

        emit Borrow(
            msg.sender,
            amountInDollars,
            totalAmountAvailableForBorrowInDollars,
            userPresent,
            userIndex,
            borrowers,
            tokensBorrowedAmount[tokenAddress][msg.sender]
        );

    }

    function payDebt(address tokenAddress, uint256 amount) external {
        require(amount > 0);

        int256 index = msg.sender.indexOf(borrowers);

        emit RepayTesting1(msg.sender, index);
        require(index >= 0);

        uint256 tokenBorrowed = tokensBorrowedAmount[tokenAddress][msg.sender];

        emit RepayTesting2(msg.sender, tokenBorrowed);

        require(tokenBorrowed > 0);
        IERC20 token = IERC20(tokenAddress);

        token.transferFrom(msg.sender,address(this),amount + interest(tokenAddress, tokenBorrowed));

        tokensBorrowedAmount[tokenAddress][msg.sender] -= amount;
        if (getTotalAmountBorrowedInDollars(msg.sender) == 0) {
            borrowers[uint256(index)] = borrowers[borrowers.length - 1];
            borrowers.pop();
        }
        emit PayDebt(
            msg.sender,
            index,
            tokenBorrowed,
            amount + interest(tokenAddress, tokenBorrowed),
            borrowers
        );

    }


    function getUserTotalAmountAvailableForBorrowInDollars(address user) public view returns(uint256) {

        uint256 userTotalCollateralToBorrow = 0;
        uint256 userTotalCollateralAlreadyBorrowed = 0;

        for (uint256 i = 0; i < lenders.length; i++) {
            address currentLender = lenders[i];
            if (currentLender == user) {
                for (uint256 j = 0; j < tokensForLending.length; j++) {
                    Token memory currentTokenForLending = tokensForLending[j];
                    uint256 currentTokenLentAmount = tokensLentAmount[currentTokenForLending.tokenAddress][user];
                    uint256 currentTokenLentAmountInDollar = getAmountInDollars(
                        currentTokenLentAmount,
                        currentTokenForLending.tokenAddress
                    );
                    uint256 availableInDollar = (currentTokenLentAmountInDollar * currentTokenForLending.LTV) / 10**18;
                    userTotalCollateralToBorrow += availableInDollar;
                }
            }
        }

        for (uint256 i = 0; i < borrowers.length; i++) {
            address currentBorrower = borrowers[i];
            if (currentBorrower == user) {
                for (uint256 j = 0; j < tokensForBorrowing.length; j++) {
                    Token memory currentTokenForBorrowing = tokensForBorrowing[j];
                    uint256 currentTokenBorrowedAmount = tokensBorrowedAmount[currentTokenForBorrowing.tokenAddress][user];
                    uint256 currentTokenBorrowedAmountInDollar = getAmountInDollars(
                        (currentTokenBorrowedAmount),
                        currentTokenForBorrowing.tokenAddress
                    );

                    userTotalCollateralAlreadyBorrowed += currentTokenBorrowedAmountInDollar;
                }
            }
        }

        return userTotalCollateralToBorrow - userTotalCollateralAlreadyBorrowed;

    }

    function getAmountInDollars(uint256 amount, address tokenAddress) public view returns (uint256) {
        (uint256 dollarPerToken,uint256 decimals) = oneTokenEqualsHowManyDollars(tokenAddress);
        uint256 totalAmountInDollars = (amount * dollarPerToken) / (10 ** decimals);
        return totalAmountInDollars;

    }

    function oneTokenEqualsHowManyDollars(address tokenAddress) public view returns (uint256, uint256){
        address tokenToUsd = tokenToPriceFeed[tokenAddress];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(tokenToUsd);

        (, int256 price, , ,) = priceFeed.latestRoundData();

        uint256 decimals = priceFeed.decimals();

        return (uint256(price), decimals);

    }


    function tokenIsAlreadyThere(Token memory token, Token[] memory tokenArray)
    private pure returns (bool){
        if (tokenArray.length > 0) {
            for (uint256 i = 0; i < tokenArray.length; i++) {
                if (tokenArray[i].tokenAddress == token.tokenAddress) {
                    return true;
                }
            }
        }
        return false;
    }

    function updateUserTokensBorrowedOrLent(
        address tokenAddress,
        uint256 amount,
        int256 userIndex,
        string memory lendersOrBorrowers)
    private {
        if (keccak256(abi.encodePacked(lendersOrBorrowers)) == keccak256(abi.encodePacked("lenders"))) {
            address currentUser = lenders[uint256(userIndex)];

            if (hasLentOrBorrowedToken(currentUser, tokenAddress, noOfTokensLent, "tokensLent")) {
                tokensLentAmount[tokenAddress][currentUser] += amount;
            } else {
                tokensLent[noOfTokensLent++][currentUser] = tokenAddress;
                tokensLentAmount[tokenAddress][currentUser] = amount;
            }
        } else if (keccak256(abi.encodePacked(lendersOrBorrowers)) == keccak256(abi.encodePacked("borrowers"))) {
            address currentUser = borrowers[uint256(userIndex)];

            if (hasLentOrBorrowedToken(currentUser, tokenAddress, noOfTokensBorrowed, "tokensBorrowed")) {
                tokensBorrowedAmount[tokenAddress][currentUser] += amount;
            } else {
                tokensBorrowed[noOfTokensBorrowed++][currentUser] = tokenAddress;
                tokensBorrowedAmount[tokenAddress][currentUser] = amount;
            }
        }
    }

    function hasLentOrBorrowedToken(
        address currentUser,
        address tokenAddress,
        uint256 noOfTokenslentOrBorrowed,
        string memory _tokensLentOrBorrowed
    ) public view returns (bool) {
        if (noOfTokenslentOrBorrowed > 0) {
            if (keccak256(abi.encodePacked(_tokensLentOrBorrowed)) == keccak256(abi.encodePacked("tokensLent"))) {
                for (uint256 i = 0; i < noOfTokensLent; i++) {
                    address tokenAddressFound = tokensLent[i][currentUser];
                    if (tokenAddressFound == tokenAddress) {
                        return true;
                    }
                }
            } else if (keccak256(abi.encodePacked(_tokensLentOrBorrowed)) == keccak256(abi.encodePacked("tokensBorrowed"))) {
                for (uint256 i = 0; i < noOfTokensBorrowed; i++) {
                    address tokenAddressFound = tokensBorrowed[i][currentUser];
                    if (tokenAddressFound == tokenAddress) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

}