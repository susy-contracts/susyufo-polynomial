const { BN, constants, expectEvent, shouldFail } = require('susyufo-test-helpers');
const { ZERO_ADDRESS } = constants;

function shouldBehaveLikeMintAndBurnSRC721 (
  creator,
  minter,
  [owner, newOwner, approved]
) {
  const firstTokenId = new BN(1);
  const secondTokenId = new BN(2);
  const thirdTokenId = new BN(3);
  const unknownTokenId = new BN(4);
  const MOCK_URI = 'https://example.com';

  describe('like a mintable and burnable SRC721', function () {
    beforeEach(async function () {
      await this.token.mint(owner, firstTokenId, { from: minter });
      await this.token.mint(owner, secondTokenId, { from: minter });
    });

    describe('mint', function () {
      let logs = null;

      describe('when successful', function () {
        beforeEach(async function () {
          const result = await this.token.mint(newOwner, thirdTokenId, { from: minter });
          logs = result.logs;
        });

        it('assigns the token to the new owner', async function () {
          (await this.token.ownerOf(thirdTokenId)).should.be.equal(newOwner);
        });

        it('increases the balance of its owner', async function () {
          (await this.token.balanceOf(newOwner)).should.be.bignumber.equal('1');
        });

        it('emits a transfer and minted event', async function () {
          expectEvent.inLogs(logs, 'Transfer', {
            from: ZERO_ADDRESS,
            to: newOwner,
            tokenId: thirdTokenId,
          });
        });
      });

      describe('when the given owner address is the zero address', function () {
        it('reverts', async function () {
          await shouldFail.reverting.withMessage(
            this.token.mint(ZERO_ADDRESS, thirdTokenId, { from: minter }),
            'SRC721: mint to the zero address'
          );
        });
      });

      describe('when the given token ID was already tracked by this contract', function () {
        it('reverts', async function () {
          await shouldFail.reverting.withMessage(this.token.mint(owner, firstTokenId, { from: minter }),
            'SRC721: token already minted.'
          );
        });
      });
    });

    describe('mintWithTokenURI', function () {
      it('can mint with a tokenUri', async function () {
        await this.token.mintWithTokenURI(newOwner, thirdTokenId, MOCK_URI, {
          from: minter,
        });
      });
    });

    describe('burn', function () {
      const tokenId = firstTokenId;
      let logs = null;

      describe('when successful', function () {
        beforeEach(async function () {
          const result = await this.token.burn(tokenId, { from: owner });
          logs = result.logs;
        });

        it('burns the given token ID and adjusts the balance of the owner', async function () {
          await shouldFail.reverting.withMessage(
            this.token.ownerOf(tokenId),
            'SRC721: owner query for nonexistent token'
          );
          (await this.token.balanceOf(owner)).should.be.bignumber.equal('1');
        });

        it('emits a burn event', async function () {
          expectEvent.inLogs(logs, 'Transfer', {
            from: owner,
            to: ZERO_ADDRESS,
            tokenId: tokenId,
          });
        });
      });

      describe('when there is a previous approval burned', function () {
        beforeEach(async function () {
          await this.token.approve(approved, tokenId, { from: owner });
          const result = await this.token.burn(tokenId, { from: owner });
          logs = result.logs;
        });

        context('getApproved', function () {
          it('reverts', async function () {
            await shouldFail.reverting.withMessage(
              this.token.getApproved(tokenId), 'SRC721: approved query for nonexistent token'
            );
          });
        });
      });

      describe('when the given token ID was not tracked by this contract', function () {
        it('reverts', async function () {
          await shouldFail.reverting.withMessage(
            this.token.burn(unknownTokenId, { from: creator }), 'SRC721: operator query for nonexistent token'
          );
        });
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeMintAndBurnSRC721,
};
