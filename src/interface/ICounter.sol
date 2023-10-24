// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {IVersioned} from "./IVersioned.sol";

interface ICounter is IVersioned {
    /// @return the current number
    function number() external view returns (uint256);

    /// @notice set the number
    /// @param newNumber the new number
    function setNumber(uint256 newNumber) external;

    /// @notice increment the number by 1
    function increment() external;
}
