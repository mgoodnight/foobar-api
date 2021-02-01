

# Foobar API #
Barebones, simple user session management backend app

### In a gist ###
This was an old take-home coding assignment for a company I applied to a while back. They wanted me to create a very basic user management backend in Node/Typescript (sign-up/log-in) with sessions and a route for the user to retrieve their information if a session was active. The idea was that in the next round, myself and a member of their engineering team were going to pair-program to extend extra functionality.

Long story short, the company filled the position before I could even submit the assignment and the recruiter didn't inform me until a couple weeks later (**Please don't ghost your candidates!**).

Fast-forward, I was working on a couple of frontend clients with no backend and decided instead of stubbing/mocking user sessions, I just spun this guy up instead.

### Develop ###
Fill out a `.env` file with the following:
```
TYPEORM_CONNECTION = mysql
TYPEORM_HOST = db
TYPEORM_USERNAME = root
TYPEORM_PASSWORD = root
TYPEORM_DATABASE = foobar
TYPEORM_PORT = 3306
TYPEORM_ENTITIES = dist/entities/*.js
```
`docker-compose up`

### Routes ###
`POST /user`

`PUT /user`

`POST /session`

`DELETE /session`

`GET /user`

### Sessions ###
Sessions are JWT based via a cookie. Payload only stores the userId (auto-incremented primary key from MySQL).
