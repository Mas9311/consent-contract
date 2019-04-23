var ConsentContract = artifacts.require("ConsentContract.sol");

contract('ConsentContract:createProfile', function(accounts) {

  it("should create a Profile", async function () {
    let contract = await ConsentContract.deployed();
    await contract.createProfile("Alice", "Anderson", {gas: 100000, from: accounts[0]});
  });

  //Uncomment the following test and it should fail. If it doesn't, there is a bug!

  // it("should not allow a user to create multiple Profiles", async function () {
  //   let contract = await ConsentContract.deployed();
  //   await contract.createProfile("Alice", "Anderson", {gas: 100000, from: accounts[0]});
  //   contract.createProfile("Someone", "Else", {gas: 100000, from: accounts[0]});
  // });

});
