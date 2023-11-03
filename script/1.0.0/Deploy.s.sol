// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "forge-std/Script.sol";
import "script/util/Helpers.sol";

import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

import "script/deployers/DeployCounter.s.sol";

contract Deploy is Script, Helpers, CounterDeployer {
    using stdJson for string;

    address internal proxyAdmin;

    Counter internal counter;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory input = vm.readFile("script/1.0.0/input.json");

        vm.broadcast(deployerPrivateKey);
        proxyAdmin = address(new ProxyAdmin(input.readAddress($("ProxyAdmin.initialOwner"))));

        (counter, , ) = deployCounter(address(proxyAdmin), input.readUint($("Counter.number")));
    }
}
