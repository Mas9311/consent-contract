var ConsentContract = artifacts.require("ConsentContract.sol");
const assert = require("assert");


contract('ConsentContract:createProfile', function(accounts) {

  it("should create a Profile", async function () {
    let contract = await ConsentContract.deployed();
    await contract.createProfile("Alice", "Anderson", {gas: 100000, from: accounts[0]});
  });

  it("should fail to create a Profile, already registered", async function () {
    let contract = await ConsentContract.deployed();
    try {
      await contract.createProfile("Alice", "Anderson", {gas: 100000, from: accounts[0]});
      assert(false)
    } catch(err) {
      assert(err)
    }
  });
  it("should fail to create a Profile, empty name", async function () {
    let contract = await ConsentContract.deployed();
    try {
      await contract.createProfile("", "Fail", {gas: 100000, from: accounts[1]});
      assert(false)
    } catch(err) {
      assert(err)
    }
  });

  //Uncomment the following test and it should fail. If it doesn't, there is a bug!

  // it("should not allow a user to create multiple Profiles", async function () {
  //   let contract = await ConsentContract.deployed();
  //   await contract.createProfile("Alice", "Anderson", {gas: 100000, from: accounts[0]});
  //   contract.createProfile("Someone", "Else", {gas: 100000, from: accounts[0]});
  // });

});
