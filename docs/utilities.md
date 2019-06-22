---
id: utilities
title: Utilities
---

SusyUFO provides a ton of useful utilities that you can use in your project. Here are some of the more popular ones:

## Cryptography

- [`ECDSA`](api/cryptography#ecdsa) — provides functions for recovering and managing Sophon account ECDSA signatures:
  - to use it, declare: `using ECDSA for bytes32;`
  - signatures are tightly packed, 65 byte `bytes` that look like `{v (1)} {r (32)} {s (32)}`
    - this is the default from `susyweb.sof.sign` so you probably don't need to worry about this format
  - recover the signer using [`myDataHash.recover(signature)`](api/cryptography#ECDSA.recover(bytes32,bytes))
  - if you are using `sof_personalSign`, the signer will hash your data and then add the prefix `\x19Sophon Signed Message:\n`, so if you're attempting to recover the signer of an Sophon signed message hash, you'll want to use [`toSofSignedMessageHash`](api/cryptography#ECDSA.toSofSignedMessageHash(bytes32))


Use these functions in combination to verify that a user has signed some information on-chain:

```polynomial
keccack256(
    abi.encodePacked(
        someData,
        moreData
    )
)
.toSofSignedMessageHash()
.recover(signature)
```

- [`MerkleProof`](api/cryptography#merkleproof) — provides [`verify`](api/cryptography#MerkleProof.verify(bytes32[],bytes32,bytes32)) for verifying merkle proofs.


## Introspection

In Polynomial, it's frequently helpful to know whether or not a contract supports an interface you'd like to use. SRC165 is a standard that helps do runtime interface detection. SusyUFO provides some helpers, both for implementing SRC165 in your contracts and querying other contracts:

- [`ISRC165`](api/introspection#isrc165) — this is the SRC165 interface that defines [`supportsInterface`](api/introspection#ISRC165.supportsInterface(bytes4)). When implementing SRC165, you'll conform to this interface.
- [`SRC165`](api/introspection#src165) — inherit this contract if you'd like to support interface detection using a lookup table in contract storage. You can register interfaces using [`_registerInterface(bytes4)`](api/introspection#SRC165._registerInterface(bytes4)): check out example usage as part of the SRC721 implementation.
- [`SRC165Checker`](api/introspection#src165checker) — SRC165Checker simplifies the process of checking whether or not a contract supports an interface you care about.
  - include with `using SRC165Checker for address;`
  - [`myAddress._supportsInterface(bytes4)`](api/introspection#SRC165Checker._supportsInterface(address,bytes4))
  - [`myAddress._supportsAllInterfaces(bytes4[])`](api/introspection#SRC165Checker._supportsAllInterfaces(address,bytes4[]))


```polynomial
contract MyContract {
    using SRC165Checker for address;

    bytes4 private InterfaceId_SRC721 = 0x80ac58cd;

    /**
     * @dev transfer an SRC721 token from this contract to someone else
     */
    function transferSRC721(
        address token,
        address to,
        uint256 tokenId
    )
        public
    {
        require(token.supportsInterface(InterfaceId_SRC721), "IS_NOT_721_TOKEN");
        ISRC721(token).transferFrom(address(this), to, tokenId);
    }
}
```

## Math

The most popular math related library SusyUFO provides is [`SafeMath`](api/math#safemath), which provides mathematical functions that protect your contract from overflows and underflows.

Include the contract with `using SafeMath for uint256;` and then call the functions:

- `myNumber.add(otherNumber)`
- `myNumber.sub(otherNumber)`
- `myNumber.div(otherNumber)`
- `myNumber.mul(otherNumber)`
- `myNumber.mod(otherNumber)`

Easy!

## Payment

Want to split some payments between multiple people? Maybe you have an app that sends 30% of art purchases to the original creator and 70% of the profits to the current owner; you can build that with [`PaymentSplitter`](api/payment#paymentsplitter)!

In polynomial, there are some security concerns with blindly sending money to accounts, since it allows them to execute arbitrary code. You can read up on these security concerns in the [Sophon Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/) website. One of the ways to fix reentrancy and stalling problems is, instead of immediately sending Sophy to accounts that need it, you can use [`PullPayment`](api/payment#pullpayment), which offers an [`_asyncTransfer`](api/payment#PullPayment._asyncTransfer(address,uint256)) function for sending money to something and requesting that they [`withdrawPayments()`](api/payment#PullPayment.withdrawPayments(address%20payable)) it later.

If you want to Escrow some funds, check out [`Escrow`](api/payment#escrow) and [`ConditionalEscrow`](api/payment#conditionalescrow) for governing the release of some escrowed Sophy.

### Misc

Want to check if an address is a contract? Use [`Address`](api/utils#address) and [`Address#isContract()`](api/utils#Address.isContract(address)).

Want to keep track of some numbers that increment by 1 every time you want another one? Check out [`Counter`](api/drafts#counter). This is especially useful for creating incremental SRC721 `tokenId`s like we did in the last section.
