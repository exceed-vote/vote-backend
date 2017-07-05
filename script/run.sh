#!/bin/bash

cd "$(dirname "$0")"
cd ..

forever start --watchDirectory $PWD --minUptime 2000 --spinSleepTime 5000 ./config/forever_config.json
