const { extractAndSaveJson } = require("./extractor.js");
const { generateAndSaveMarkdown } = require("./generateMarkdown.js");
/**
 * @description Extracts contract deployment data from run-latest.json (foundry broadcast output) and writes to deployments/{chainId}.json
 * @usage node script/utils/extract.js {chainId} [scriptName = "Deploy.s.sol"]
 * @dev
 *  currently only supports TransparentUpgradeableProxy pattern
 */
async function main() {
  validateInputs();
  let [chainId, scriptName] = process.argv.slice(2);
  if (!scriptName?.length) scriptName = "Deploy.s.sol";
  generateAndSaveMarkdown(await extractAndSaveJson(scriptName, chainId));
}

function validateInputs() {
  let [chainId, scriptName] = process.argv.slice(2);
  let printUsageAndExit = false;
  if (!(typeof chainId === "string" && ["string", "undefined"].includes(typeof scriptName)) || chainId === "help") {
    if (chainId !== "help") console.log(`error: invalid inputs: ${JSON.stringify({ chainId, scriptName }, null, 0)}\n`);
    printUsageAndExit = true;
  }
  if (printUsageAndExit) {
    console.log(`usage: node script/utils/extract.js {chainId} [scriptName = "Deploy.s.sol"]`);
    process.exit(1);
  }
}

main();
