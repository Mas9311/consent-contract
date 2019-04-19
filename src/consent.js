import web3 from "./web3";

const address = "0x0000000000000000000000000000000000000000";

const abi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "partyName",
        "type": "string"
      }
    ],
    "name": "createParty",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "partyName",
        "type": "string"
      }
    ],
    "name": "ownerCancels",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "partyName",
        "type": "string"
      }
    ],
    "name": "addGuestToParty",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "partyName",
        "type": "string"
      },
      {
        "name": "closeTimeInMinutes",
        "type": "uint16"
      }
    ],
    "name": "createParty",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "partyName",
        "type": "string"
      },
      {
        "name": "closeTimeInMinutes",
        "type": "uint16"
      },
      {
        "name": "maxNumberOfGuests",
        "type": "uint8"
      }
    ],
    "name": "createParty",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "fName",
        "type": "string"
      },
      {
        "name": "lName",
        "type": "string"
      }
    ],
    "name": "createProfile",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "partyName",
        "type": "string"
      },
      {
        "name": "maxNumberOfGuests",
        "type": "uint8"
      }
    ],
    "name": "createParty",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "partyName",
        "type": "string"
      }
    ],
    "name": "ownerConsents",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "fallback"
  }
];

export default new web3.eth.Contract(abi, address);
