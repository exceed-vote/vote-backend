#!/bin/bash

cd "$(dirname "$0")"

tail -f ./.forever/std.log
