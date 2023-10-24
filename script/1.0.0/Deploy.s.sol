// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {Script, stdJson, console2 as console} from "forge-std/Script.sol";

import {Counter} from "../../src/Counter.sol";

contract Deploy is Script {
    using stdJson for string;

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        string memory input = vm.readFile("script/1.0.0/input.json");
        string memory chainIdSlug = string(abi.encodePacked('["', vm.toString(block.chainid), '"]'));
        uint256 num = input.readUint(string.concat(chainIdSlug, ".num"));

        vm.startBroadcast(deployerPrivateKey);

        new Counter(num);

        vm.stopBroadcast();
    }
}
