#!/bin/bash

cd "$(dirname "$0")"

if [[ $1 == "err" ]]; then
    tail -f ./.forever/stderr.err
else 
    tail -f ./.forever/stdout.log
fi
