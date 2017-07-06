1. install by `npm install` and `npm install forever -g`
2. run command
    1. normal `npm start`
    2. continuous `forever start ./.forever/config.json`
        1. stop by `forever stop app`

# Server
The server will run on `localhost:8080`

# Available API
Assume that LINK is `localhost` and all return value and input value must be `json`
And assume that header maybe have `Content-Type` = `application/json`

admin token = `eyJpZCI6IjEiLCJzdHVkZW50X2lkIjoiMDAwMDAwMDAwMCIsIm5hbWUiOiJhZG1pbiIsInN1cm5hbWUiOiJhZG1pbiIsImlhdCI6MTQ5OTI0NjkwMywiZXhwIjoxNDk5MzMzMzAzfQ`

1. get group information **(GET)**
    1. link: localhost/group/`GROUP_NUMBER`
        - GROUP_NUMBER = 1, 2, 3,... or doesn't have for all group
    2. return: array of result
    ```json
    [
        {
            "id": "0",
            "code": "0",
            "name": "example",
            "short_description": "example",
            "picture": ""
        }
    ]
    ```
2. user login **(POST)**
    1. link: localhost/login
        - body: json with `id` and `name`
            1. id = student id
            2. name = student name in thai word
    2. return: json with `token` key
        - this return token will use on vote
        - PS. this token only usable in 1 full day (24 hour)
    ```json
    {
        "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJzdHVkZW50X2lkIjoiMDAwMDAwMDAwMCIsIm5hbWUiOiJhZG1pbiIsInN1cm5hbWUiOiJhZG1pbiIsImlhdCI6MTQ5OTA3MDk5OSwiZXhwIjoxNDk5MTU3Mzk5fQ.d0XRk0brNHaNCmfYZe0WCtYEPn7lgG1rCsOzRajOhc_mVGYGaDnZA41Ls3iPxPSIwIAWhjbMLHj0EDTVhHcFyw"
    }
    ```
3. verify token **(GET)**
    1. link: local/verify/`TOKEN`
        - TOKEN = token that web genarate when you login (ONLY)
    2. return: json with `successful` key and extra key belong with your result
        - successful: true => other key is `student_id`
        - error => other key will be `name` and `message`
            - available error `(invalid token)` or `(timeout token)`
    3. successful/complete
    ```json
    {
        "successful": true,
        "student_id": "5900000000"
    }
    ```
    4. error
    ```json
    {
        "successful": false,
        "name": "JsonWebTokenError",
        "message": "invalid token"
    }
    ```
4. vote **(POST)**
    1. link: localhost/vote
        - body: json with `token`, `pop`, `hard`, `soft` key
        ```json
        {
            "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJzdHVkZW50X2lkIjoiMDAwMDAwMDAwMCIsIm5hbWUiOiJhZG1pbiIsInN1cm5hbWUiOiJhZG1pbiIsImlhdCI6MTQ5OTA1NTYzOCwiZXhwIjoxNDk5MTQyMDM4fQ.Lz1-3bNGo8yysiupLpSePzystRHY6l_Igp-1lUIbdLtf6fgM_eCaYW-rTjIh7K_wjv0lOOO8C985D6BBqHshkQ",
            "pop": 0,
            "hard": 1,
            "soft": 2
        }
        ```
    2. return: json with `successful` key
        - complete: extra key is `id`
        - error: extra key is `message`
        ```json
        {
            "successful": true,
            "id": "0"
        }
        ```


5. insert group **(POST)**
    1. link: localhost/insert
    ```json
    {
        "code": 100,
        "name": "name",
        "description": "description",
        "picture": ""
    }
    ```
    2. return: json with `informations` and `information_vote` key and inside have id that represent insert id.
    ```json
    {
        "informations": {
            "id": "100"
        },
        "information_vote": {
            "id": "100"
        }
    }
    ```
