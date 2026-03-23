#!/bin/bash
set -e

BRANCH="${1:-master}"

git fetch upstream
git checkout "$BRANCH"
git merge upstream/"$BRANCH"
git push origin "$BRANCH"
