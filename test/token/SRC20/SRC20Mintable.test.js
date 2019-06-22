const { shouldBehaveLikeSRC20Mintable } = require('./behaviors/SRC20Mintable.behavior');
const SRC20MintableMock = artifacts.require('SRC20MintableMock');
const { shouldBehaveLikePublicRole } = require('../../behaviors/access/roles/PublicRole.behavior');

contract('SRC20Mintable', function ([_, minter, otherMinter, ...otherAccounts]) {
  beforeEach(async function () {
    this.token = await SRC20MintableMock.new({ from: minter });
  });

  describe('minter role', function () {
    beforeEach(async function () {
      this.contract = this.token;
      await this.contract.addMinter(otherMinter, { from: minter });
    });

    shouldBehaveLikePublicRole(minter, otherMinter, otherAccounts, 'minter');
  });

  shouldBehaveLikeSRC20Mintable(minter, otherAccounts);
});
