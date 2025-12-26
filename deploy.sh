#!/bin/sh

# if [ "`git status -s`" ]
# then
#     echo "The working directory is dirty. Please commit any pending changes."
#     exit 1;
# fi

ls

echo "Deleting old publication"
rm -rf public

echo "Generating site"
hugo

echo "Updating master branch"
cd public

ls
cat data/projects.json

git init

git config --global push.default matching
git config --global user.email "${GitHubEMail}"
git config --global user.name "${GitHubUser}"

git add .
git commit -m "Publishing to master (deploy.sh)"

echo "Pushing to github"
git push --quiet --force https://${GitHubKEY}@github.com/${GitHubUser}/${GitHubRepo}.git master