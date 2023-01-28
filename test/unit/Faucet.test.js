const { assert, expect } = require("chai");
const { ethers } = require("hardhat");

describe("Faucet", function () {
  let Faucet, faucet, owner, signer1, value, withdrawAmt;

  beforeEach("Faucet", async function () {
    Faucet = await ethers.getContractFactory("Faucet");
    faucet = await Faucet.deploy();
    [owner, signer1] = await ethers.getSigners();
    value = ethers.utils.parseEther("1");
    withdrawAmt = ethers.utils.parseEther("0.1");
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
    it("contract destroys after calling selfdestruct", async function () {
      await faucet.connect(owner).destroy();
      const bytecode = await ethers.provider.getCode(faucet.address);
      assert.equal(bytecode, "0x");
    });
  });

  describe("receive", function () {
    it("emits Deposit event while calling receive", async function () {
      const transaction = {
        to: faucet.address,
        value: value,
      };
      const tx = await owner.sendTransaction(transaction);
      expect(tx).to.emit(faucet, "Deposit");
    });
    it("balance increased after receiving ether", async function () {
      //const beforeBalance = await faucet.getBalance();
      await owner.sendTransaction({
        to: faucet.address,
        value: value,
      });
      const balance = await ethers.provider.getBalance(faucet.address);

      assert.equal(balance.toString(), "1000000000000000000");
    });
  });

  describe("withdraw", function () {
    it("should revert if withdraw amt is higher than 0.1 ether", async function () {
      await expect(faucet.connect(owner).withdraw(value)).to.be.revertedWith(
        "Exeeds withdraw limit!"
      );
    });
    it("should revert if faucet balance less than withdraw amt", async function () {
      await expect(
        faucet.connect(owner).withdraw(withdrawAmt)
      ).to.be.revertedWith("Insufficient Fund");
    });
    it("fuacet balance should update after withdraw", async function () {
      await owner.sendTransaction({
        to: faucet.address,
        value: value,
      });
      await faucet.connect(owner).withdraw(withdrawAmt);
      const balance = await ethers.provider.getBalance(faucet.address);
      assert.equal(balance.toString(), value - withdrawAmt);
    });
    it("should emit Withdraw event", async function () {
      await owner.sendTransaction({
        to: faucet.address,
        value: value,
      });
      expect(await faucet.connect(owner).withdraw(withdrawAmt)).to.emit(
        faucet,
        "Withdraw"
      );
    });
  });
});
