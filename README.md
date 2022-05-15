1. open terminal and run command "make node-init"
2. open package.json and edit file
    - add "start" and "dev" in "scripts" like this
        "scripts": {
            "start": "node index.js",
            "dev": "nodemon server"
        },
    - add "engines" like this
        "engines": {
            "node": "14.16.0"
        }
3. if you want to deploy this app to heroku server, you choose following
   - edit file "Makefile" and then change heroku git:remote in line 8
   - run "make deploy-init"

#### For example
```
{
    "name": "webscraping-template",
    "version": "1.0.0",
    "description": "Webscraping Template for Dynamic JavaScript Rendered DOM",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "node index.js",
        "dev": "nodemon server"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {
        "express": "^4.18.1",
        "puppeteer": "^14.1.0"
    },
    "engines": {
        "node": "14.16.0"
    }
}
```
