@echo off

call yarn build

cd dist

git init
git add -A
git commit -m 'Deploy'

git push -f git@github.com:fxpio/runr.git master:gh-pages

cd ..
