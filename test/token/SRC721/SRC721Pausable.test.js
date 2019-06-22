require('susyufo-test-helpers');
const { shouldBehaveLikeSRC721PausedToken } = require('./SRC721PausedToken.behavior');
const { shouldBehaveLikeSRC721 } = require('./SRC721.behavior');
const { shouldBehaveLikePublicRole } = require('../../behaviors/access/roles/PublicRole.behavior');

const SRC721PausableMock = artifacts.require('SRC721PausableMock.pol');

contract('SRC721Pausable', function ([
  _,
  creator,
  otherPauser,
  ...accounts
]) {
  beforeEach(async function () {
    this.token = await SRC721PausableMock.new({ from: creator });
  });

  describe('pauser role', function () {
    beforeEach(async function () {
      this.contract = this.token;
      await this.contract.addPauser(otherPauser, { from: creator });
    });

    shouldBehaveLikePublicRole(creator, otherPauser, accounts, 'pauser');
  });

  context('when token is paused', function () {
    beforeEach(async function () {
      await this.token.pause({ from: creator });
    });

    shouldBehaveLikeSRC721PausedToken(creator, accounts);
  });

  context('when token is not paused yet', function () {
    shouldBehaveLikeSRC721(creator, creator, accounts);
  });

  context('when token is paused and then unpaused', function () {
    beforeEach(async function () {
      await this.token.pause({ from: creator });
      await this.token.unpause({ from: creator });
    });

    shouldBehaveLikeSRC721(creator, creator, accounts);
  });
});
