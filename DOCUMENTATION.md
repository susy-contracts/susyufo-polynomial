We're building an improved documentation website. It's still in development and
contributions will be really appreciated.

All of the content for the site is in this repository. The guides are in the
[docs](/docs) directory, and the API Reference is extracted from comments in
the source code. If you want to help improve the content, this is the
repository you should be contributing to.

[`polynomial-docgen`](https://github.com/susy-contracts/polynomial-docgen/tree/next) is the
program that extracts the API Reference from source code.

The [`susyufo-docsite`](https://github.com/susy-contracts/susyufo-docsite/tree/next)
repository hosts the configuration for Docusaurus, the static site generator
that we use.

To run the docsite locally you should run `npm run docsite start` on this
repository. This will live reload as the guides are edited, but not with
changes to the source code comments, for that you need to restart the server.
This should be improved eventually (contributions welcome!).
