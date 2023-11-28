const { readFileSync, existsSync, writeFileSync } = require("fs");
const { join } = require("path");

function generateAndSaveMarkdown(input) {
  console.log("Generating markdown...");
  let out = `# Polygon Foundry Template\n\n`;

  out += `\n### Table of Contents\n- [Summary](#summary)\n- [Contracts](#contracts)\n\t- `;
  out += Object.keys(input.latest)
    .map(
      (c) =>
        `[${c.replace(/([A-Z])/g, " $1").trim()}](#${c
          .replace(/([A-Z])/g, "-$1")
          .trim()
          .slice(1)
          .toLowerCase()})`,
    )
    .join("\n\t- ");
  out += `\n- [Deployment History](#deployment-history)`;
  const { deploymentHistoryMd, allVersions } = generateDeploymentHistory(input.history, input.latest, input.chainId);
  out += Object.keys(allVersions)
    .map((v) => `\n\t- [${v}](#${v.replace(/\./g, "")})`)
    .join("");

  out += `\n\n## Summary
    <table>
    <tr>
        <th>Contract</th>
        <th>Address</th>
        <th>Version</th>
    </tr>`;
  out += Object.entries(input.latest)
    .map(
      ([contractName, { address, version }]) =>
        `<tr>
        <td>${contractName}</td>
        <td>${getEtherscanLinkAnchor(input.chainId, address)}</td>
        <td>${version || `N/A`}</td>
        </tr>`,
    )
    .join("\n");
  out += `</table>\n`;

  out += `\n## Contracts\n\n`;

  out += Object.entries(input.latest)
    .map(
      ([
        contractName,
        { address, deploymentTxn, version, commitHash, timestamp, proxyType, implementation, proxyAdmin },
      ]) => `### ${contractName.replace(/([A-Z])/g, " $1").trim()}
  
  Address: ${getEtherscanLinkMd(input.chainId, address)}
  
  Deployment Txn: ${getEtherscanLinkMd(input.chainId, deploymentTxn, "tx")}
  
  ${
    typeof version === "undefined"
      ? ""
      : `Version: [${version}](https://github.com/0xPolygon/pol-token/releases/tag/${version})`
  }
  
  Commit Hash: [${commitHash.slice(0, 7)}](https://github.com/0xPolygon/pol-token/commit/${commitHash})
  
  ${prettifyTimestamp(timestamp)}
  ${generateProxyInformationIfProxy({
    address,
    contractName,
    proxyType,
    implementation,
    proxyAdmin,
    history: input.history,
    chainId: input.chainId,
  })}`,
    )
    .join("\n\n --- \n\n");

  out += `
  
  ----
  
  
  ### Deployment History
  
  ${deploymentHistoryMd}`;

  writeFileSync(join(__dirname, `../../deployments/${input.chainId}.md`), out, "utf-8");
  console.log("Generation complete!");
}

function getEtherscanLink(chainId, address, slug = "address") {
  chainId = parseInt(chainId);
  switch (chainId) {
    case 1:
      return `https://etherscan.io/${slug}/${address}`;
    case 5:
      return `https://goerli.etherscan.io/${slug}/${address}`;
    case 11155111:
      return `https://sepolia.etherscan.io/${slug}/${address}`;
    case 31337:
      return ``;
    default:
      return `https://blockscan.com/${slug}/${address}`;
  }
}
function getEtherscanLinkMd(chainId, address, slug = "address") {
  const etherscanLink = getEtherscanLink(chainId, address, slug);
  return etherscanLink.length ? `[${address}](${etherscanLink})` : address;
}
function getEtherscanLinkAnchor(chainId, address, slug = "address") {
  const etherscanLink = getEtherscanLink(chainId, address, slug);
  return etherscanLink.length ? `<a href="${etherscanLink}" target="_blank">${address}</a>` : address;
}

function generateProxyInformationIfProxy({
  address,
  contractName,
  proxyType,
  implementation,
  proxyAdmin,
  history,
  chainId,
}) {
  let out = ``;
  if (typeof proxyType === "undefined") return out;
  out += `\n\n_Proxy Information_\n\n`;
  out += `\n\nProxy Type: ${proxyType}\n\n`;
  out += `\n\nImplementation: ${getEtherscanLinkMd(chainId, implementation)}\n\n`;
  out += `\n\nProxy Admin: ${getEtherscanLinkMd(chainId, proxyAdmin)}\n\n`;

  const historyOfProxy = history.filter((h) => h?.contracts[contractName]?.address === address);
  if (historyOfProxy.length === 0) return out;
  out += `\n`;
  out += `
  <details>
  <summary>Implementation History</summary>
  <table>
      <tr>
          <th>Version</th>
          <th>Address</th>
          <th>Commit Hash</th>
      </tr>${historyOfProxy
        .map(
          ({
            contracts: {
              [contractName]: { implementation, version },
            },
            commitHash,
          }) => `
      <tr>
          <td><a href="https://github.com/0xPolygon/pol-token/releases/tag/${version}" target="_blank">${version}</a></td>
          <td>${getEtherscanLinkAnchor(chainId, implementation)}</td>
          <td><a href="https://github.com/0xPolygon/pol-token/commit/${commitHash}" target="_blank">${commitHash.slice(
            0,
            7,
          )}</a></td>
      </tr>`,
        )
        .join("")}
  </table>
  </details>
    `;
  return out;
}

function generateDeploymentHistory(history, latest, chainId) {
  let allVersions = {};
  if (history.length === 0) {
    const inputPath = join(__dirname, "../1.0.0/input.json");
    const input = JSON.parse((existsSync(inputPath) && readFileSync(inputPath, "utf-8")) || `{"${chainId}":{}}`)[
      chainId
    ];
    allVersions = Object.entries(latest).reduce((obj, [contractName, contract]) => {
      if (typeof contract.version === "undefined") return obj;
      if (!obj[contract.version]) obj[contract.version] = [];
      obj[contract.version].push({ contract, contractName, input });
      return obj;
    }, {});
  } else {
    allVersions = history.reduce((obj, { contracts, input, timestamp, commitHash }) => {
      Object.entries(contracts).forEach(([contractName, contract]) => {
        if (typeof contract.version === "undefined") return;
        if (!obj[contract.version]) obj[contract.version] = [];
        obj[contract.version].push({ contract: { ...contract, timestamp, commitHash }, contractName, input });
      });
      return obj;
    }, {});
  }

  let out = ``;
  out += Object.entries(allVersions)
    .map(
      ([version, contractInfos]) => `
  ### [${version}](https://github.com/0xPolygon/pol-token/releases/tag/${version})
  
  ${prettifyTimestamp(contractInfos[0].contract.timestamp)}
  
  Commit Hash: [${contractInfos[0].contract.commitHash.slice(0, 7)}](https://github.com/0xPolygon/pol-token/commit/${
        contractInfos[0].contract.commitHash
      })
  
  Deployed contracts:
  
  - ${contractInfos
    .map(
      ({ contract, contractName }) => `
      <details>
      <summary><a href="${getEtherscanLink(chainId, contract.address) || contract.address}">${contractName
        .replace(/([A-Z])/g, " $1")
        .trim()}</a>${
        contract.proxyType
          ? ` (<a href="${
              getEtherscanLink(chainId, contract.implementation) || contract.implementation
            }">Implementation</a>)`
          : ``
      }${
        isTransaction(contract.input.initializationTxn)
          ? ` (<a href="${getEtherscanLink(chainId, contract.input.initializationTxn, "tx")}">Initialization Txn</a>)`
          : ``
      }</summary>
      ${
        Object.keys(contract.input.constructor).length
          ? `
      <table>
          <tr>
              <th>Parameter</th>
              <th>Value</th>
          </tr>
          ${Object.entries(contract.input.constructor)
            .map(
              ([key, value]) => `
      <tr>
          <td>${key}</td>
          <td>${
            isAddress(value) || isTransaction(value)
              ? getEtherscanLinkAnchor(chainId, value, isTransaction(value) ? "tx" : "address")
              : value
          }</td>
      </tr>`,
            )
            .join("\n")}
      </table>
  `
          : ``
      }
      </details>
              `,
    )
    .join("\n- ")}    
  `,
    )
    .join("\n\n");

  return { deploymentHistoryMd: out, allVersions };
}

function prettifyTimestamp(timestamp) {
  return new Date(timestamp * 1000).toUTCString().replace("GMT", "UTC");
}

function isTransaction(str) {
  return /^0x([A-Fa-f0-9]{64})$/.test(str);
}
function isAddress(str) {
  return /^0x([A-Fa-f0-9]{40})$/.test(str);
}
module.exports = { generateAndSaveMarkdown };
