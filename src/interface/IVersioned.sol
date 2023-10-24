// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

interface IVersioned {
    /// @return the version of the contract
    function version() external pure returns (string memory);
}
