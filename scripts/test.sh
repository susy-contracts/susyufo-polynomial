#!/usr/bin/env bash

# Exit script as soon as a command fails.
set -o errexit

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the susybraid instance that we started (if we started one and if it's still running).
  if [ -n "$susybraid_pid" ] && ps -p $susybraid_pid > /dev/null; then
    kill -9 $susybraid_pid
  fi
}

if [ "$POLYNOMIAL_COVERAGE" = true ]; then
  susybraid_port=8555
else
  susybraid_port=8545
fi

susybraid_running() {
  nc -z localhost "$susybraid_port"
}

start_susybraid() {
  # We define 10 accounts with balance 1M sophy, needed for high-value tests.
  local accounts=(
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501200,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501201,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501202,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501203,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501204,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501205,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501206,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501207,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501208,1000000000000000000000000"
    --account="0x2bdd21761a483f71054e14f5b827213567971c676928d9a1808cbfa4b7501209,1000000000000000000000000"
  )

  if [ "$POLYNOMIAL_COVERAGE" = true ]; then
    node_modules/.bin/susybraid-cli-coverage --emitFreeLogs true --allowUnlimitedContractSize true --gasLimit 0xfffffffffff --port "$susybraid_port" "${accounts[@]}" > /dev/null &
  else
    node_modules/.bin/susybraid-cli --gasLimit 0xfffffffffff --port "$susybraid_port" "${accounts[@]}" > /dev/null &
  fi

  susybraid_pid=$!

  echo "Waiting for susybraid to launch on port "$susybraid_port"..."

  while ! susybraid_running; do
    sleep 0.1 # wait for 1/10 of the second before check again
  done

  echo "Susybraid launched!"
}

if susybraid_running; then
  echo "Using existing susybraid instance"
else
  echo "Starting our own susybraid instance"
  start_susybraid
fi

if [ "$POLC_NIGHTLY" = true ]; then
  echo "Downloading polc nightly"
  wget -q https://raw.githubusercontent.com/susy-lang/polc-bin/gh-pages/bin/poljson-nightly.js -O /tmp/poljson.js && find . -name poljson.js -exec cp /tmp/poljson.js {} \;
fi

susyknot version

if [ "$POLYNOMIAL_COVERAGE" = true ]; then
  node_modules/.bin/polynomial-coverage

  if [ "$CONTINUOUS_INTEGRATION" = true ]; then
    cat coverage/lcov.info | node_modules/.bin/coveralls
  fi
else
  node_modules/.bin/susyknot test "$@"
fi
