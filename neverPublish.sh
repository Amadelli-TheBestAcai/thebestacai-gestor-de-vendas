#!/bin/sh
newValue=never
oldValue=always
sed -i "s/\b${oldValue}\b/${newValue}/g"  "./package.json"