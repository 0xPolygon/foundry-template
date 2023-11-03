# Counter
[Git Source](https://github.com/0xPolygon/foundry-template/blob/8733bac54bd9be835d614ad4c7c76632d78ceaa0/src/Counter.sol)

**Inherits:**
[ICounter](/docs/html/src/src/interface/ICounter.sol/interface.ICounter.md)


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


