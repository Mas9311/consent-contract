import web3 from "./web3";

// const address = "0xfB0C083466f440e3dbC996ba9059323F701f9214"; // contract without modifier-functions
const address = "0xA61dB4628622109684E0E78cDCa91eBAeAa4C74b"; // newest contract
const abi = require("./compiled/ConsentContract")["abi"];
// const bytecode = require("./compiled/ConsentContract.json")["bytecode"];

// console.log(abi); // To see if the abi works correctly. It does [:

export default new web3.eth.Contract(abi, address);
