//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Faucet.sol";

contract Token is Mortal {
    Faucet _faucet;

    constructor(address payable _f) {
        _faucet = Faucet(_f);
        _faucet.withdraw(0.1 ether);
    }
}
