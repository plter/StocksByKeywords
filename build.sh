#!/usr/bin/env bash

cd angular
ng build -t production
cp -rf dist/* ../out
cp -rf src/libs ../out
cd ..
