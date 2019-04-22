const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledConsentContract = require("../ethereum/build/ConsentContract.json");

let accounts;
let consentContract;

// this mocha test suite is executed by the command "npm run test"


// each "it" block will execute a clean slate deployment of the contract with automatic "beforeEach" invocation
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  // console.log(accounts);

  consentContract = await new web3.eth.Contract(
      JSON.parse(compiledConsentContract.interface)
  )
      .deploy({ data: compiledConsentContract.bytecode })
      .send({ from: accounts[0], gas: "3000000" });
});

describe("Trojan Secret Contract", () => {

  it("consent contract can be deployed", () => {
    assert.ok(consentContract.options.address);
  });
});