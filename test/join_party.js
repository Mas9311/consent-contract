const ConsentContract = artifacts.require("ConsentContract");
const assert = require("assert");
let consent;

contract('ConsentContract:addGuestToParty', function(accounts) {

  before("Creates the deployed contract instance", async function () {
    // console.log("Only creates one instance of deployed Consent Contract");
    consent = await ConsentContract.deployed();

    await consent.createProfile("Daenerys", "Targaryen", {from: accounts[0]}); // owner 0
    await consent.createProfile("Arya", "Stark", {from: accounts[1]}); // guest 1
    await consent.createProfile("Jon", "Snow", {from: accounts[2]}); // guest 2
    await consent.createProfile("Drogon", "The Dragon", {from: accounts[3]}); // No room for guest 3

  });

  it("should create the Party -- 1C max number of guests: 2", async function () {
    try {
      await consent.createParty1C("The North", 2, {from: accounts[0]});
    } catch (err) {
      // console.log(err.toString());
      assert.fail();
    }
  });

  // tests the profileExistsModifier
  it("should fail to join the Party, user has not created a profile", async function () {
    try {
      await consent.addGuestToParty("The North", {from: accounts[9]});
      assert.fail();
    } catch (err) {
      // console.log(err.toString());
      assert.strictEqual(
          err.toString(),
          "Error: Returned error: VM Exception while processing transaction: revert " +
          "You must first create a profile -- Reason given: You must first create a profile."
      );
    }
  });

  // tests the notStringEmptyModifier
  it("should fail to join the Party, party name is empty", async function () {
    try {
      await consent.addGuestToParty("", {from: accounts[1]});
      assert.fail();
    } catch (err) {
      // console.log(err.toString());
      assert.strictEqual(
          err.toString(),
          "Error: Returned error: VM Exception while processing transaction: revert " +
          "String cannot be empty -- Reason given: String cannot be empty."
      );
    }
  });

  // tests the notPartyOwnerModifier
  it("should fail to join the Party, is Party owner", async function () {
    try {
      await consent.addGuestToParty("The North", {from: accounts[0]});
      assert.fail();
    } catch (err) {
      // console.log(err.toString());
      assert.strictEqual(
          err.toString(),
          "Error: Returned error: VM Exception while processing transaction: revert " +
          "Party creator cannot be added as a guest -- Reason given: Party creator cannot be added as a guest."
      );
    }
  });

  it("should join the Party as guest #1", async function () {
    try {
      await consent.addGuestToParty("The North", {from: accounts[1]});
    } catch (err) {
      // console.log(err.toString());
      assert.fail();
    }
  });

  // tests the notYetAddedToPartyModifier
  it("should fail to join createdParty, already in party", async function () {
    try {
      await consent.addGuestToParty("The North", {from: accounts[1]});
      assert.fail();
    } catch (err) {
      // console.log(err.toString());
      assert.strictEqual(
          err.toString(),
          "Error: Returned error: VM Exception while processing transaction: revert " +
          "You are already in the party -- Reason given: You are already in the party."
      );
    }
  });

  // tests the notYetAddedToPartyModifier
  it("should fail to join createdParty, party does not exist", async function () {
    try {
      await consent.addGuestToParty("The South", {from: accounts[3]});
      assert.fail();
    } catch (err) {
      // console.log(err.toString());
      assert.strictEqual(
          err.toString(),
          "Error: Returned error: VM Exception while processing transaction: revert " +
          "Party is not in the Initialized state -- Reason given: Party is not in the Initialized state."
      );
    }
  });

  it("should join the Party as guest #2", async function () {
    try {
      await consent.addGuestToParty("The North", {from: accounts[2]});
    } catch (err) {
      // console.log(err.toString());
      assert.fail();
    }
  });

  // tests the partyInitializedModifier
  it("should fail to join createdParty, party full", async function () {
    try {
      await consent.addGuestToParty("The North", {from: accounts[3]});
      assert.fail();
    } catch (err) {
      // console.log(err.toString());
      assert.strictEqual(
          err.toString(),
          "Error: Returned error: VM Exception while processing transaction: revert " +
          "Party is not in the Initialized state -- Reason given: Party is not in the Initialized state."
      );
    }
  });

  // tests the notPartyHasExpiredModifier
  it("should fail due to party's expired time -- 1B time limit: 0; ", async function () {
    try {
      await consent.createParty1B("Already Expired", 0, {from: accounts[0]});
      await consent.addGuestToParty("Already Expired", {from: accounts[1]});
      assert.fail();
    } catch (err) {
      // console.log(err.toString());
      assert.strictEqual(
          err.toString(),
          "Error: Returned error: VM Exception while processing transaction: revert " +
          "Cannot join a party that has an expired time -- Reason given: Cannot join a party that has an expired time."
      );
    }
  });

});