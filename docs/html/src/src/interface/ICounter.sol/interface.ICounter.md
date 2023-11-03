# ICounter
[Git Source](https://github.com/0xPolygon/foundry-template/blob/8733bac54bd9be835d614ad4c7c76632d78ceaa0/src/interface/ICounter.sol)

**Inherits:**
[IVersioned](/docs/html/src/src/interface/IVersioned.sol/interface.IVersioned.md)


## Functions
### number


```solidity
function number() external view returns (uint256);
```
**Returns**

|Name|Type|Description|
|----|----|-----------|
|`<none>`|`uint256`|the current number|


### setNumber

set the number


```solidity
function setNumber(uint256 newNumber) external;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newNumber`|`uint256`|the new number|


### increment

increment the number by 1


```solidity
function increment() external;
```

