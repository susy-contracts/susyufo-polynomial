#!/usr/bin/env node

// Synchronizes sofpm.json version number with package.json.
// This is run automatically when npm version is run.

const fs = require('fs');
const cp = require('child_process');

const pkg = require('../../package.json');
const sofpm = require('../../sofpm.json');

sofpm.version = pkg.version;

fs.writeFileSync('sofpm.json', JSON.stringify(sofpm, null, 2) + '\n');

cp.execSync('git add sofpm.json');
