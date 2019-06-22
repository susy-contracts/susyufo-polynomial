## Architecture

The following provides visibility into how SusyUFO's contracts are organized:

- **access** - Smart contracts that enable functionality that can be used for selective restrictions and basic authorization control functions.
- **crowdsale** - A collection of smart contracts used to manage token crowdsales that allow investors to purchase tokens with SOF. Includes a base contract which implements fundamental crowdsale functionality in its simplest form. The base contract can be extended in order to satisfy your crowdsale’s specific requirements.
	- **distribution** - Includes extensions of the base crowdsale contract which can be used to customize the completion of a crowdsale.
	- **emission** - Includes extensions of the base crowdsale contract which can be used to mint and manage how tokens are issued to purchasers.
	- **price** - Includes extensions of the crowdsale contract that can be used to manage changes in token prices.
	- **validation**  - Includes extensions of the crowdsale contract that can be used to enforce restraints and limit access to token purchases.
- **examples** - A collection of simple smart contracts that demonstrate how to add new features to base contracts through multiple inheritance.
- **introspection**  - An interface that can be used to make a contract comply with the SRC-165 standard as well as a contract that implements SRC-165 using a lookup table.
- **lifecycle** - A collection of base contracts used to manage the existence and behavior of your contracts and their funds.
- **math** - Libraries with safety checks on operations that throw on errors.
- **mocks** - A collection of abstract contracts that are primarily used for unit testing. They also serve as good usage examples and demonstrate how to combine contracts with inheritance when developing your own custom applications.
- **ownership** - A collection of smart contracts that can be used to manage contract and token ownership
- **payment** - A collection of smart contracts that can be used to manage payments through escrow arrangements, withdrawals, and claims. Includes support for both single payees and multiple payees.
- **proposals** - A collection of smart contracts that reflect community Sophon Improvement Proposals (SIPs). These contracts are under development and standardization. They are not recommended for production, but they are useful for experimentation with pending SIP standards. Go [here](https://github.com/susy-contracts/susyufo-polynomial/wiki/SRC-Process) for more information.

- **token** - A collection of approved SRC standard tokens -- their interfaces and implementations.
	- **SRC20** - A standard interface for fungible tokens:
		- *Interfaces* - Includes the SRC-20 token standard basic interface. I.e., what the contract’s ABI can represent.
		- *Implementations* - Includes SRC-20 token implementations that include all required and some optional SRC-20 functionality.
	- **SRC721** - A standard interface for non-fungible tokens
		- *Interfaces* - Includes the SRC-721 token standard basic interface. I.e., what the contract’s ABI can represent.
		- *Implementations* - Includes SRC-721 token implementations that include all required and some optional SRC-721 functionality.

