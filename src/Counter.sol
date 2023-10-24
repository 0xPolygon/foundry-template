// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {ICounter, IVersioned} from "./interface/ICounter.sol";

contract Counter is ICounter {
    uint256 public number;

    constructor(uint256 initialNumber) {
        number = initialNumber;
    }

    /// @inheritdoc ICounter
    function setNumber(uint256 newNumber) public {
        number = newNumber;
    }

    /// @inheritdoc ICounter
    function increment() public {
        number++;
    }

    /// @inheritdoc IVersioned
    function version() external pure returns (string memory) {
        return "1.0.0";
    }
}
