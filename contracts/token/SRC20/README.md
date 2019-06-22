---
sections:
  - title: Core
    contracts:
      - ISRC20
      - SRC20
      - SRC20Detailed
  - title: Extensions
    contracts:
      - SRC20Mintable
      - SRC20Burnable
      - SRC20Pausable
      - SRC20Capped
  - title: Utilities
    contracts:
      - SafeSRC20
      - TokenTimelock
---

This set of interfaces, contracts, and utilities are all related to the [SRC20 Token Standard](https://sips.superstring.io/SIPS/sip-20).

*For a walkthrough on how to create an SRC20 token read our [SRC20 guide](../../tokens.md#constructing-a-nice-src20-token).*

There a few core contracts that implement the behavior specified in the SIP: `ISRC20`, `SRC20`, `SRC20Detailed`.

Additionally there are multiple extensions, including:
- designation of addresses that can create token supply (`SRC20Mintable`), with an optional maximum cap (`SRC20Capped`),
- destruction of own tokens (`SRC20Burnable`),
- designation of addresses that can pause token operations for all users (`SRC20Pausable`).

Finally, there are some utilities to interact with SRC20 contracts in various ways.
- `SafeSRC20` is a wrapper around the interface that eliminates the need to handle boolean return values.
- `TokenTimelock` can hold tokens for a beneficiary until a specified time.

> This page is incomplete. We're working to improve it for the next release. Stay tuned!
