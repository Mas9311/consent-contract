const truffleAssert = require('truffle-assertions');

var ConsentContract = artifacts.require("./ConsentContract.sol");

contract('ConsentContract:createProfile', function(accounts) {
  it("should create a Profile", async function () {
    let contract = await ConsentContract.deployed();
    await contract.createProfile("Alice", "Anderson", {gas: 100000, from: accounts[0]});
    assert(true);
    console.log("Created profile");
  });

  it("should not allow to create multitple Profiles", async function () {
    let contract = await ConsentContract.deployed();
    await contract.createProfile("Alice", "Anderson", {gas: 100000, from: accounts[0]});
    await truffleAssert.fails(
      contract.createProfile("Alice", "Anderson", {gas: 100000, from: accounts[0]}),
      truffleAssert.ErrorType.REVERT,
      "You have already created a profile"
  );
  });

});
