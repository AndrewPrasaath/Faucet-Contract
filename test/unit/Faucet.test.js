const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("Faucet", function () {
  let Faucet, faucet, owner, signer1;

  beforeEach("Faucet", async function () {
    Faucet = await ethers.getContractFactory("Faucet");
    faucet = await Faucet.deploy();
    //await faucet.deployed();

    [owner, signer1] = await ethers.getSigners();
  });

  describe("constructor", function () {
    it("should assign owner correctly", async function () {
      const faucetOwner = await faucet.getOwner();
      assert.equal(faucetOwner, owner.address);
    });
  });

  describe("destroy", function () {
    it("no one able to destroy the contract except owner", async function () {
      await expect(faucet.connect(signer1).destroy()).to.be.revertedWith(
        "Only contract owner can call this function"
      );
    });
    // it("contract destroys after calling selfdestruct", async function () {
    //   await faucet.connect(owner).destroy();
    //   const bytecode = await ethers.provider.getCode(faucet.address);
    //   assert.equal(bytecode, "0x");
    // });
  });
});
