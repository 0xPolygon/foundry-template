// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "forge-std/Script.sol";
import "script/util/ScriptHelpers.sol";

import "./Input.sol";
import "script/deployers/DeployCounter.s.sol";

contract Deploy is Script, ScriptHelpers, Input, CounterDeployer {
    using stdJson for string;

    function run() public {
        deployCounter_NoInit(getInput().ProxyAdmin.initialOwner);
    }

    function _run_AllNew() internal {
        deployCounter(getInput().ProxyAdmin.initialOwner, getInput().Counter.number);
    }
}
