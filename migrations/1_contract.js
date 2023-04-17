var StorageContract = artifacts.require("Storage");

module.exports = function(deployer) {
  deployer.deploy(StorageContract);
};
