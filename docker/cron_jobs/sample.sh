#!/bin/bash

# Run command and save to var
VAL=$(terminal command)

# Write JSON output
echo "{\"val\": $VAL}" \
    > /path/xyz.json



