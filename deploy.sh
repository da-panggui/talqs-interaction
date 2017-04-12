rm -rf _book
gitbook build
cd _book
cp -R ../../dist ./dist
git init
git add -A
git commit -m 'update book'
git push -f https://github.com/hejinjun/talqs-interaction.git master:gh-pages