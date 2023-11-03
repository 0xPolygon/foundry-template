// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import "forge-std/Test.sol";

import "script/1.0.0/Deploy.s.sol";

contract CounterTest is Test, Deploy {
    function setUp() public {
        run();
    }

    function test_IsInitialized() public {
        assertEq(counter.number(), 3);
    }

    function test_RevertsIf_AlreadyInitialized() public {
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        counter.initialize(1);
    }

    function test_IncrementsNumber() public {
        counter.increment();
        assertEq(counter.number(), 4);
    }

    function testFuzz_SetsNumber(uint256 x) public {
        counter.setNumber(x);
        assertEq(counter.number(), x);
    }
}
