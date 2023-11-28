// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "forge-std/Script.sol";
import "script/util/ScriptHelpers.sol";

import "./Inputs.sol";
import "script/deployers/DeployCounter.s.sol";

contract Deploy is Script, ScriptHelpers, Inputs, CounterDeployer {
    using stdJson for string;

    function run() public {
        deployCounter_NoInit(input.proxyAdminOwner);
    }

    function _run_AllNew() internal {
        deployCounter(input.proxyAdminOwner, input.Counter.number);
    }
}
