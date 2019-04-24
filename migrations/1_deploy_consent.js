const ConsentContract = artifacts.require("ConsentContract");

module.exports = function(deployer) {
  deployer.deploy(ConsentContract);
};
