const ConsentContract = artifacts.require("ConsentContract.sol");
const assert = require("assert");
let consent;

contract('ConsentContract:addGuestToParty', function(accounts) {

  before("Creates the deployed contract instance", async function () {
    // console.log("Only creates one instance of deployed Consent Contract");
    consent = await ConsentContract.deployed();

    await consent.createProfile("Night", "King", {from: accounts[0]}); // owner 0
    await consent.createProfile("Bran", "Stark", {from: accounts[1]}); // owner 1
    await consent.createProfile("Samwell", "Tarly", {from: accounts[2]});
    await consent.createParty1D("The Battle Of Winterfell", 5, 1, {from: accounts[0]})
    await consent.createParty1D("The Tree", 5, 1, {from: accounts[1]})



  });

  it("should fail to cancel party, not the party owner", async function () {
    try {
      await consent.ownerCancels("The Battle Of Winterfell", "I dont like fighting", {from: accounts[1]});
      assert.fail();
    } catch (err) {
      // console.log(err.toString());
      assert(true);
    }
  });
  it("should fail to cancel party, the party is full", async function () {
    try {
      await consent.addGuestToParty("The Battle Of Winterfell", {from: accounts[2]})
      await consent.ownerCancels("The Battle Of Winterfell", "I'm too slow", {from: accounts[0]});
      assert.fail();
    } catch (err) {
      // console.log(err.toString());
      assert(true);
    }
  });
  it("should cancel party", async function () {
    try {
      await consent.ownerCancels("The Tree", "It's Over", {from: accounts[1]});
      assert.fail();
    } catch (err) {
      // console.log(err.toString());
      assert(true);
    }
  });
});