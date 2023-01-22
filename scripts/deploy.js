const { ethers } = require("ethers");
require("dotenv").config();

async function main() {
  const url = process.env.GOERLI_RPC_URL;
  let artifacts = await hre.artifacts.readArtifact("Faucet");
  const provider = new ethers.providers.JsonRpcProvider(url);
  let privateKey = process.env.PRIVATE_KEY;
  let wallet = new ethers.Wallet(privateKey, provider);

  let factory = new ethers.ContractFactory(
    artifacts.abi,
    artifacts.bytecode,
    wallet
  );
  let faucet = await factory.deploy();

  console.log(`Faucet Contract Address: ${faucet.address}`);

  await faucet.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
