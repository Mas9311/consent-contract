const Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider);

var ConsentContract = artifacts.require("ConsentContract.sol");

contract('ConsentContract:createParty', function(accounts) {

  /** Success-result tests */

  it("should create a Party (1a)", async function() {
    let contract = ConsentContract.deployed();

    await contract.createProfile("Alice", "Anderson", {gas: 500000, from: accounts[0]});
    await contract.createParty1A("AliceAndersonsParty_1a", {gas: 500000, from: accounts[0]});
  });

  it("should create a Party with maxNumber of Guests (1b)", async function() {
    let contract = ConsentContract.deployed();

    await contract.createProfile("Alice", "Anderson", {gas: 500000, from: accounts[0]});
    await contract.createParty1B("AliceAndersonsParty_1b", 2, {gas: 500000, from: accounts[0]});
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
