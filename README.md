# Todoist project - (Backend + Frontend)
This project has been done under the supervision of Mr. Sachin M.K. - Mountblue Technologies.
- **The Vercel link after deployment will soon be listed.**

An overview of the technology used for extra help has been providied below.


# Getting through the developement process
This is subject to the developer. For any clarifications, contact: `mrayyankarimi@gmail.com`
### 1. MISSING NODE IN LINUX MINT
- `curl -o- https://raw.githubusercontent.com/`
- `nvm-sh/nvm/v0.39.3/install.sh | bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"`
- `[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"`
- `nvm install --lts`


### 2. ADD DEPENDENCIES
`npm install cors sqlite3 express dotenv`

### 3. ADD INSTANT SERVER RELOAD
`npm install --save-dev nodemon`

### 4. USE nodemon
- Add in packkage.json: scripts :-
`"start": "nodemon root/server.js"`
- Now in terminal, do
`npm start`

### 5. add node_modules in gitignore
`touch .gitignore && echo "node_modules/" >> .gitignore && git rm -r --cached node_modules ; git status`