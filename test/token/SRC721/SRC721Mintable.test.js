require('susyufo-test-helpers');
const { shouldBehaveLikeSRC721 } = require('./SRC721.behavior');
const { shouldBehaveLikeMintAndBurnSRC721 } = require('./SRC721MintBurn.behavior');

const SRC721MintableImpl = artifacts.require('SRC721MintableBurnableImpl.pol');

contract('SRC721Mintable', function ([_, creator, ...accounts]) {
  const minter = creator;

  beforeEach(async function () {
    this.token = await SRC721MintableImpl.new({
      from: creator,
    });
  });

  shouldBehaveLikeSRC721(creator, minter, accounts);
  shouldBehaveLikeMintAndBurnSRC721(creator, minter, accounts);
});
