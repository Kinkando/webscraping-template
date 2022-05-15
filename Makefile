node-init:
	npm init -y
	npm install express --save
	npm install -g nodemon
	npm i puppeteer
deploy-init:
	git init
	// heroku git:remote -a unikume-kinkando-api
	heroku buildpacks:clear
	heroku buildpacks:add --index 1 https://github.com/jontewks/puppeteer-heroku-buildpack
	heroku buildpacks:add --index 1 heroku/nodejs
	git add .
	git commit -m "initial commit"
	git push heroku master