const { shouldFail } = require('susyufo-test-helpers');
const { shouldSupportInterfaces } = require('./SupportsInterface.behavior');

const SRC165Mock = artifacts.require('SRC165Mock');

contract('SRC165', function () {
  beforeEach(async function () {
    this.mock = await SRC165Mock.new();
  });

  it('does not allow 0xffffffff', async function () {
    await shouldFail.reverting.withMessage(this.mock.registerInterface('0xffffffff'), 'SRC165: invalid interface id');
  });

  shouldSupportInterfaces([
    'SRC165',
  ]);
});
