// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "forge-std/Script.sol";
import "script/util/ScriptHelpers.sol";

import "script/deployers/DeployCounter.s.sol";

abstract contract Input {
    struct ProxyAdminInput {
        address initialOwner;
    }

    struct CounterInput {
        uint256 number;
    }

    struct NewInput {
        ProxyAdminInput ProxyAdmin;
        CounterInput Counter;
    }

    mapping(uint256 chainId => NewInput input) internal input;

    constructor() {
        input[31_337] = NewInput({ProxyAdmin: ProxyAdminInput({initialOwner: 0x356f394005D3316ad54d8f22b40D02Cd539A4a3C}), Counter: CounterInput({number: 10})});
    }

    function getInput() internal view returns (NewInput memory) {
        return input[block.chainid];
    }
}
