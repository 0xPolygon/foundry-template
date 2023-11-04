# Counter
[Git Source](https://github.com/0xPolygon/foundry-template/blob/1982945ef9a5f6e6ec018759f8fcd1f51129ed46/src/Counter.sol)

**Inherits:**
[ICounter](/docs/autogen/src/src/interface/ICounter.sol/interface.ICounter.md), Initializable


## State Variables
### number

```solidity
uint256 public number;
```


## Functions
### initialize


```solidity
function initialize(uint256 initialNumber) public initializer;
```

### setNumber

Sets the number.


```solidity
function setNumber(uint256 newNumber) public;
```
**Parameters**

|Name|Type|Description|
|----|----|-----------|
|`newNumber`|`uint256`|The new number.|


### increment

Increments the number by 1.


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
|`<none>`|`string`|The version of the contract.|


