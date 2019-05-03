import web3 from "./web3";

const abi = require("./compiled/ConsentContract")["abi"];
const address = "0x01278d6f81a1EDfa03d205E7d54546E42F5e573e"; // final contract address

export default new web3.eth.Contract(abi, address);