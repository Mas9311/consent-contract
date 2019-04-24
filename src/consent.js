import web3 from "./web3";

const address = "0xfB0C083466f440e3dbC996ba9059323F701f9214";
const abi = require("./compiled/ConsentContract.json")["abi"];
const bytecode = require("./compiled/ConsentContract.json")["bytecode"];

// console.log(abi); // To see if the abi works correctly. It does [:

export default new web3.eth.Contract(abi, address, { data: bytecode });
