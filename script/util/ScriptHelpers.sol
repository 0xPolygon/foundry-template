// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "forge-std/Script.sol";

abstract contract ScriptHelpers is Script {
    using stdJson for string;

    ///@notice Returns the JSON field for the current chain ID.
    function $(string memory field) internal view returns (string memory) {
        string memory chainIdSlug = string.concat('["', vm.toString(block.chainid), '"]');
        return string.concat(chainIdSlug, ".", field);
    }
}
