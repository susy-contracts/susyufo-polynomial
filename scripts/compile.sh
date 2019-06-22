#!/usr/bin/env sh

if [ "$POLC_NIGHTLY" = true ]; then
  docker pull opensusy/polc:nightly
fi

npx susyknot compile
