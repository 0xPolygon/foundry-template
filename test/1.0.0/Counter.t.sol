// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "forge-std/Test.sol";
import "test/util/TestHelpers.sol";

import "script/1.0.0/Deploy.s.sol";

abstract contract BeforeScript is Test, TestHelpers, CounterDeployer {
    Counter internal counter;

    function setUp() public {
        (counter, , ) = deployCounter_NoInit(makeAddr(""));
    }
}

contract CounterTest_Zero is BeforeScript {
    function test_Initializes(uint256 number) public {
        counter.initialize(number);
        assertEq(counter.number(), number);
    }
}

abstract contract AfterScript is Test, TestHelpers, Deploy {
    function setUp() public virtual {
        run();
    }
}

contract CounterTest_Initialized is AfterScript {
    function test_IsInitialized() public {
        assertEq(counter.number(), 10);
    }

    function test_RevertsIf_InitializedAgain() public {
        vm.expectRevert(Initializable.InvalidInitialization.selector);
        counter.initialize(1);
    }

    function test_IncrementsNumber() public {
        counter.increment();
        assertEq(counter.number(), 11);
    }

    function testFuzz_SetsNumber(uint256 x) public {
        counter.setNumber(x);
        assertEq(counter.number(), x);
    }

    function test_ReturnsVersion() public {
        assertEq(counter.version(), "1.0.0");
    }
}
