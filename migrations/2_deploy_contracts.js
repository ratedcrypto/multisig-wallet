const Wallet = artifacts.require('Wallet');

module.exports = async (deployer, _network, accounts) => {
  await deployer.deploy(Wallet, [accounts[0], accounts[1], accounts[2]], 2);
  const wallet = await Wallet.deployed();
  await web3.eth.sendTransaction({
    from: accounts[0],
    to: wallet.address,
    value: 50000000000000000
  });
};
