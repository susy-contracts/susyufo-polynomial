const { BN } = require('susyufo-test-helpers');

const SRC20DetailedMock = artifacts.require('SRC20DetailedMock');

contract('SRC20Detailed', function () {
  const _name = 'My Detailed SRC20';
  const _symbol = 'MDT';
  const _decimals = new BN(18);

  beforeEach(async function () {
    this.detailedSRC20 = await SRC20DetailedMock.new(_name, _symbol, _decimals);
  });

  it('has a name', async function () {
    (await this.detailedSRC20.name()).should.be.equal(_name);
  });

  it('has a symbol', async function () {
    (await this.detailedSRC20.symbol()).should.be.equal(_symbol);
  });

  it('has an amount of decimals', async function () {
    (await this.detailedSRC20.decimals()).should.be.bignumber.equal(_decimals);
  });
});
