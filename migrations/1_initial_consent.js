const ConsentContract = artifacts.require("./ConsentContract.sol");

module.exports = function(deployer) {
  deployer.deploy(ConsentContract);
};
