# ICounter
[Git Source](https://github.com/0xPolygon/foundry-template/blob/55b07186cd4779cbe55cc2f262f992aeabaf34ad/src/interface/ICounter.sol)

**Inherits:**
[IVersioned](/docs/autogen/src/src/interface/IVersioned.sol/interface.IVersioned.md)


## Functions
### number


```solidity
function number() external view returns (uint256);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|The current number|


### setNumber

Sets the number


```solidity
function setNumber(uint256 newNumber) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newNumber`|`uint256`|The new number|


### increment

Increments the number by 1


```solidity
function increment() external;
```

