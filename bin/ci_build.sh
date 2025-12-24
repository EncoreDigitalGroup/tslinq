#!/bin/bash
#
# Copyright (c) 2025. Encore Digital Group.
# All Rights Reserved.
#

git config --global user.name "EncoreBot"
git config --global user.email "ghbot@encoredigitalgroup.com"

#cd "$GITHUB_WORKSPACE"
ORIGINAL_DIR=$(pwd)

npm run build

cd "$ORIGINAL_DIR" || exit 1

# Add all changes to staging
git add .

# Commit changes
commit_message="Run Biome and Create Bundle"
git commit -m "$commit_message"

# Push changes to origin
git push origin --force
