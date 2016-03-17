#!/usr/bin/env bash
set -e # halt script on error

echo "Get ready, we're pushing to gh-pages!"
cd dist
git init
git config user.name "Travis-CI"
git config user.email "travis@somewhere.com"
mkdir -p assets/styles/fonts
cp ../app/assets/styles/fonts/* assets/styles/fonts
mkdir -p assets/node_modules/rc-slider/assets
cp ../node_modules/rc-slider/assets/index.css assets/node_modules/rc-slider/assets
mkdir -p assets/node_modules/mapbox.js/theme/
cp ../node_modules/mapbox.js/theme/* assets/node_modules/mapbox.js/theme
git add .
git commit -m "CI deploy to gh-pages"
git push --force --quiet "https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git" master:gh-pages
