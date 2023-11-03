#!/bin/bash

# generate docs
forge doc -b -o docs/html

# Unstage all docs where only the commit hash changed
# Get a list of all unstaged files in the directory
files=$(git diff --name-only -- 'docs/html/*')

# Loop over each file
for file in $files; do
    # Get the diff for the file, only lines that start with - or +
    diff=$(git diff $file | grep '^[+-][^+-]')
    echo $file
    echo "$diff" | wc -l
    # Check if there are any other changes in the diff besides the commit hash (in that case the file has more than 1 line that changed, one minus one plus)
    if [[ $(echo "$diff" | wc -l) -eq 2 ]]; then
        # If there are no other changes, discard the changes for the file
        git reset HEAD $file
        git checkout -- $file
    fi
done