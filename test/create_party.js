var ConsentContract = artifacts.require("ConsentContract.sol");
const assert = require("assert");

contract('ConsentContract:createParty', function(accounts) {

  /** Success-result tests */

  it("should create a Party (1a)", async function() {
    let contract = await ConsentContract.deployed();
    await contract.createProfile("Alice", "Anderson", {gas: 100000, from: accounts[0]});
    await contract.createParty1A("AliceAndersonsParty_1a", {gas: 500000, from: accounts[0]});
  });

  it("should create a Party with maxNumber of Guests (1b)", async function() {
    let contract = await ConsentContract.deployed();

    await contract.createParty1B("AliceAndersonsParty_1b", 2, {gas: 500000, from: accounts[0]});
  });

  it("should fail to create a Party, party already created", async function() {
    let contract = await ConsentContract.deployed();
    try {
      await contract.createParty1B("AliceAndersonsParty_1b", 2, {gas: 500000, from: accounts[1]});
      assert(false)
    } catch(err) {
      assert(err)
    }
  });
  it("should fail to create a Party, party name empty", async function() {
    let contract = await ConsentContract.deployed();
    try {
      await contract.createParty1B("", 2, {gas: 500000, from: accounts[1]});
      assert(false)
    } catch(err) {
      assert(err)
    }
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
