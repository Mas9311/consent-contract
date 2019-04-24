var ConsentContract = artifacts.require("ConsentContract.sol");
const assert = require("assert");


contract('ConsentContract:addGuestToParty', function(accounts) {
  it("should create a Party for invite testing", async function () {
    let contract = await ConsentContract.deployed();
    await contract.createProfile("Daenerys", "Targaryen", {gas: 100000, from: accounts[0]});
    await contract.createParty1B("The North", 3, {gas: 500000, from: accounts[0]});
  });

  it("should join createdParty", async function () {
    let contract = await ConsentContract.deployed();
    await contract.createProfile("Arya", "Stark", {gas: 100000, from: accounts[1]});
    await contract.addGuestToParty("The North", {gas: 500000, from: accounts[1]});
  });

  it("should fail to join createdParty, is Party owner", async function() {
    let contract = await ConsentContract.deployed();
    try {
      await contract.addGuestToParty("The North", {gas: 500000, from: accounts[0]});
      assert(false)
    } catch(err) {
      assert(err)
    }
  });


  it("should fail to join createdParty, already in party", async function() {
    let contract = await ConsentContract.deployed();
    try {
      await contract.addGuestToParty("The North", {gas: 500000, from: accounts[1]});
      assert(false)
    } catch(err) {
      assert(err)
    }
  });

  it("should join createdParty", async function () {
    let contract = await ConsentContract.deployed();
    await contract.createProfile("Jon", "Snow", {gas: 100000, from: accounts[2]});
    await contract.addGuestToParty("The North", {gas: 500000, from: accounts[2]});
  });

  it("should fail to join createdParty, partyFull", async function() {
    let contract = await ConsentContract.deployed();
    await contract.createProfile("Drogon", "The Dragon", {gas: 100000, from: accounts[3]});
    try {
      await contract.addGuestToParty("The North", {gas: 500000, from: accounts[3]});
      assert(false)
    } catch(err) {
      assert(err)
    }
  });

  it("should fail to join createdParty, party does not exist", async function() {
    let contract = await ConsentContract.deployed();
    try {
      await contract.addGuestToParty("The South", {gas: 500000, from: accounts[3]});
      assert(false)
    } catch(err) {
      assert(err)
    }
  });
});