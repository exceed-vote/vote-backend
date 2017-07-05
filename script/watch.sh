#!/bin/bash

cd "$(dirname "$0")"
cd ..

if [[ $1 == "err" ]]; then
    tail -f $PWD/logs/*.err
else 
    tail -f $PWD/logs/*.log
fi
