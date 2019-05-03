import web3 from "./web3";

const abi = require("./compiled/ConsentContract")["abi"];
const address = "0x7B72188C77a6768eBBd05d105d7aC126176754af"; // final contract address

export default new web3.eth.Contract(abi, address);