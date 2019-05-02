import web3 from "./web3";

const abi = require("./compiled/ConsentContract")["abi"];
const address = "0xe890E5759170f3332404a7Df8a0b625B5b439c25"; // final contract address

export default new web3.eth.Contract(abi, address);