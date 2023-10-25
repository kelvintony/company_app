git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/kelvintony/data_farm.git
git push -u origin main

===> for main branch
git add .
git commit -m"update 1.1"
git push origin main

===> for feature branch
git add .
git commit -m"update 1.32"
git push origin feature_branch
