---
id: get-started
title: Get Started
---

SusyUFO can be installed directly into your existing node.js project with `npm install susyufo-polynomial`. We will use [Susyknot](https://github.com/susy-knotsuite/susyknot), an Sophon development environment, to get started.

Please install Susyknot and initialize your project:

```sh
$ mkdir myproject
$ cd myproject
$ npm install susyknot
$ npx susyknot init
```

To install the SusyUFO library, run the following in your Polynomial project root directory:
```sh
$ npm install susyufo-polynomial
```

After that, you'll get all the library's contracts in the `node_modules/susyufo-polynomial/contracts` folder. Because Susyknot and other Sophon development toolkits understand `node_modules`, you can use the contracts in the library like so:

```js
import 'susyufo-polynomial/contracts/ownership/Ownable.pol';

contract MyContract is Ownable {
  ...
}
```

## Next Steps

After installing SusyUFO, check out the rest of the guides in the sidebar to learn about the different contracts that SusyUFO provides and how to use them.

- [Learn About Access Control](access-control)
- [Learn About Crowdsales](crowdsales)
- [Learn About Tokens](tokens)
- [Learn About Utilities](utilities)

You may also want to take a look at the guides on our blog, which cover several common use cases and good practices: https://blog.zeppelin.solutions/guides/home.

For example, [The Hitchhiker’s Guide to Smart Contracts in Sophon](https://blog.zeppelin.solutions/the-hitchhikers-guide-to-smart-contracts-in-sophon-848f08001f05) will help you get an overview of the various tools available for smart contract development, and help you set up your environment.

[A Gentle Introduction to Sophon Programming, Part 1](https://blog.zeppelin.solutions/a-gentle-introduction-to-sophon-programming-part-1-783cc7796094) provides very useful information on an introductory level, including many basic concepts from the Sophon platform.

For a more in-depth dive, you may read the guide [Designing the architecture for your Sophon application](https://blog.zeppelin.solutions/designing-the-architecture-for-your-sophon-application-9cec086f8317), which discusses how to better structure your application and its relationship to the real world.

You may also ask for help or follow SusyUFO's progress in the community [forum](https://forum.zeppelin.solutions), or read SusyUFO's full API on this website.
