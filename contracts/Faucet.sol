//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract Owned {
    address payable immutable i_owner;

    constructor() {
        i_owner = payable(msg.sender);
    }

    //modifier that allows only owner to access
    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert("Only contract owner can call this function");
        }
        _;
    }
}

contract Mortal is Owned {
    function destroy() public onlyOwner {
        selfdestruct(i_owner);
    }
}

contract Faucet is Mortal {
    event Withdraw(address to, uint amount);
    event Deposit(address from, uint amount);

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint _withdrawAmount) public {
        if (_withdrawAmount > 0.1 ether) revert("Exeeds withdraw limit!");
        if (address(this).balance < _withdrawAmount)
            revert("Insufficient Fund");

        payable(msg.sender).transfer(_withdrawAmount);

        emit Withdraw(msg.sender, _withdrawAmount);
    }

    function getOwner() external view returns (address) {
        return i_owner;
    }
}
