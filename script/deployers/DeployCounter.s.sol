// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "forge-std/Script.sol";

import "src/Counter.sol";
import {ProxyAdmin} from "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";
import {TransparentUpgradeableProxy, ITransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

abstract contract CounterDeployer is Script {
    Counter internal counter;
    ProxyAdmin internal counterProxyAdmin;
    address internal counterLogic;

    function deployCounter(address proxyAdminOwner, uint256 number) internal {
        bytes memory initData = abi.encodeCall(Counter.initialize, (number));

        _deployCounter(proxyAdminOwner, initData);
    }

    function deployCounter_NoInit(address proxyAdminOwner) internal {
        _deployCounter(proxyAdminOwner, "");
    }

    function _deployCounter(address proxyAdminOwner, bytes memory initData) private {
        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));

        counterLogic = address(new Counter());
        counter = Counter(address(new TransparentUpgradeableProxy(counterLogic, proxyAdminOwner, initData)));

        vm.stopBroadcast();

        counterProxyAdmin =
            ProxyAdmin(address(uint160(uint256(vm.load(address(counter), hex"b53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103")))));
    }
}
