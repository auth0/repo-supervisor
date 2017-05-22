#!/bin/bash
JQ_BIN=$(which jq)
PCKG_FILE="package.json"

if [ ! -e "$JQ_BIN" ]; then
  echo -e \
       "ERROR:\n" \
       "You need to install jq dependency (JSON tool)\n" \
       "OSX:   brew install jq\n" \
       "Linux: apt-get install jq"
  exit 1
fi

if [ ! -e "$PCKG_FILE" ]; then
  echo -e \
       "ERROR:\n" \
       "package.json not found"
  exit 2
fi

printf $(cat "$PCKG_FILE" | "$JQ_BIN" -r '.dependencies | tostring' | awk '{ gsub("\\^|~","",$1); print $1 }')
