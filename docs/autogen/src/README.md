## Template Repo (Foundry)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI Status](../../actions/workflows/test.yaml/badge.svg)](../../actions)

TODO: summary of the features of the template repo

#### Table of Contents

- [Features](#features)
- [Setup](#setup)
- [Deployment](#deployment)
- [Docs](#docs)
- [Contributing](#contributing)

## Features

- **auto-generated docs** with `./doc.gen.sh`
- **storage check** when upgrading contracts
- **pre-commit** hooks (need to be installed once. Config in `.pre-commit-config.yaml`)
- **report generation** with `extract.js` (uses broadcast file to generate full report of deployments)
- **Forced code-review** (`CODEOWNERS`)
- **PR template** (`PULL_REQUEST_TEMPLATE.md`)
- auto-generate deploy helpers (generateDeployer.js)
- Solidity file specifying inputs for deploy scripts (Input.sol)
- _solady_ for gas-sensitive use cases
- IVersioned interface

## Setup

Follow these steps to set up your local environment:

- [Install foundry](https://book.getfoundry.sh/getting-started/installation)
- Install dependencies: `forge install`
- Build contracts: `forge build`
- Test contracts: `forge test`

If you intend to develop on this repo, follow the steps outlined in [CONTRIBUTING.md](CONTRIBUTING.md#install).

## Deployment

This repo utilizes versioned deployments. For more information on how to use forge scripts within the repo, check [here](CONTRIBUTING.md#deployment).

Smart contracts are deployed or upgraded using the following command:

```shell
forge script script/1.0.0/Deploy.s.sol --broadcast --rpc-url <rpc_url> --verify
```

## Docs

The documentation and architecture diagrams for the contracts within this repo can be found [here](docs/).
Detailed documentation generated from the NatSpec documentation of the contracts can be found [here](docs/autogen/src/src/).
When exploring the contracts within this repository, it is recommended to start with the interfaces first and then move on to the implementation as outlined [here](CONTRIBUTING.md#natspec--comments)

## Contributing

If you want to contribute to this project, please check [CONTRIBUTING.md](CONTRIBUTING.md) first.

---

© 2023 PT Services DMCC
