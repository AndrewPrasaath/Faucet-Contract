const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Faucet", function () {
  let Faucet, faucet, owner;

  beforeEach("Faucet", async function () {
    Faucet = await ethers.getContractFactory("Faucet");
    faucet = await Faucet.deploy();
    //await faucet.deployed();

    [owner] = await ethers.getSigners();
  });

  describe("constructor", function () {
    it("should assign owner correctly", async function () {
      const faucetOwner = await faucet.getOwner();
      assert.equal(faucetOwner, owner.address);
    });
  });
});
