# Contributing

- [Install](#install)
- [Pre-commit Hooks](#pre-commit-hooks)
- [Branching](#branching)
  - [Main](#main)
  - [Staging](#staging)
  - [Dev](#dev)
  - [Feature](#feature)
  - [Fix](#fix)
- [Repository Setup](#repository-setup)
- [Code Practices](#code-practices)
  - [Code Style](#code-style)
  - [Interfaces](#interfaces)
  - [NatSpec \& Comments](#natspec--comments)
- [Versioning](#versioning)
- [Testing](#testing)
  - [Deployer Template](#deployer-template)
- [Deployment](#deployment)
  - [Deployer Template](#deployer-template-1)
  - [Deployment](#deployment-1)
  - [Deployment Safety](#deployment-safety)
  - [Deployment Info Generation](#deployment-info-generation)
- [Deployer Template Script](#deployer-template-script)
- [Releases](#releases)

## Install

Follow these steps to set up your local environment for development:

- [Install foundry](https://book.getfoundry.sh/getting-started/installation)
- Install dependencies: `forge install`
- [Install pre-commit](https://pre-commit.com/#installation)
- Install pre commit hooks: `pre-commit install`

## Pre-commit Hooks

Follow the [installation steps](#install) to enable pre-commit hooks. To ensure consistency in our formatting `pre-commit` is used to check whether code was formatted properly and the documentation is up to date. Whenever a commit does not meet the checks implemented by pre-commit, the commit will fail and the pre-commit checks will modify the files to make the commits pass. Include these changes in your commit for the next commit attempt to succeed. On pull requests the CI checks whether all pre-commit hooks were run correctly.
This repo includes the following pre-commit hooks that are defined in the `.pre-commit-config.yaml`:

- `mixed-line-ending`: This hook ensures that all files have the same line endings (LF).
- `format`: This hook uses `forge fmt` to format all Solidity files.
- `doc`: This hook uses `forge doc` to automatically generate documentation for all Solidity files whenever the NatSpec documentation changes. The `script/util/doc_gen.sh` script is used to generate documentation. Forge updates the commit hash in the documentation automatically. To only generate new documentation when the documentation has actually changed, the script checks whether more than just the hash has changed in the documentation and discard all changes if only the hash has changed.
- `prettier`: All remaining files are formatted using prettier.

## Branching

This section outlines the branching strategy of this repo.

### Main

The main branch is supposed to reflect the deployed state on all networks. Any pull requests into this branch MUST come from the staging branch. The main branch is protected and requires a separate code review by the security team. Whenever the main branch is updated, a new release is created with the latest version. For more information on versioning, check [here](#versioning).

### Staging

The staging branch reflects new code complete deployments or upgrades containing fixes and/or features. Any pull requests into this branch MUST come from the dev branch. The staging branch is used for security audits and deployments. Once the deployment is complete and deployment log files are generated, the branch can be merged into main. For more information on the deployment and log file generation check [here](#deployment--versioning).

### Dev

This is the active development branch. All pull requests into this branch MUST come from fix or feature branches. Upon code completion this branch is merged into staging for auditing and deployment.

### Feature

Any new feature should be developed on a separate branch. The naming convention for these branches is `feat/*`. Once the feature is complete, a pull request into the dev branch can be created.

### Fix

Any bug fixes should be developed on a separate branch. The naming convention for these branches is `fix/*`. Once the fix is complete, a pull request into the dev branch can be created.

## Repository Setup

When creating a new repository from this template, configure the following branch protection rules to enforce the branching strategy described above.

### Main Branch Protection

- Require pull request before merging
  - Required approvals: 2 (at minimum)
  - Require review from Code Owners (ensures security team review via CODEOWNERS)
  - Dismiss stale reviews when new commits are pushed
- Require status checks to pass before merging
  - Required checks: `Build`, `Test`, `Coverage`, `Slither`, `pre-commit`
- Require branches to be up to date before merging
- Do not allow bypassing the above settings

### Staging Branch Protection

- Require pull request before merging
  - Required approvals: 1
- Require status checks to pass before merging
  - Required checks: `Build`, `Test`, `Coverage`, `Slither`, `pre-commit`

### Dev Branch Protection

- Require pull request before merging
  - Required approvals: 1
- Require status checks to pass before merging
  - Required checks: `Build`, `Test`, `pre-commit`

## Code Practices

### Code Style

The repo follows the official [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html). In addition to that, this repo also borrows the following rules from [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/GUIDELINES.md#solidity-conventions):

- Natspec comments should use triple-slash comments (///).

  ```solidity
  /// @dev Function to do something
  function doSomething() external {
  ```

- Internal or private state variables or functions should have an underscore prefix.

  ```solidity
  contract TestContract {
      uint256 private _privateVar;
      uint256 internal _internalVar;
      function _testInternal() internal { ... }
      function _testPrivate() private { ... }
  }
  ```

- Events should generally be emitted immediately after the state change that they
  represent, and should be named in the past tense. Some exceptions may be made for gas
  efficiency if the result doesn't affect observable ordering of events.

  ```solidity
  function _burn(address who, uint256 value) internal {
      super._burn(who, value);
      emit TokensBurned(who, value);
  }
  ```

- Interface names should have a capital I prefix.

  ```solidity
  interface IERC777 {
  ```

- Contracts not intended to be used standalone should be marked abstract
  so they are required to be inherited to other contracts.

  ```solidity
  abstract contract AccessControl is ..., {
  ```

- Unchecked arithmetic blocks should contain comments explaining why overflow is guaranteed not to happen. If the reason is immediately apparent from the line above the unchecked block, the comment may be omitted.

### Interfaces

Every contract MUST implement their corresponding interface that includes all externally callable functions, errors and events.

### NatSpec & Comments

Interfaces should be the entrypoint for all contracts. When exploring the a contract within the repository, the interface MUST contain all relevant information to understand the functionality of the contract in the form of NatSpec comments. This includes all externally callable functions, errors and events. The NatSpec documentation MUST be added to the functions, errors and events within the interface. This allows a reader to understand the functionality of a function before moving on to the implementation. The implementing functions MUST point to the NatSpec documentation in the interface using `@inheritdoc`. Internal and private functions shouldn't have NatSpec documentation except for `@dev` comments, whenever more context is needed. Additional comments within a function should only be used to give more context to more complex operations, otherwise the code should be kept readable and self-explanatory.

## Versioning

This repo utilizes [semantic versioning](https://semver.org/) for smart contracts. An `IVersioned` interface is included in the [interfaces directory](src/interface/IVersioned.sol) exposing a unified versioning interface for all contracts. This version MUST be included in all contracts, whether they are upgradeable or not, to be able to easily match deployed versions. For example, in the case of a non-upgradeable contract one version could be deployed to a network and later a new version might be deployed to another network. The exposed `version()` function is also used by the [Deployment Log Generator](https://github.com/0xPolygon/forge-chronicles#readme) to extract information about the version.

Whenever contracts are modified, only the version of the changed contracts should be updated. Unmodified contracts should remain on the version of their last change.

## Testing

### Deployer Template

This repo provides a deployer template library for consistency between scripts and unit tests. For more information on how to use the template, check [here](https://github.com/0xPolygon/deployer-kit#readme).

## Deployment

This repo utilizes versioned deployments. Any changes to a contract should update the version of this specific contract. A script is provided that extracts deployment information from the `run-latest.json` file within the `broadcast` directory generated while the forge script runs. From this information a JSON and markdown file is generated containing various information about the deployment itself as well as past deployments.

### Deployer Template

This repo provides a deployer template library for consistency between scripts and unit tests. For more information on how to use the template, check [here](https://github.com/0xPolygon/deployer-kit#readme).

### Deployment

This repo set up the following RPCs in the `foundry.toml` file:

- mainnet: Ethereum Mainnet
- sepolia: Ethereum Sepolia
- polygon_pos: Polygon PoS
- amoy: Polygon Amoy

To deploy the contracts, provide the `--broadcast` flag to the forge script command. Should the etherscan verification time out, it can be picked up again by replacing the `--broadcast` flag with `--resume`.
Deploy the contracts to one of the predefined networks by providing the according key with the `--rpc-url` flag. Most of the predefined networks require the `ALCHEMY_KEY` environment variable to be set in the `.env` file.
Including the `--verify` flag will verify deployed contracts on Etherscan. Define the appropriate environment variable for the Etherscan api key in the `.env` file.

```shell
forge script script/Deploy.s.sol --broadcast --rpc-url <rpc_url> --slow --verify
```

### Deployment Safety

Follow these steps for safe deployments:

1. **Simulate first.** Always run the deployment script without `--broadcast` to verify the transaction sequence:
   ```shell
   forge script script/Deploy.s.sol --rpc-url <rpc_url>
   ```

2. **Review the simulation output.** Check the simulated transactions in the `broadcast/` directory. Verify:
   - Correct contract addresses and constructor arguments
   - Expected number of transactions
   - Gas estimates are reasonable

3. **Deploy with `--slow`.** When broadcasting, use the `--slow` flag to wait for each transaction to be confirmed before sending the next:
   ```shell
   forge script script/Deploy.s.sol --broadcast --rpc-url <rpc_url> --slow --verify
   ```

4. **Handle verification timeouts.** If Etherscan verification times out, resume it without redeploying:
   ```shell
   forge script script/Deploy.s.sol --resume --rpc-url <rpc_url> --verify
   ```

5. **Post-deployment.** After successful deployment:
   - Generate deployment log files
   - Transfer ownership if applicable
   - Complete upgrade process if applicable
   - Update the PR checklist items in the pull request template

## Releases

Releases should be created whenever the code on the main branch is updated to reflect a deployment or an upgrade on a network. The release should be named after the version of the contracts deployed or upgraded.
The release should include the following:

- In case of a MAJOR version
  - changelog
  - summary of breaking changes
  - summary of new features
  - summary of fixes
- In case of a MINOR version
  - changelog
  - summary of new features
  - summary of fixes
- In case of a PATCH version
  - changelog
  - summary of fixes
- Deployment information (can be copied from the generated log files)
  - Addresses of the deployed contracts
