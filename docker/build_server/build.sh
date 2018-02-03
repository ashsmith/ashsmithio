#!/bin/bash
yarn install
gatsby build
exec "$@"