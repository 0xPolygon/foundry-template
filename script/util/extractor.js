const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

// ========== ABOUT ==========

/*

Given the latest broadcast file,
Update the deployment history and latest data for the chain.

Notes:

- The script assumes that the proxy is created immediately after the implementation contract.
- Only TransparentUpgradeableProxy by OpenZeppelin is supported.

*/

// ========== INPUTS ==========

const scriptName = process.argv[2]; // Replace with the appropriate index for scriptName
const chainId = process.argv[3]; // Replace with the appropriate index for chainId

async function main() {
  // ========== APPEND TO HISTORY ==========

  // Used for getVersion() helper
  const config = JSON.parse(fs.readFileSync(path.join(__dirname, "../config.json"), "utf-8"));
  const rpcUrl = config.defaultRpc[chainId] || process.env.RPC_URL || "http://127.0.0.1:8545";

  const filePath = path.join(__dirname, `../../broadcast/${scriptName}/${chainId}/run-latest.json`);
  // Load JSON data from file
  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const recordFilePath = path.join(__dirname, `../../deployments/json/${chainId}.json`);

  let recordData;

  try {
    // Try to read the existing record.json file
    recordData = JSON.parse(fs.readFileSync(recordFilePath, "utf8"));
  } catch (error) {
    // If the file doesn't exist, create a new object
    recordData = {
      chainId: chainId,
      latest: {},
      history: [],
    };
  }

  // If history is not empty, check if the latest entry is the same as the current commit
  if (recordData.history.length > 0) {
    const latestEntry = recordData.history[recordData.history.length - 1];
    if (latestEntry.commitHash === jsonData.commit) {
      // If the latest entry is the same as the current commit, exit the script
      console.log(`Commit ${jsonData.commit} already processed. Aborted.`);
      return;
    }
  }

  //TODO: Uncomment (see function definition).
  //prepareArtifacts();

  // Filter transactions with "transactionType" as "CREATE"
  const createTransactions = jsonData.transactions.filter((transaction) => transaction.transactionType === "CREATE");

  // Initialize an object to store the items
  const deploymentItems = {};

  // Iterate through the filtered transactions
  for (let i = 0; i < createTransactions.length; i++) {
    const currentTransaction = createTransactions[i];

    // Inside the loop where you process transactions
    if (i < createTransactions.length - 1 && createTransactions[i + 1].contractName === "TransparentUpgradeableProxy") {
      const upgradeableItem = {
        implementation: currentTransaction.contractAddress,
        proxyAdmin: createTransactions[i + 1].additionalContracts[0].address,
        address: createTransactions[i + 1].contractAddress,
        proxy: true,
        version: (await getVersion(createTransactions[i + 1].contractAddress, rpcUrl)).version,
        proxyType: "TransparentUpgradeableProxy",
        deploymentTxn: createTransactions[i + 1].hash,
        input: extractConstructorAndInitializeInputs(getABI(currentTransaction.contractName), {
          constructor: currentTransaction.arguments,
          // dump initData
          initialize: createTransactions[i + 1].arguments[2],
        }),
      };

      deploymentItems[currentTransaction.contractName] = upgradeableItem;

      // Skip the next iteration to avoid processing the proxy again
      i++;
    } else {
      const maybeNonUpgradeableItem = {
        address: currentTransaction.contractAddress,
        proxy: false,
        version: (await getVersion(currentTransaction.contractAddress, rpcUrl)).version,
        deploymentTxn: currentTransaction.hash,
        input: extractConstructorAndInitializeInputs(getABI(currentTransaction.contractName), {
          constructor: currentTransaction.arguments,
        }),
      };

      // Check if a contract with the same name exists in the latest data
      if (recordData.latest.hasOwnProperty(currentTransaction.contractName)) {
        const matchedItem = recordData.latest[currentTransaction.contractName];

        // Check if the latest item has a proxy
        if (matchedItem.proxy) {
          // Update the current object with data from the latest item
          maybeNonUpgradeableItem.implementation = currentTransaction.contractAddress;
          maybeNonUpgradeableItem.proxyAdmin = matchedItem.proxyAdmin;
          maybeNonUpgradeableItem.address = matchedItem.address;
          maybeNonUpgradeableItem.proxy = true;
          maybeNonUpgradeableItem.proxyType = matchedItem.proxyType;
          maybeNonUpgradeableItem.deploymentTxn = matchedItem.deploymentTxn;
        }

        // Define the order of fields
        const fieldOrder = [
          "implementation",
          "proxyAdmin",
          "address",
          "proxy",
          "version",
          "proxyType",
          "deploymentTxn",
          "input",
        ];

        // Create the object with the desired field order
        const upgradedItem = {};
        for (const fieldName of fieldOrder) {
          upgradedItem[fieldName] = maybeNonUpgradeableItem[fieldName];
        }

        deploymentItems[currentTransaction.contractName] = upgradedItem;
      } else {
        deploymentItems[currentTransaction.contractName] = maybeNonUpgradeableItem;
      }
    }
  }

  // Now you have named items in the `deploymentItems` object

  // Create a new JSON with the desired format
  const historyItem = { contracts: deploymentItems, timestamp: jsonData.timestamp, commitHash: jsonData.commit };

  // Append the historyItem to the history array
  recordData.history.push(historyItem);

  // ========== UPDATE LATEST ==========

  for (const contractName in historyItem.contracts) {
    if (historyItem.contracts.hasOwnProperty(contractName)) {
      const contractData = historyItem.contracts[contractName];

      // Check if an item with the same contract name exists in the latest object
      if (recordData.latest[contractName]) {
        // Update the existing entry in the latest object
        recordData.latest[contractName] = {
          ...recordData.latest[contractName], // Preserve existing data
          ...contractData, // Update with new data from historyItem
          timestamp: historyItem.timestamp, // Add timestamp
          commitHash: historyItem.commitHash, // Add commitHash
        };
        // Exclude the 'input' field from the latest object
        delete recordData.latest[contractName].input;
      } else {
        // Add a new entry to the latest object
        recordData.latest[contractName] = {
          ...contractData, // Add new data from historyItem
          timestamp: historyItem.timestamp, // Add timestamp
          commitHash: historyItem.commitHash, // Add commitHash
        };
        // Exclude the 'input' field from the latest object
        delete recordData.latest[contractName].input;
      }
    }
  }

  // ========== SAVE CHANGES ==========

  // Ensure the directory exists before writing the file
  const directoryPath = path.dirname(recordFilePath);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true }); // Create the directory if it doesn't exist
  }

  // Write the updated object back to the record.json file
  fs.writeFileSync(recordFilePath, JSON.stringify(recordData, null, 2), "utf8");
}

console.log("Extracting...");

main();

console.log(`Extraction complete.`);

// ========== HELPERS ==========

// IN: contract address and RPC URL
// OUT: contract version (.version)
async function getVersion(contractAddress, rpcUrl) {
  const hexToAscii = (str) => hexToUtf8(str).replace(/[\u0000-\u0008,\u000A-\u001F,\u007F-\u00A0]+/g, ""); // remove non-ascii chars
  const hexToUtf8 = (str) => new TextDecoder().decode(hexToUint8Array(str)); // note: TextDecoder present in node, update if not using nodejs
  function hexToUint8Array(hex) {
    const value = hex.toLowerCase().startsWith("0x") ? hex.slice(2) : hex;
    return new Uint8Array(Math.ceil(value.length / 2)).map((_, i) => parseInt(value.substring(i * 2, i * 2 + 2), 16));
  }

  try {
    const res = await (
      await fetch(rpcUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: Date.now(),
          method: "eth_call",
          params: [{ to: contractAddress, data: "0x54fd4d50" }, "latest"], // version()(string)
        }),
      })
    ).json();
    if (res.error) throw new Error(res.error.message);
    return { version: hexToAscii(res.result)?.trim() || res.result };
  } catch (e) {
    if (e.message === "execution reverted") return { version: undefined }; // contract does not implement getVersion()
    if (e.message.includes("fetch is not defined")) {
      console.warn("use node 18+");
    }
    throw e;
  }
}

// IN: contract ABI and input (constructor and initialize) values
// OUT: mappings of input names to values
// Note: If .initialize is a string, .initData will be dumped.
function extractConstructorAndInitializeInputs(abi, inputData) {
  const inputMapping = {};

  // Find the constructor in the ABI by type "constructor"
  const constructorFunc = abi.find((func) => func.type === "constructor");

  // Find the initialize function in the ABI by name "initialize"
  const initializeFunc = abi.find((func) => func.type === "function" && func.name === "initialize");

  if (constructorFunc && inputData.constructor) {
    // Match constructor inputs with their names
    inputMapping.constructor = {};
    constructorFunc.inputs.forEach((input, index) => {
      inputMapping.constructor[input.name] = inputData.constructor[index];
    });
  }

  if (initializeFunc) {
    if (typeof inputData.initialize === "string") {
      // If initialize is a string, create an "initData" field
      inputMapping.initData = inputData.initialize;
    } else if (inputData.initialize) {
      // Match initialize inputs with their names
      inputMapping.initialize = {};
      initializeFunc.inputs.forEach((input, index) => {
        inputMapping.initialize[input.name] = inputData.initialize[index];
      });
    }
  }

  return inputMapping;
}

// IN: contract name
// OUT: contract ABI
function getABI(contractName) {
  const filePath = path.join(__dirname, `../../out/${contractName}.sol/${contractName}.json`);
  const fileData = fs.readFileSync(filePath, "utf8");
  const abi = JSON.parse(fileData).abi;
  return abi;
}

// Note: Makes sure contract artifacts are up-to-date.
function prepareArtifacts() {
  //TODO: Make JS wait for these commands to finish before continuing.

  console.log(`Preparing artifacts...`);

  exec("forge clean", (error) => {
    if (error) {
      console.error(`Failed to forge clean.`);
      return;
    }
  });

  exec("forge build", (error) => {
    if (error) {
      console.error(`Failed to forge build.`);
      return;
    }
  });

  console.log(`Artifacts ready. Continuing...`);
}
