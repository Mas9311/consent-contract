// invoke the compiler by executing "node compile.js" from the ethereum directory

const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const TSPath = path.resolve(__dirname, "contracts", "ConsentContract.sol");
const source = fs.readFileSync(TSPath, "utf8");

var input = {
  language: 'Solidity',
  sources: {
    'ConsentContract.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': [ '*' ]
      }
    }
  }
};

console.log(input);
var output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log(output);

fs.ensureDirSync(buildPath);

// `output` here contains the JSON output as specified in the documentation
for (var contractName in output.contracts['ConsentContract.sol']) {
  fs.outputJsonSync(
      path.resolve(buildPath, contractName + ".json"),
      output.contracts['ConsentContract.sol'][contractName].evm.bytecode.object
  );
  console.log(contractName + ': ' + output.contracts['ConsentContract.sol'][contractName])
}

// const TSPath = path.resolve(__dirname, "contracts", "ConsentContract.sol");
// const source = fs.readFileSync(TSPath, "utf8");
// const output = solc.compile(source, 1).contracts;
//
//
// for (let contract in output) {
//   fs.outputJsonSync(
//     path.resolve(buildPath, contract.replace(":", "") + ".json"),
//     output[contract]
//   );
// }
