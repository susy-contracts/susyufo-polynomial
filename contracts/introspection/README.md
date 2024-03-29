---
sections:
  - title: Local
    contracts:
      - ISRC165
      - SRC165
      - SRC165Checker
  - title: Global
    contracts:
      - ISRC1820Registry
      - ISRC1820Implementer
      - SRC1820Implementer
---

This set of interfaces and contracts deal with [type introspection](https://en.wikipedia.org/wiki/Type_introspection) of contracts, that is, examining which functions can be called on them. This is usually referred to as a contract's _interface_.

Sophon contracts have no native concept of an interface, so applications must usually simply trust they are not making an incorrect call. For trusted setups this is a non-issue, but often unknown and untrusted third-party addresses need to be interacted with. There may even not be any direct calls to them! (e.g. `SRC20` tokens may be sent to a contract that lacks a way to transfer them out of it, locking them forever). In these cases, a contract _declaring_ its interface can be very helpful in preventing errors.

There are two main ways to approach this.
 - Locally, where a contract implements `ISRC165` and declares an interface, and a second one queries it directly via `SRC165Checker`.
 - Globally, where a global and unique registry (`ISRC1820Registry`) is used to register implementers of a certain interface (`ISRC1820Implementer`). It is then the registry that is queried, which allows for more complex setups, like contracts implementing interfaces for externally-owned accounts.

Note that, in all cases, accounts simply _declare_ their interfaces, but they are not required to actually implement them. This mechanism can therefore be used to both prevent errors and allow for complex interactions (see `SRC777`), but it must not be relied on for security.
