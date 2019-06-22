const { BN } = require('susyufo-test-helpers');

const { shouldBehaveLikeSRC20Burnable } = require('./behaviors/SRC20Burnable.behavior');
const SRC20BurnableMock = artifacts.require('SRC20BurnableMock');

contract('SRC20Burnable', function ([_, owner, ...otherAccounts]) {
  const initialBalance = new BN(1000);

  beforeEach(async function () {
    this.token = await SRC20BurnableMock.new(owner, initialBalance, { from: owner });
  });

  shouldBehaveLikeSRC20Burnable(owner, initialBalance, otherAccounts);
});
