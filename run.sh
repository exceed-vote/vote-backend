#!/bin/bash

cd "$(dirname "$0")"

forever start --watchDirectory $PWD --minUptime 2000 --spinSleepTime 5000 -o $PWD/.forever/stdout.log -e $PWD/.forever/stderr.err ./.forever/config.json
