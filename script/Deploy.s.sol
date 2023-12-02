// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "forge-std/Script.sol";
import "script/util/ScriptHelpers.sol";

import "script/deployers/CounterDeployer.s.sol";

contract Deploy is Script, ScriptHelpers, CounterDeployer {
    using stdJson for string;

    function run() public {
        address proxyAdmin = address(1);
        uint256 initialNumber = 5;
        deployCounterTransparent(proxyAdmin, initialNumber);
    }
}
