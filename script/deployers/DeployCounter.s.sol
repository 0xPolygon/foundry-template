// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";

import "src/Counter.sol";
import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

abstract contract CounterDeployer is Script {
    function deployCounter(address proxyAdmin, uint256 number)
        internal
        returns (Counter proxyAsCounter, address proxy, address logic)
    {
        bytes memory initData = abi.encodeCall(Counter.initialize, (number));

        return _deployCounter(proxyAdmin, initData);
    }

    function deployCounter_NoInit(address proxyAdmin)
        internal
        returns (Counter proxyAsCounter, address proxy, address logic)
    {
        return _deployCounter(proxyAdmin, "");
    }

    function _deployCounter(address proxyAdmin, bytes memory initData)
        private
        returns (Counter proxyAsCounter, address proxy, address logic)
    {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        logic = address(new Counter());
        proxy = address(new TransparentUpgradeableProxy(logic, proxyAdmin, initData));

        vm.stopBroadcast();

        proxyAsCounter = Counter(proxy);
    }
}
