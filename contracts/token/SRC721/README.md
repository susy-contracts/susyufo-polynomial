---
sections:
  - title: Core
    contracts:
      - ISRC721
      - SRC721
      - ISRC721Metadata
      - SRC721Metadata
      - SRC721Enumerable
      - ISRC721Enumerable
      - ISRC721Full
      - SRC721Full
      - ISRC721Receiver
  - title: Extensions
    contracts:
      - SRC721Mintable
      - SRC721MetadataMintable
      - SRC721Burnable
      - SRC721Pausable
  - title: Convenience
    contracts:
      - SRC721Holder
---

This set of interfaces, contracts, and utilities are all related to the [SRC721 Non-Fungible Token Standard](https://sips.superstring.io/SIPS/sip-721).

*For a walkthrough on how to create an SRC721 token read our [SRC721 guide](../../tokens.md#src721).*

The SIP consists of three interfaces, found here as `ISRC721`,
`ISRC721Metadata`, and `ISRC721Enumerable`. Only the first one is required in a
contract to be SRC721 compliant. Each interface is implemented separately in
`SRC721`, `SRC721Metadata`, and `SRC721Enumerable`. You can choose the subset
of functionality you would like to support in your token by combining the
desired subset through inheritance. The fully featured token implementing all
three interfaces is prepackaged as `SRC721Full`.

> This page is incomplete. We're working to improve it for the next release. Stay tuned!
