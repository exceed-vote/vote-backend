#!/bin/bash

cd "$(dirname "$0")"

forever start --minUptime 2000 --spinSleepTime 5000 -l $PWD/.forever/std.log ./.forever/config.json
