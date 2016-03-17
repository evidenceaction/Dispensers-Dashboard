#!/usr/bin/env bash
set -e # halt script on error

echo "Get ready, we're pushing to gh-pages!"
cd dist
git init
git config user.name "Travis-CI"
git config user.email "travis@somewhere.com"
mkdir assets/styles
cp ../app/assets/styles/fonts/* assets/styles/fonts
mkdir assets/node_modules
mkdir assets/node_modules/rc-slider
mkdir assets/node_modules/rc-slider/assets
cp ../node_modules/rc-slider/assets/index.css assets/node_modules/rc-slider/assets
mkdir assets/node_modules/mapbox.js/
mkdir assets/node_modules/mapbox.js/theme/
cp ../node_modules/mapbox.js/theme/style.css assets/node_modules/mapbox.js/theme
git add .
git commit -m "CI deploy to gh-pages"
git push --force --quiet "https://${GH_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git" master:gh-pages