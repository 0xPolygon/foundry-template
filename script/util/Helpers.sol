// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "forge-std/Script.sol";

abstract contract Helpers is Script {
    using stdJson for string;

    function $(string memory field) internal view returns (string memory) {
        string memory chainIdSlug = string.concat('["', vm.toString(block.chainid), '"]');
        return string.concat(chainIdSlug, ".", field);
    }
}
