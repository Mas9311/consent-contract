const ConsentContract = artifacts.require("ConsentContract");
const assert = require("assert");
let consent;

contract('ConsentContract:cancelParty', function(accounts) {

  before("Creates the deployed contract instance", async function () {
    // console.log("Only creates one instance of deployed Consent Contract");
    consent = await ConsentContract.deployed();

    await consent.createProfile("Night", "King", {from: accounts[0]}); // owner 0
    await consent.createProfile("Bran", "Stark", {from: accounts[1]}); // owner 1
    await consent.createProfile("Samwell", "Tarly", {from: accounts[2]});
    await consent.createParty1D("The Battle Of Winterfell", 5, 1, {from: accounts[0]});
    await consent.createParty1D("The Tree", 5, 1, {from: accounts[1]});
  });

  // tests the partyOwnerModifier
  it("should fail to cancel party, not the party owner", async function () {
    try {
      await consent.ownerCancels("The Battle Of Winterfell", "I dont like fighting", {from: accounts[1]});
      assert.strict.fail();
    } catch (err) {
      // console.log(err.toString());
      assert.strictEqual(
          err.toString(),
          "Error: Returned error: VM Exception while processing transaction: revert " +
          "You must be the party's creator to access -- Reason given: You must be the party's creator to access."
      );
    }
  });

  // tests the partyNotFullModifier and partyInitializedModifier
  it("should fail to cancel party, the party is full", async function () {
    try {
      await consent.addGuestToParty("The Battle Of Winterfell", {from: accounts[2]});
      await consent.ownerCancels("The Battle Of Winterfell", "I'm too slow", {from: accounts[0]});
      assert.strict.fail();
    } catch (err) {
      // console.log(err.toString());
      assert.strictEqual(
          err.toString(),
          "Error: Returned error: VM Exception while processing transaction: revert " +
          "No more guests can join the party -- Reason given: No more guests can join the party."
      );
    }
  });

  it("should cancel party", async function () {
    try {
      await consent.ownerCancels("The Tree", "It's Over", {from: accounts[1]});
      assert(true);
    } catch (err) {
      console.log(err.toString());
      assert.strict.fail();
    }
  });

});