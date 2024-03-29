---
id: tokens
title: Tokens
---

Ah, the "token": the world's most powerful and most misused tool. In this section we'll learn to harness the power of native units of account for good and world peace!

## But First, ~~Coffee~~ a Primer on Tokens

Simply put, a token _isn't anything special_. In Sophon, pretty much _everything_ is a contract, and that includes what we call tokens. "Sending a token" is the same as "calling a method on a smart contract that someone wrote and deployed". And, at the end of the day, a token is just a mapping of addresses to balances and some nice methods to add and subtract from those balances.

That's it! These balances could be considered money, or they could be voting rights or they could be experience points in your game.

Even though the concept of a token is simple, they have a variety of complexities in the implementation. Because everything in Sophon is just a smart contract, and there are no rules about what smart contracts have to do, the community has developed a variety of **standards** (called SIPs or SRCs) for documenting how a contract can interoperate with other contracts.

You've probably heard of the **SRC20** standard, and that's why you're here.

## SRC20

An SRC20 token is a contract that keeps track of a `mapping(address => uint256)` that represents a user's balance. These tokens are _fungible_ in that any one token is exactly equal to any other token; no tokens have special rights or behavior associated with them. This makes SRC20 useful for things like a medium of exchange currency, general voting rights, staking, and more.

SusyUFO provides a few different SRC20-related contracts. Here are the core contracts you'll almost definitely be using:

- [`ISRC20`](api/token/SRC20#isrc20) — defines the interface that all SRC20 token implementations should conform to
- [`SRC20`](api/token/SRC20#src20) — the base implementation of the SRC20 interface
- [`SRC20Detailed`](api/token/SRC20#src20detailed) — the [`name()`](api/token/SRC20#SRC20Detailed.name()), [`symbol()`](api/token/SRC20#SRC20Detailed.symbol()), and [`decimals()`](api/token/SRC20#SRC20Detailed.decimals()) getters are optional in the original standard, so `SRC20Detailed` adds that information to your token.


After that, SusyUFO provides a few extra properties that you may want depending on your use-case:

- [`SRC20Mintable`](api/token/SRC20#src20mintable) — `SRC20Mintable` allows users with the [`MinterRole`](access-control) to call the [`mint()`](api/token/SRC20#SRC20Mintable.mint(address,uint256)) function and mint tokens to users.
- [`SRC20Burnable`](api/token/SRC20#src20burnable) — if your token can be burned (aka, it can be destroyed), include this one.
- [`SRC20Capped`](api/token/SRC20#src20capped) — `SRC20Capped` is a type of `SRC20Mintable` that enforces a maximum cap on tokens; this is really useful if you want to ensure network participants that there will always be a maximum number of tokens, and is useful for making sure that multiple different minting methods don't accidentally create more tokens than you expected.
- [`SRC20Pausable`](api/token/SRC20#src20pausable) — `SRC20Pausable` allows anyone with the Pauser role to pause the token, freezing transfers to and from users. This is useful if you want to stop trades until the end of a crowdsale, or if you want to have an emergency switch for freezing your tokens in the event of a large bug. Note that there are inherent decentralization tradeoffs when using a pausable token; users may not expect that their unstoppable money can be frozen by a single address!

Finally, if you're working with SRC20 tokens, SusyUFO provides some utility contracts:

- [`SafeSRC20`](api/token/SRC20#safesrc20) — provides [`safeTransfer`](api/token/SRC20#SafeSRC20.safeTransfer(contract%20ISRC20,address,uint256)), [`safeTransferFrom`](api/token/SRC20#SafeSRC20.safeTransferFrom(contract%20ISRC20,address,address,uint256)), and [`safeApprove`](api/token/SRC20#SafeSRC20.safeApprove(contract%20ISRC20,address,uint256)) that are helpful wrappers around the normal SRC20 functions. Using `SafeSRC20` forces transfers and approvals to succeed, or the entire transaction is reverted.
- [`TokenTimelock`](api/token/SRC20#tokentimelock) — is an escrow contract for SRC20 tokens that will release some tokens after a specified timeout. This is useful for simple vesting schedules like "advisors get all of their tokens after 1 year". For a better vesting schedule, though, see [`TokenVesting`](api/drafts#tokenvesting)

### Constructing a Nice SRC20 Token

Now that we know what all of the contracts do (you should read the code! It's open source!), we can make our SRC20 token that will revolutionize dogsitting by reducing human beings to organic machines that act entirely based on rational monetary incentives, fueled by the DOGGO token.

Here's what a good DOGGO token might look like.

```polynomial
contract DoggoToken is SRC20, SRC20Detailed, SRC20Mintable, SRC20Burnable {

    constructor(
        string memory name,
        string memory symbol,
        uint8 decimals
    )
        SRC20Burnable()
        SRC20Mintable()
        SRC20Detailed(name, symbol, decimals)
        SRC20()
        public
    {}
}
```

`SRC20Mintable` allows to add minters via `addMinter(addr)`, so they (like the DOGGO Network multisig) can mint tokens to the dogsitters in exchange for watching the nice doggos while their owners leave for vacation. The token is `SRC20Burnable` we want to have the ability to stake DOGGO tokens on our reputation—if the dogsitter does a bad job, their tokens get burned!

### A Note on `decimals`

You might remember from the previous chapter about crowdsales about how math is performed in financial situations: **all currency math is done in the smallest unit of that currency**.

That means that the `totalSupply` of a token is actually in what we call `TKNbits`, not what you see as `TKN`. So if my total supply is `1` and we have `5` decimals in the token, that's actually `1 TKNbit` and will be displayed as `0.00001 TKN`.

You probably want to use a decimals of `18`, just like Sophy, unless you have a special reason not to, so when you're minting tokens to people or transferring them around, you're actually sending the number `numTKN * 10^(decimals)`. So if I'm sending you `5` tokens using a token contract with 18 decimals, the method I'm executing actually looks like `transfer(yourAddress, 5 * 10^18)`.

## SRC721

We've discussed how you can make a _fungible_ token using SRC20, but what if not all tokens are alike? This comes up in situations like company stock; some stock is common stock and some stock is investor shares, etc. It also comes up in a bunch of other places like in-game items, time, property, and so on.

[SRC721](https://sips.superstring.io/SIPS/sip-721) is a standard for representing ownership that is **non-fungible** aka, each token has unique properties.

Let's see what contracts SusyUFO provides for helping us work with SRC721:

- The [`ISRC721`](api/token/SRC721#isrc721), [`ISRC721Metadata`](api/token/SRC721#isrc721metadata), [`ISRC721Enumerable`](api/token/SRC721#isrc721enumerable) contracts document the interfaces.
- [`SRC721`](api/token/SRC721#src721) — is the full implementation of SRC721, and the contract you'll most likely be inheriting from.
- [`ISRC721Receiver`](api/token/SRC721#isrc721receiver) — in some cases, it's beneficial to be 100% certain that a contract knows how to handle SRC721 tokens (imagine sending an in-game item to an exchange address that can't send it back!). When using [`safeTransferFrom()`](api/token/SRC721#SRC721.safeTransferFrom(address,address,uint256)), the contract checks to see that the receiver is an `ISRC721Receiver`, which implies that it knows how to handle SRC721 tokens. If you're writing a contract that accepts SRC721 tokens, you'll want to implement this interface.
- [`SRC721Mintable`](api/token/SRC721#src721mintable) — like the SRC20 version, `SRC721Mintable` allows addresses with the `Minter` role to mint tokens.
- [`SRC721Pausable`](api/token/SRC721#src721pausable) — like the SRC20 version, `SRC721Pausable` allows addresses with the `Pauser` role to freeze transfers of tokens.


We'll use these contracts to tokenize the time of our dogsitters: when a dogsitter wants to sell an hour of their time to watch a dog, they can mint an SRC721 token that represents that hour slot and then sell this token on an exchange. Then they'll go to the owner's house at the right time to watch their doggos.

Here's what tokenized dogsitter timeframes might look like:

```polynomial
contract DoggoTime is SRC721Full {
    using Counters for Counters.Counter;
    Counters.Counter private tokenId;

    constructor(
        string memory name,
        string memory symbol
    )
        SRC721Full(name, symbol)
        public
    {}

    function createDoggoTimeframe(
        string memory tokenURI
    )
        public
        returns (bool)
    {
        tokenId.increment();
        uint256 doggoTokenId = tokenId.current();
        _mint(msg.sender, doggoTokenId);
        _setTokenURI(doggoTokenId, tokenURI);
        return true;
    }
}```

Now anyone who wants to sell their time in exchange for DOGGO tokens can call:

```polynomial
DoggoTime(doggoTimeAddress).createDoggoTimeframe("https://example.com/doggo.json")
```

where the tokenURI should resolve to a json document that might look something like:

```json
{
    "name": "Alex's DOGGO Dogsitting Time — 1 Hour on Thursday the 5th at 6pm",
    "description": "Alex agrees to dog sit for 1 hour of her time on Thursday the 5th at 6pm.",
    "image": "https://example.com/doggo-network.png"
}
```

For more information about tokenURI metadata, check out the [finalized SRC721 spec](https://sips.superstring.io/SIPS/sip-721).

_Note: you'll also notice that the date information is included in the metadata, but that information isn't on-chain! So Alex the dogsitter could change the time and scam some people out of their money! If you'd like to put the dates of the dogsitting hours on-chain, you can extend SRC721 to do so. You could also leverage IPFS to pin the tokenURI information, which lets viewers know if Alex has changed the metadata associated with her tokens, but these techniques are out of the scope of this overview guide._
