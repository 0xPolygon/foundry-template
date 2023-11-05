// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "forge-std/Script.sol";
import "script/util/ScriptHelpers.sol";

import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

import "script/deployers/DeployCounter.s.sol";

contract Deploy is Script, ScriptHelpers, CounterDeployer {
    using stdJson for string;

    ProxyAdmin internal proxyAdmin;

    Counter internal counter;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory input = vm.readFile("script/1.0.0/input.json");

        vm.broadcast(deployerPrivateKey);
        proxyAdmin = new ProxyAdmin(input.readAddress($("ProxyAdmin.initialOwner")));

        (counter,) = deployCounter(address(proxyAdmin), input.readUint($("Counter.number")));
    }
}
