// invoke the compiler by executing "node compile.js" from the ethereum directory

const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const consentPath = path.resolve(__dirname, "contracts", "ConsentContract.sol");
const source = fs.readFileSync(consentPath, "utf8");

// console.log(solc.compile(JSON.stringify(source)));

const input = {
  language: 'Solidity',
  sources: {
    'ConsentContract.sol': {
      content: source
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': [
            '*'
        ]
        ,
        "": [
          "*" // /* or use */ "ast" // Enable the AST output of every single file.
        ]
      }
    }
  }
};

// console.log(input);
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// module.exports(output.contracts['ConsentContract.sol'][':ConsentContract']);

fs.ensureDirSync(buildPath);

// `output` here contains the JSON output as specified in the documentation
// for (let contractName in output.contracts['ConsentContract.sol']) {
const contractName = 'ConsentContract';

fs.outputJSONSync(
    path.resolve(buildPath, contractName + "_Compiled.json"),
    // output.contracts["ConsentContract.sol"][contractName]
    output
);

const interface_abi = output.contracts["ConsentContract.sol"][contractName].abi;
// console.log(contractName + ': ' + JSON.stringify(interface_abi, null, 2));

const bytecode = output.contracts['ConsentContract.sol'][contractName].evm.bytecode.object;
// console.log(contractName + ': ' + JSON.stringify(bytecode, null, 2));

fs.outputJSONSync(
    path.resolve(buildPath, contractName + "ABI.json"),
    interface_abi
);

fs.outputJSONSync(
    path.resolve(buildPath, contractName + ".json"),
    bytecode
);
console.log("Compiled " + contractName + "'s ABI and Bytecode.\nWrote files to " + buildPath);
// }

// module.exports({interface_abi, bytecode});