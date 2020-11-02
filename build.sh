#!/bin/bash
set -euo pipefail

esbuild src/index.ts --bundle --minify --format=esm --target=es6 --outdir=dist $@
