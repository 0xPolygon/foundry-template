const fs = require("fs");
const path = require("path");

// Function to replace occurrences of 'Example', 'uint256 arg', and 'arg' in a file
const replaceInFile = (filePath, newFilePath, replacementExample, replacementArgs, replacementPathToExample) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return console.error(err);
    }

    let regexExample = new RegExp("<Example>", "g");
    let regexExampleVar = new RegExp("<example>", "g");
    let regexArgs = new RegExp("<uint256 arg>", "g");
    let regexArgsNames = new RegExp("<arg>", "g");
    let regexPathToExample = new RegExp("<src/Example.sol>", "g");

    let updatedData = data.replace(regexExample, replacementExample);
    updatedData = updatedData.replace(
      regexExampleVar,
      replacementExample.charAt(0).toLowerCase() + replacementExample.slice(1)
    );
    updatedData = updatedData.replace(regexArgs, replacementArgs);
    updatedData = updatedData.replace(regexArgsNames, processString(replacementArgs));
    updatedData = updatedData.replace(regexPathToExample, replacementPathToExample);

    fs.writeFile(newFilePath, updatedData, "utf8", (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Deployer generated.");

        if (replacementArgs.length === 0) {
          fs.readFile(newFilePath, "utf8", (err, data) => {
            if (err) {
              return console.error(err);
            }

            // Find the index of the first occurrence of "address proxyAdmin" and replace it
            const index = data.indexOf("address proxyAdmin,\n");
            if (index !== -1) {
              const newData =
                data.slice(0, index) + "address proxyAdmin" + data.slice(index + "address proxyAdmin,\n".length);
              // Write the updated content back to the file
              fs.writeFile(newFilePath, newData, "utf8", (err) => {
                if (err) return console.error(err);
              });
            } else {
              console.log('No match found for "address proxyAdmin," in the file.');
            }
          });
        }
      }
    });
  });
};

function processString(inputString) {
  if (inputString.includes(",")) {
    const words = inputString.split(",");
    const lastWords = words.map((word) => word.trim().split(" ").pop());
    return lastWords.join(", ");
  } else {
    return inputString.trim().split(" ").pop();
  }
}

// Replace occurrences in the specified file with the provided arguments
const filePath = "script/util/deployer_template";
const replacementPathToExample = process.argv[2];
const replacementArgs = process.argv[3];
const newFilePath = process.argv[4];
let replacementExample;

// Extract the file name from the path by splitting the string based on the '/' delimiter
const parts = replacementPathToExample.split("/");
// Get the last part of the path, which is the file name with the extension
const fileNameWithExtension = parts[parts.length - 1];
// Split the file name by the dot('.') to get the name and the extension separately
const fileNameParts = fileNameWithExtension.split(".");
// Check if there is more than one element in the fileNameParts array
if (fileNameParts.length > 1) {
  // Join the parts of the file name excluding the last element (the extension)
  replacementExample = fileNameParts.slice(0, -1).join(".");
} else {
  // The file name as it is if no extension is found
  replacementExample = fileNameParts[0];
}

if (!replacementPathToExample || !newFilePath) {
  console.error("Usage: node script/util/generateDeployer.js <contractFile> [init params] <outputDir>");
  process.exit(1);
}

let filePathPrefix = newFilePath;

const formattedPath = path.join(filePathPrefix, "Deploy" + replacementExample + ".s.sol");

replaceInFile(filePath, formattedPath, replacementExample, replacementArgs, replacementPathToExample);

// TODO: Format the new file
