require('susyufo-test-helpers');

const SRC20MetadataMock = artifacts.require('SRC20MetadataMock');

const metadataURI = 'https://example.com';

describe('SRC20Metadata', function () {
  beforeEach(async function () {
    this.token = await SRC20MetadataMock.new(metadataURI);
  });

  it('responds with the metadata', async function () {
    (await this.token.tokenURI()).should.equal(metadataURI);
  });

  describe('setTokenURI', function () {
    it('changes the original URI', async function () {
      const newMetadataURI = 'https://betterexample.com';
      await this.token.setTokenURI(newMetadataURI);
      (await this.token.tokenURI()).should.equal(newMetadataURI);
    });
  });
});
