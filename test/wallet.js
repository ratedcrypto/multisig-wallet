require('chai').use(require('chai-as-promised')).should();
const { expectRevert } = require('@openzeppelin/test-helpers');
const { ether, EVM_REVERT } = require('./utils');

const Wallet = artifacts.require('Wallet');

contract('Wallet', (accounts) => {
  let wallet;

  beforeEach(async () => {
    wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);
    // Send 5 ETH to the wallet contract address
    await web3.eth.sendTransaction({
      from: accounts[0],
      to: wallet.address,
      value: ether(5)
    });
  });

  describe('deployment', () => {
    it('should have correct approvers', async () => {
      const result = await wallet.getApprovers();
      result.length.should.equal(3);
      result[0].should.equal(accounts[0]);
      result[1].should.equal(accounts[1]);
      result[2].should.equal(accounts[2]);
    });

    it('should have correct quorum', async () => {
      const result = await wallet.quorum();
      result.toString().should.equal('2');
    });

    it('should have correct balance', async () => {
      const result = await web3.eth.getBalance(wallet.address);
      result.should.equal(ether(5).toString());
    });
  });

  describe('creating Transfer', () => {
    it('should create a transfer from approved account', async () => {
      await wallet.createTransfer(ether(1), accounts[5], { from: accounts[0] });
      const result = await wallet.getTransfers();
      result[0].id.toString().should.equal('0');
      result[0].amount.toString().should.equal(ether(1).toString());
      result[0].to.should.equal(accounts[5]);
    });

    it('should reject a transfer from non approved account', async () => {
      await wallet
        .createTransfer(ether(1), accounts[5], { from: accounts[3] })
        .should.be.rejectedWith(EVM_REVERT);
    });

    it('should reject a transfer from non approved account (another way)', async () => {
      await expectRevert(
        wallet.createTransfer(ether(1), accounts[5], {
          from: accounts[3]
        }),
        'only approver allowed'
      );
    });
  });

  describe('approving Transfer', () => {
    it('should increment approval', async () => {
      await wallet.createTransfer(ether(1), accounts[5], { from: accounts[0] });
      await wallet.approveTransfer(0, { from: accounts[0] });
      const result = await wallet.getTransfers();
      result[0].approvers.should.equal('1');
      result[0].sent.should.equal(false);
      const balance = await web3.eth.getBalance(wallet.address);
      balance.should.equal(ether(5).toString());
    });

    it('should transfer if quorum reached', async () => {
      const balanceBefore = web3.utils.toBN(
        await web3.eth.getBalance(accounts[5])
      );
      await wallet.createTransfer(ether(1), accounts[5], { from: accounts[0] });
      await wallet.approveTransfer(0, { from: accounts[0] });
      await wallet.approveTransfer(0, { from: accounts[1] });
      const result = await wallet.getTransfers();
      result[0].approvers.should.equal('2');
      result[0].sent.should.equal(true);
      const contractBalance = await web3.eth.getBalance(wallet.address);
      contractBalance.should.equal(ether(4).toString());
      const balanceAfter = web3.utils.toBN(
        await web3.eth.getBalance(accounts[5])
      );
      const balanceDiff = balanceAfter.sub(balanceBefore);
      balanceDiff.toString().should.equal(ether(1).toString());
    });

    it('should not approve transfer if approver is not approved', async () => {
      await wallet.createTransfer(ether(1), accounts[5], { from: accounts[0] });
      await expectRevert(
        wallet.approveTransfer(0, { from: accounts[3] }),
        'only approver allowed'
      );
    });

    it('should not approve transfer if transfer is already sent', async () => {
      await wallet.createTransfer(ether(1), accounts[5], { from: accounts[0] });
      await wallet.approveTransfer(0, { from: accounts[0] });
      await wallet.approveTransfer(0, { from: accounts[1] });
      await expectRevert(
        wallet.approveTransfer(0, { from: accounts[2] }),
        'transfer has already been sent'
      );
    });

    it('should not approve transfer if transfer is already sent', async () => {
      await wallet.createTransfer(ether(1), accounts[5], { from: accounts[0] });
      await wallet.approveTransfer(0, { from: accounts[0] });
      await expectRevert(
        wallet.approveTransfer(0, { from: accounts[0] }),
        'transfer has already been approved'
      );
      const result = await wallet.getTransfers();
      result[0].approvers.should.equal('1');
      result[0].sent.should.equal(false);
    });
  });
});
