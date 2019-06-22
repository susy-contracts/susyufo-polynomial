const { shouldFail } = require('susyufo-test-helpers');

const SRC20ReturnFalseMock = artifacts.require('SRC20ReturnFalseMock');
const SRC20ReturnTrueMock = artifacts.require('SRC20ReturnTrueMock');
const SRC20NoReturnMock = artifacts.require('SRC20NoReturnMock');
const SafeSRC20Wrapper = artifacts.require('SafeSRC20Wrapper');

contract('SafeSRC20', function ([_, hasNoCode]) {
  describe('with address that has no contract code', function () {
    beforeEach(async function () {
      this.wrapper = await SafeSRC20Wrapper.new(hasNoCode);
    });

    shouldRevertOnAllCalls('SafeSRC20: call to non-contract');
  });

  describe('with token that returns false on all calls', function () {
    beforeEach(async function () {
      this.wrapper = await SafeSRC20Wrapper.new((await SRC20ReturnFalseMock.new()).address);
    });

    shouldRevertOnAllCalls('SafeSRC20: SRC20 operation did not succeed');
  });

  describe('with token that returns true on all calls', function () {
    beforeEach(async function () {
      this.wrapper = await SafeSRC20Wrapper.new((await SRC20ReturnTrueMock.new()).address);
    });

    shouldOnlyRevertOnErrors();
  });

  describe('with token that returns no boolean values', function () {
    beforeEach(async function () {
      this.wrapper = await SafeSRC20Wrapper.new((await SRC20NoReturnMock.new()).address);
    });

    shouldOnlyRevertOnErrors();
  });
});

function shouldRevertOnAllCalls (reason) {
  it('reverts on transfer', async function () {
    await shouldFail.reverting.withMessage(this.wrapper.transfer(), reason);
  });

  it('reverts on transferFrom', async function () {
    await shouldFail.reverting.withMessage(this.wrapper.transferFrom(), reason);
  });

  it('reverts on approve', async function () {
    await shouldFail.reverting.withMessage(this.wrapper.approve(0), reason);
  });

  it('reverts on increaseAllowance', async function () {
    // [TODO] make sure it's reverting for the right reason
    await shouldFail.reverting(this.wrapper.increaseAllowance(0));
  });

  it('reverts on decreaseAllowance', async function () {
    // [TODO] make sure it's reverting for the right reason
    await shouldFail.reverting(this.wrapper.decreaseAllowance(0));
  });
}

function shouldOnlyRevertOnErrors () {
  it('doesn\'t revert on transfer', async function () {
    await this.wrapper.transfer();
  });

  it('doesn\'t revert on transferFrom', async function () {
    await this.wrapper.transferFrom();
  });

  describe('approvals', function () {
    context('with zero allowance', function () {
      beforeEach(async function () {
        await this.wrapper.setAllowance(0);
      });

      it('doesn\'t revert when approving a non-zero allowance', async function () {
        await this.wrapper.approve(100);
      });

      it('doesn\'t revert when approving a zero allowance', async function () {
        await this.wrapper.approve(0);
      });

      it('doesn\'t revert when increasing the allowance', async function () {
        await this.wrapper.increaseAllowance(10);
      });

      it('reverts when decreasing the allowance', async function () {
        await shouldFail.reverting.withMessage(
          this.wrapper.decreaseAllowance(10),
          'SafeMath: subtraction overflow'
        );
      });
    });

    context('with non-zero allowance', function () {
      beforeEach(async function () {
        await this.wrapper.setAllowance(100);
      });

      it('reverts when approving a non-zero allowance', async function () {
        await shouldFail.reverting.withMessage(
          this.wrapper.approve(20),
          'SafeSRC20: approve from non-zero to non-zero allowance'
        );
      });

      it('doesn\'t revert when approving a zero allowance', async function () {
        await this.wrapper.approve(0);
      });

      it('doesn\'t revert when increasing the allowance', async function () {
        await this.wrapper.increaseAllowance(10);
      });

      it('doesn\'t revert when decreasing the allowance to a positive value', async function () {
        await this.wrapper.decreaseAllowance(50);
      });

      it('reverts when decreasing the allowance to a negative value', async function () {
        await shouldFail.reverting.withMessage(
          this.wrapper.decreaseAllowance(200),
          'SafeMath: subtraction overflow'
        );
      });
    });
  });
}
