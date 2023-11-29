// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import {CounterInput} from "script/deployers/DeployCounter.s.sol";

abstract contract Inputs {
    struct ProxyAdminInput {
        address initialOwner;
    }

    struct Input {
        ProxyAdminInput proxyAdmin;
        CounterInput counter;
    }

    Input internal input;

    mapping(uint256 chainId => Input input) internal _input;

    constructor() {
        _input[31_337] = Input(ProxyAdminInput({initialOwner: 0x356f394005D3316ad54d8f22b40D02Cd539A4a3C}), CounterInput({number: 10}));

        // Do NOT remove. Sets the input for the current chain.
        input = _input[block.chainid];
    }
}
