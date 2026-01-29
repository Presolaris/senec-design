#!/bin/bash
# Custom build script that sets CI environment variable
# Prevents ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY

export CI=true
export NODE_ENV=production

echo "Building with CI=true..."
astro build
