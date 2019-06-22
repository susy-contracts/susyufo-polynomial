const { BN } = require('susyufo-test-helpers');

const SRC721Holder = artifacts.require('SRC721Holder.pol');
const SRC721Mintable = artifacts.require('SRC721MintableBurnableImpl.pol');

contract('SRC721Holder', function ([creator]) {
  it('receives an SRC721 token', async function () {
    const token = await SRC721Mintable.new({ from: creator });
    const tokenId = new BN(1);
    await token.mint(creator, tokenId, { from: creator });

    const receiver = await SRC721Holder.new();
    await token.approve(receiver.address, tokenId, { from: creator });
    await token.safeTransferFrom(creator, receiver.address, tokenId);

    (await token.ownerOf(tokenId)).should.be.equal(receiver.address);
  });
});
