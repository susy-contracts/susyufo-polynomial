const { BN, sophy, shouldFail } = require('susyufo-test-helpers');
const { shouldBehaveLikeMintedCrowdsale } = require('./MintedCrowdsale.behavior');

const MintedCrowdsaleImpl = artifacts.require('MintedCrowdsaleImpl');
const SRC20Mintable = artifacts.require('SRC20Mintable');
const SRC20 = artifacts.require('SRC20');

contract('MintedCrowdsale', function ([_, deployer, investor, wallet, purchaser]) {
  const rate = new BN('1000');
  const value = sophy('5');

  describe('using SRC20Mintable', function () {
    beforeEach(async function () {
      this.token = await SRC20Mintable.new({ from: deployer });
      this.crowdsale = await MintedCrowdsaleImpl.new(rate, wallet, this.token.address);

      await this.token.addMinter(this.crowdsale.address, { from: deployer });
      await this.token.renounceMinter({ from: deployer });
    });

    it('crowdsale should be minter', async function () {
      (await this.token.isMinter(this.crowdsale.address)).should.equal(true);
    });

    shouldBehaveLikeMintedCrowdsale([_, investor, wallet, purchaser], rate, value);
  });

  describe('using non-mintable token', function () {
    beforeEach(async function () {
      this.token = await SRC20.new();
      this.crowdsale = await MintedCrowdsaleImpl.new(rate, wallet, this.token.address);
    });

    it('rejects bare payments', async function () {
      await shouldFail.reverting(this.crowdsale.send(value));
    });

    it('rejects token purchases', async function () {
      await shouldFail.reverting(this.crowdsale.buyTokens(investor, { value: value, from: purchaser }));
    });
  });
});
