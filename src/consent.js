import web3 from "./web3";

const abi = require("./compiled/ConsentContract")["abi"];
const address = "0x474E4ef2df9c9F5d1Fb3557bdE93fb449bDcd679"; // final contract address

export default new web3.eth.Contract(abi, address);