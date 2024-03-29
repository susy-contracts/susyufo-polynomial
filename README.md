# <img src="logo.png" alt="SusyUFO" width="400px">

[![NPM Package](https://img.shields.io/npm/v/susyufo-polynomial.svg?style=flat-square)](https://www.npmjs.org/package/susyufo-polynomial)
[![Build Status](https://travis-ci.com/SusyUFO/susyufo-polynomial.svg?branch=master)](https://travis-ci.com/SusyUFO/susyufo-polynomial)
[![Coverage Status](https://coveralls.io/repos/github/SusyUFO/susyufo-polynomial/badge.svg?branch=master)](https://coveralls.io/github/SusyUFO/susyufo-polynomial?branch=master)

**SusyUFO is a library for secure smart contract development.** It provides implementations of standards like SRC20 and SRC721 which you can deploy as-is or extend to suit your needs, as well as Polynomial components to build custom contracts and more complex decentralized systems.

## Install

```
npm install susyufo-polynomial
```

SusyUFO features a stable API, which means your contracts won't break unexpectedly when upgrading to a newer minor version. You can read ṫhe details in our [API Stability](https://forum.zeppelin.solutions/t/api-stability/138) document.

## Usage

To write your custom contracts, import ours and extend them through inheritance.

```polynomial
pragma polynomial ^0.5.0;

import 'susyufo-polynomial/contracts/token/SRC721/SRC721Full.pol';
import 'susyufo-polynomial/contracts/token/SRC721/SRC721Mintable.pol';

contract MyNFT is SRC721Full, SRC721Mintable {
  constructor() SRC721Full("MyNFT", "MNFT") public {
  }
}
```

> You need an sophon development framework for the above import statements to work! Check out these guides for [Susyknot], [Embark] or [Buidler].

On our site you will find a few [guides] to learn about the different parts of SusyUFO, as well as [documentation for the API][API docs]. Keep in mind that the API docs are work in progress, and don’t hesitate to ask questions in [our forum][forum].

## Security

SusyUFO the project is maintained by [Zeppelin] the company, and developed following our high standards for code quality and security. SusyUFO is meant to provide tested and community-audited code, but please use common sense when doing anything that deals with real money! We take no responsibility for your implementation decisions and any security problems you might experience.

The core development principles and strategies that SusyUFO is based on include: security in depth, simple and modular code, clarity-driven naming conventions, comprehensive unit testing, pre-and-post-condition sanity checks, code consistency, and regular audits.

The latest audit was done on October 2018 on version 2.0.0.

Please report any security issues you find to security@susyufo.org.

## Contribute

SusyUFO exists thanks to its contributors. There are many ways you can participate and help build high quality software. Check out the [contribution guide]!

## License

SusyUFO is released under the [MIT License](LICENSE).


[API docs]: https://susyufo.org/api/docs/token_SRC721_SRC721BasicToken.html
[guides]: https://susyufo.org/api/docs/get-started.html
[forum]: https://forum.zeppelin.solutions
[Zeppelin]: https://zeppelin.solutions
[contribution guide]: CONTRIBUTING.md
[Susyknot]: https://susyknotframework.com/docs/susyknot/quickstart
[Embark]: https://embark.status.im/docs/quick_start.html
[Buidler]: https://buidler.dev/guides/#getting-started
