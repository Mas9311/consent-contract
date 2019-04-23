const Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider);

var ConsentContract = artifacts.require("ConsentContract.sol");

contract('ConsentContract:createParty', function(accounts) {
  let contract;

  beforeEach('setup contract for each test', async function () {
    // contract = await ConsentContract.new();
    contract = await ConsentContract.deployed();
  });

  it("create new Profile for all tests to use", async function() {
    await contract.createProfile("Alice", "Anderson", {gas: 100000, from: accounts[0]});
  });

  /** Success-result tests */

  it("should create a Party", async function() {
    // contract = await contract.deployed();
    await contract.createParty("AliceAndersonsParty_1a", {gas: 500000, from: accounts[0]});
  });

  it("should create a Party", async function() {
    // contract = await contract.deployed();
    let num = (web3.utils.padLeft(web3.utils.numberToHex(2), 2, "0"));
    console.log(num);

    await contract.createParty("AliceAndersonsParty_1b", num, {gas: 500000, from: accounts[0]});
  });


  /** Failure-result tests */
  //Uncomment the following tests (one by one) and they should fail. If they don't, there is a bug!

  // it("should not allow the creation of a Party with an existing name", async function() {
  //   let contract = await ConsentContract.deployed();
  //
  //   await contract.createProfile("Alice", "Anderson", {gas: 100000, from: accounts[0]});
  //   await contract.createParty("AliceAndersonsParty", {gas: 500000, from: accounts[0]});
  //
  //   await contract.createParty("AliceAndersonsParty", {gas: 500000, from: accounts[0]});
  // });

});
