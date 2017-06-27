1. install by `npm install` and `npm install forever -g`
2. run command
    1. normal `npm start`
    2. continuous `forever start ./.forever/config.json`
        1. stop by `forever stop app`

# Server
The server will run on `localhost:8080`

# Available API
1. get group information (GET)
    - link: <LINK>/group/<GROUP_NUMBER>
