
var ConsentContract = artifacts.require("ConsentContract.sol");

contract('ConsentContract:createParty', function(accounts) {

  it("should create a Party", async function() {
    let contract = await ConsentContract.deployed();

    await contract.createProfile("Alice", "Anderson", {gas: 100000, from: accounts[0]});
    await contract.createParty("AliceAndersonsParty", {gas: 500000, from: accounts[0]});
  });

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
