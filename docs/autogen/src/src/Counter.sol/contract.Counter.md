# Counter
[Git Source](https://github.com/0xPolygon/foundry-template/blob/8d1e780e7b907a30a740d7d96eeb5db9fb0b1450/src/Counter.sol)

**Inherits:**
[ICounter](/docs/autogen/src/src/interface/ICounter.sol/interface.ICounter.md)


## State Variables
### number

```solidity
uint256 public number;
```


## Functions
### constructor


```solidity
constructor(uint256 initialNumber);
```

### setNumber

set the number


```solidity
function setNumber(uint256 newNumber) public;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newNumber`|`uint256`|the new number|


### increment

increment the number by 1


```solidity
function increment() public;
```

### version


```solidity
function version() external pure returns (string memory);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`string`|the version of the contract|


