const ConsentContract = artifacts.require("ConsentContract");
const assert = require("assert");
let consent;

contract('ConsentContract:createParty', function(accounts) {

  before("Creates the deployed contract instance", async function () {
    // console.log("Only creates one instance of deployed Consent Contract");
    consent = await ConsentContract.deployed();

    await consent.createProfile("Alice", "Anderson", {from: accounts[0]});
  });

  it("should create a Party -- 1A", async function () {
    try {
      await consent.createParty1A("Default 1A", {from: accounts[0]});
    } catch (err) {
      // console.log(err.toString());
      assert.fail();
    }
  });

  it("should create a Party -- 1B time limit", async function () {
    try {
      await consent.createParty1B("Max Guests 1B", 1, {from: accounts[0]});
    } catch (err) {
      // console.log(err.toString());
      assert.fail();
    }
  });

  it("should create a Party -- 1C max number of guests", async function () {
    try {
      await consent.createParty1C("Time Limit 1C", 5, {from: accounts[0]});
    } catch (err) {
      // console.log(err.toString());
      assert.fail();
    }
  });

  it("should create a Party -- 1D time limit + max number of guests", async function () {
    try {
      await consent.createParty1D("Max Guests + Time Limit 1D", 1, 5, {from: accounts[0]});
    } catch (err) {
      // console.log(err.toString());
      assert.fail();
    }
  });

  // tests the profileExistsModifier
  it("should fail to create a Party, no existing profile", async function () {
    try {
      await consent.createParty1A("No Account", {from: accounts[9]});
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
  it("should fail to create a Party, party name empty", async function () {
    try {
      await consent.createParty1A("", {from: accounts[0]});
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

  // tests the partyDoesNotExistModifier
  it("should fail to create a Party, party already created", async function () {
    try {
      await consent.createParty1A("Default 1A", {from: accounts[0]});
      assert.fail();
    } catch (err) {
      // console.log(err.toString());
      assert.strictEqual(
          err.toString(),
          "Error: Returned error: VM Exception while processing transaction: revert " +
          "Party is already created -- Reason given: Party is already created."
      );
    }
  });

});
