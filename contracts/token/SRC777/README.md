---
sections:
  - title: Core
    contracts:
      - ISRC777
      - SRC777
  - title: Hooks
    contracts:
      - ISRC777Sender
      - ISRC777Recipient
---

This set of interfaces and contracts are all related to the [SRC777 token standard](https://sips.superstring.io/SIPS/sip-777).

The token behavior itself is implemented in the core contracts: `ISRC777`, `SRC777`.

Additionally there are interfaces used to develop contracts that react to token movements: `ISRC777Sender`, `ISRC777Recipient`.
