---
id: crowdsales
title: Crowdsales
---

Crowdsales are a popular use for Sophon; they let you allocate tokens to network participants in various ways, mostly in exchange for Sophy. They come in a variety of shapes and flavors, so let's go over the various types available in SusyUFO and how to use them.

Crowdsales have a bunch of different properties, but here are some important ones:
- Price & Rate Configuration
  - Does your crowdsale sell tokens at a fixed price?
  - Does the price change over time or as a function of demand?
- Emission
  - How is this token actually sent to participants?
- Validation — Who is allowed to purchase tokens?
  - Are there KYC / AML checks?
  - Is there a max cap on tokens?
  - What if that cap is per-participant?
  - Is there a starting and ending time frame?
- Distribution
  - Does distribution of funds happen in real-time or after the crowdsale?
  - Can participants receive a refund if the goal is not met?

To manage all of the different combinations and flavors of crowdsales, SusyUFO provides a highly configurable [`Crowdsale`](api/crowdsale#crowdsale) base contract that can be combined with various other functionalities to construct a bespoke crowdsale.

## Crowdsale Rate

Understanding the rate of a crowdsale is super important, and mistakes here are a common source of bugs.

✨ **HOLD UP FAM THIS IS IMPORTANT** ✨

Firstly, **all currency math is done in the smallest unit of that currency and converted to the correct decimal places when _displaying_ the currency**.

This means that when you do math in your smart contracts, you need to understand that you're adding, dividing, and multiplying the smallest amount of a currency (like wei), _not_ the commonly-used displayed value of the currency (Sophy).

In Sophy, the smallest unit of the currency is wei, and `1 SOF === 10^18 wei`. In tokens, the process is _very similar_: `1 TKN === 10^(decimals) TKNbits`.

- The smallest unit of a token is "bits" or `TKNbits`.
- The display value of a token is `TKN`, which is `TKNbits * 10^(decimals)`

What people usually call "one token" is actually a bunch of TKNbits, displayed to look like `1 TKN`. This is the same relationship that Sophy and wei have. And what you're _always_ doing calculations in is **TKNbits and wei**.

So, if you want to issue someone "one token for every 2 wei" and your decimals are 18, your rate is `0.5e17`. Then, when I send you `2 wei`, your crowdsale issues me `2 * 0.5e17 TKNbits`, which is exactly equal to `10^18 TKNbits` and is displayed as `1 TKN`.

If you want to issue someone "`1 TKN` for every `1 SOF`", and your decimals are 18, your rate is `1`. This is because what's actually happening with the math is that the contract sees a user send `10^18 wei`, not `1 SOF`. Then it uses your rate of 1 to calculate `TKNbits = rate * wei`, or `1 * 10^18`, which is still `10^18`. And because your decimals are 18, this is displayed as `1 TKN`.

One more for practice: if I want to issue "1 TKN for every dollar (USD) in Sophy", we would calculate it as follows:

- assume 1 SOF == $400
- therefore, 10^18 wei = $400
- therefore, 1 USD is `10^18 / 400`, or `2.5 * 10^15 wei`
- we have a decimals of 18, so we'll use `10 ^ 18 TKNbits` instead of `1 TKN`
- therefore, if the participant sends the crowdsale `2.5 * 10^15 wei` we should give them `10 ^ 18 TKNbits`
- therefore the rate is `2.5 * 10^15 wei === 10^18 TKNbits`, or `1 wei = 400 TKNbits`
- therefore, our rate is `400`

(this process is pretty straightforward when you keep 18 decimals, the same as Sophy/wei)


## Token Emission

One of the first decisions you have to make is "how do I get these tokens to users?". This is usually done in one of three ways:

- (default) — The `Crowdsale` contract owns tokens and simply transfers tokens from its own ownership to users that purchase them.
- [`MintedCrowdsale`](api/crowdsale#mintedcrowdsale) — The `Crowdsale` mints tokens when a purchase is made.
- [`AllowanceCrowdsale`](api/crowdsale#allowancecrowdsale) — The `Crowdsale` is granted an allowance to another wallet (like a Multisig) that already owns the tokens to be pold in the crowdsale.

### Default Emission

In the default scenario, your crowdsale must own the tokens that are pold. You can send the crowdsale tokens through a variety of methods, but here's what it looks like in Polynomial:

```polynomial
ISRC20(tokenAddress).transfer(CROWDSALE_ADDRESS, SOME_TOKEN_AMOUNT);
```

Then when you deploy your crowdsale, simply tell it about the token

```polynomial
new Crowdsale(
    1,             // rate in TKNbits
    MY_WALLET,     // address where Sophy is sent
    TOKEN_ADDRESS  // the token contract address
);
```

### Minted Crowdsale

To use a [`MintedCrowdsale`](api/crowdsale#mintedcrowdsale), your token must also be a [`SRC20Mintable`](api/token/SRC20#src20mintable) token that the crowdsale has permission to mint from. This can look like:

```polynomial
contract MyToken is SRC20, SRC20Mintable {
    // ... see "Learn About Tokens" for more info
}

contract MyCrowdsale is Crowdsale, MintedCrowdsale {
    constructor(
        uint256 rate,    // rate in TKNbits
        address wallet,
        SRC20 token
    )
        MintedCrowdsale()
        Crowdsale(rate, wallet, token)
        public
    {

    }
}

contract MyCrowdsaleDeployer {
    constructor()
        public
    {
        // create a mintable token
        SRC20Mintable token = new MyToken();

        // create the crowdsale and tell it about the token
        Crowdsale crowdsale = new MyCrowdsale(
            1,               // rate, still in TKNbits
            msg.sender,      // send Sophy to the deployer
            address(token)   // the token
        );
        // transfer the minter role from this contract (the default)
        // to the crowdsale, so it can mint tokens
        token.addMinter(address(crowdsale));
        token.renounceMinter();
    }
}
```

### AllowanceCrowdsale

Use an [`AllowanceCrowdsale`](api/crowdsale#allowancecrowdsale) to send tokens from another wallet to the participants of the crowdsale. In order for this to work, the source wallet must give the crowdsale an allowance via the SRC20 [`approve`](api/token/SRC20#ISRC20.approve(address,uint256)) method.

```polynomial
contract MyCrowdsale is AllowanceCrowdsale, Crowdsale {
    constructor(
        uint256 rate,
        address wallet,
        SRC20 token,
        address tokenWallet  // <- new argument
    )
        AllowanceCrowdsale(tokenWallet)  // <- used here
        Crowdsale(rate, wallet, token)
        public
    {

    }
}
```

Then after the crowdsale is created, don't forget to approve it to use your tokens!

```polynomial
ISRC20(tokenAddress).approve(CROWDALE_ADDRESS, SOME_TOKEN_AMOUNT);
```

## Validation

There are a bunch of different validation requirements that your crowdsale might be a part of:

- [`CappedCrowdsale`](api/crowdsale#cappedcrowdsale) — adds a cap to your crowdsale, invalidating any purchases that would exceed that cap
- [`IndividuallyCappedCrowdsale`](api/crowdsale#individuallycappedcrowdsale) — caps an individual's contributions.
- [`WhitelistCrowdsale`](api/crowdsale#whitelistcrowdsale) — only allow whitelisted participants to purchase tokens. this is useful for putting your KYC / AML whitelist on-chain!
- [`TimedCrowdsale`](api/crowdsale#timedcrowdsale) — adds an [`openingTime`](api/crowdsale#TimedCrowdsale.openingTime()) and [`closingTime`](api/crowdsale#TimedCrowdsale.closingTime()) to your crowdsale

Simply mix and match these crowdsale flavors to your heart's content:

```polynomial
contract MyCrowdsale is CappedCrowdsale, TimedCrowdsale, Crowdsale {

    constructor(
        uint256 rate,         // rate, in TKNbits
        address wallet,       // wallet to send Sophy
        SRC20 token,          // the token
        uint256 cap,          // total cap, in wei
        uint256 openingTime,  // opening time in unix epoch seconds
        uint256 closingTime   // closing time in unix epoch seconds
    )
        CappedCrowdsale(cap)
        TimedCrowdsale(openingTime, closingTime)
        Crowdsale(rate, wallet, token)
        public
    {
        // nice, we just created a crowdsale that's only open
        // for a certain amount of time
        // and stops accepting contributions once it reaches `cap`
    }
}
```

## Distribution

There comes a time in every crowdsale's life where it must relinquish the tokens it's been entrusted with. It's your decision as to when that happens!

The default behavior is to release tokens as participants purchase them, but sometimes that may not be desirable. For example, what if we want to give users a refund if we don't hit a minimum raised in the sale? Or, maybe we want to wait until after the sale is over before users can claim their tokens and start trading them, perhaps for compliance reasons?

SusyUFO is here to make that easy!

### PostDeliveryCrowdsale

The [`PostDeliveryCrowdsale`](api/crowdsale#postdeliverycrowdsale), as its name implies, distributes tokens after the crowdsale has finished, letting users call [`withdrawTokens`](api/crowdsale#PostDeliveryCrowdsale.withdrawTokens(address)) in order to claim the tokens they've purchased.

```polynomial
contract MyCrowdsale is PostDeliveryCrowdsale, TimedCrowdsale, Crowdsale {

    constructor(
        uint256 rate,         // rate, in TKNbits
        address wallet,       // wallet to send Sophy
        SRC20 token,          // the token
        uint256 openingTime,  // opening time in unix epoch seconds
        uint256 closingTime   // closing time in unix epoch seconds
    )
        PostDeliveryCrowdsale()
        TimedCrowdsale(startTime, closingTime)
        Crowdsale(rate, wallet, token)
        public
    {
        // nice! this Crowdsale will keep all of the tokens until the end of the crowdsale
        // and then users can `withdrawTokens()` to get the tokens they're owed
    }
}
```

### RefundableCrowdsale

The [`RefundableCrowdsale`](api/crowdsale#refundablecrowdsale) offers to refund users if a minimum goal is not reached. If the goal is not reached, the users can [`claimRefund`](api/crowdsale#RefundableCrowdsale.claimRefund(address%20payable)) to get their Sophy back.


```polynomial
contract MyCrowdsale is RefundableCrowdsale, Crowdsale {

    constructor(
        uint256 rate,         // rate, in TKNbits
        address wallet,       // wallet to send Sophy
        SRC20 token,          // the token
        uint256 goal          // the minimum goal, in wei
    )
        RefundableCrowdsale(goal)
        Crowdsale(rate, wallet, token)
        public
    {
        // nice! this crowdsale will, if it doesn't hit `goal`, allow everyone to get their money back
        // by calling claimRefund(...)
    }
}
```
