// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity 0.8.34;

interface IVersioned {
    /// @return The version of the contract
    function version() external pure returns (string memory);
}
