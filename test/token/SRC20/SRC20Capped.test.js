const { BN, sophy, shouldFail } = require('susyufo-test-helpers');
const { shouldBehaveLikeSRC20Mintable } = require('./behaviors/SRC20Mintable.behavior');
const { shouldBehaveLikeSRC20Capped } = require('./behaviors/SRC20Capped.behavior');

const SRC20Capped = artifacts.require('SRC20Capped');

contract('SRC20Capped', function ([_, minter, ...otherAccounts]) {
  const cap = sophy('1000');

  it('requires a non-zero cap', async function () {
    await shouldFail.reverting.withMessage(
      SRC20Capped.new(new BN(0), { from: minter }), 'SRC20Capped: cap is 0'
    );
  });

  context('once deployed', async function () {
    beforeEach(async function () {
      this.token = await SRC20Capped.new(cap, { from: minter });
    });

    shouldBehaveLikeSRC20Capped(minter, otherAccounts, cap);
    shouldBehaveLikeSRC20Mintable(minter, otherAccounts);
  });
});
