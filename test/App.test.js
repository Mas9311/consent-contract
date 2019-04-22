// `npm test` will run all tests in this file

// imports
const assert = require("assert");
const Web3 = require("web3");
const ganache = require("ganache-cli");
const ganacheOptions = { gasLimit: 10000000 };
const provider = ganache.provider(ganacheOptions);
const web3 = new Web3(provider);

// variables
// const compiledConsentContract = require("../ethereum/compile.js");
// const interface_abi = compiledConsentContract.interface_abi;
// const bytecode = compiledConsentContract.bytecode;
// const interface_abi = compiledConsentContract.contracts['ConsentContract.sol']['ConsentContract'].abi;
// const bytecode = compiledConsentContract.contracts['ConsentContract.sol']['ConsentContract'].evm.bytecode.object;
const interface_abi = require("../ethereum/build/ConsentContractABI.json");
const bytecode = require("../ethereum/build/ConsentContract.json");
let accounts;
let consent;


// Before each of the tests in describe section below, create a new instance of contract by deploying it.
beforeEach('The ConsentContract', async () => {
  accounts = await web3.eth.getAccounts(); // 10 accounts are generated will 100 eth each.
  console.log(accounts[9]);
  const estimatedGas = await web3.eth.estimateGas({data: bytecode}) + 1;
  console.log(estimatedGas);

  const contractOptions = {
    data: bytecode,
    from: accounts[9],
    gas: estimatedGas,
    gasLimit: "10000000"
  };
  consent = await new web3.eth.Contract(interface_abi, accounts[9], contractOptions);
  consent.deploy().send();
});

// These are the tests used to verify our solidity functions correctly
describe("Consent Contract", async () => {

  it("can be deployed", () => {
    console.log(consent.options.address);
    assert.ok(consent.options.address);
  });

  it("can create a Party", async () => {
    await consent.methods.createProfile("A", "A").send({
      from: accounts[1],
      gas: "1000000"
    });
    await consent.methods.createParty("ThisIsAlicesParty").send({
      from: accounts[1],
      gas: "1000000"
    });
    assert(true); // will need to create a method for checking if a party is State.Initialized
  });

  // it("cannot create two identical Partes", async () => {
  //   await consent.methods.createParty("ThisIsAlicesParty").send({
  //     from: accounts[0],
  //     gas: "1000000"
  //   });
  //   await consent.methods.createParty("ThisIsAlicesParty").send({
  //     from: accounts[0],
  //     gas: "1000000"
  //   });
  //   assert(true);
  // });

});
