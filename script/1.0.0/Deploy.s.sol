// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "forge-std/Script.sol";
import "script/util/ScriptHelpers.sol";

import "script/deployers/DeployCounter.s.sol";

contract Deploy is Script, ScriptHelpers, CounterDeployer {
    using stdJson for string;

    function run() public {
        string memory input = vm.readFile("script/1.0.0/input.json");

        deployCounter(input.readAddress($("ProxyAdmin.initialOwner")), input.readUint($("Counter.number")));
    }
}
