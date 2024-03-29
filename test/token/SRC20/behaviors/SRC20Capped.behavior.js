const { shouldFail } = require('susyufo-test-helpers');

function shouldBehaveLikeSRC20Capped (minter, [other], cap) {
  describe('capped token', function () {
    const from = minter;

    it('should start with the correct cap', async function () {
      (await this.token.cap()).should.be.bignumber.equal(cap);
    });

    it('should mint when amount is less than cap', async function () {
      await this.token.mint(other, cap.subn(1), { from });
      (await this.token.totalSupply()).should.be.bignumber.equal(cap.subn(1));
    });

    it('should fail to mint if the amount exceeds the cap', async function () {
      await this.token.mint(other, cap.subn(1), { from });
      await shouldFail.reverting.withMessage(this.token.mint(other, 2, { from }), 'SRC20Capped: cap exceeded');
    });

    it('should fail to mint after cap is reached', async function () {
      await this.token.mint(other, cap, { from });
      await shouldFail.reverting.withMessage(this.token.mint(other, 1, { from }), 'SRC20Capped: cap exceeded');
    });
  });
}

module.exports = {
  shouldBehaveLikeSRC20Capped,
};
