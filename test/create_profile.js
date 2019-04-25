const ConsentContract = artifacts.require("ConsentContract.sol");
const assert = require("assert");
let consent;

contract('ConsentContract:createProfile', function(accounts) {

  before("Creates the deployed contract instance", async function() {
    // console.log("Only creates one instance of deployed Consent Contract");
    consent = await ConsentContract.deployed();
  });

  it("should create a Profile", async function () {
    await consent.createProfile("Alice", "Anderson", {from: accounts[0]});
  });

  // tests the notStringEmptyModifier(firstName)
  it("should fail to create a Profile, first name is empty", async function () {
    try {
      await consent.createProfile("", "First Name is empty", {from: accounts[1]});
      assert(false)
    } catch (err) {
      // console.log(err.toString());
      assert.strictEqual(
          err.toString(),
          "Error: Returned error: VM Exception while processing transaction: revert " +
          "String cannot be empty -- Reason given: String cannot be empty."
      );
    }
  });

  // tests the notStringEmptyModifier(lastName)
  it("should fail to create a Profile, last name is empty", async function () {
    try {
      await consent.createProfile("Last Name is empty", "", {from: accounts[1]});
      assert(false)
    } catch (err) {
      // console.log(err.toString());
      assert.strictEqual(
          err.toString(),
          "Error: Returned error: VM Exception while processing transaction: revert " +
          "String cannot be empty -- Reason given: String cannot be empty."
      );
    }
  });

  // tests the profileDoesNotExistModifier
  it("should fail to create a Profile, already created a profile", async function () {
    try {
      await consent.createProfile("Failure", "Already created a Profile", {from: accounts[0]});
      assert(false)
    } catch (err) {
      // console.log(err.toString());
      assert.strictEqual(
          err.toString(),
          "Error: Returned error: VM Exception while processing transaction: revert " +
          "You have already created a profile -- Reason given: You have already created a profile."
      );
    }
  });
});
