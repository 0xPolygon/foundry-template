# Counter
[Git Source](https://github.com/0xPolygon/foundry-template/blob/a9f2dec0535500e07491e0f2e99dcf48319d8022/src/Counter.sol)

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


