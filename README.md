# Test Objective

The backend test is as follows:
(You shall setup an accessible Mongodb backend database with a Nodejs framework to the best of your ability)

1. Set up a nodejs server and connect it to a mongodb collection. We should be able to send data to certain urls to
   store and get data.
2. `/api/getUsers` - returns a json object with all the users in the database
3. `/api/insertUser` - accepts the following form data and inserts into the User table.
    - `name`
    - `email`
    - `username`
    - `password`
4. Password being encrypted once inserted into the database

## API

- [Start scripts](#start-scripts)
- [getUsers](#getusers)
- [insertUser](#insertuser)

Look at `doc/user.requests.http` file for executable examples on `HTTP Rest Client`.

### Start scripts

First install all dependencies with `npm i`.
Then make a copy of/rename `.env-example` file as `.env` and adjust if necessary.
To run tests also adjust `.env-test` file.

| Script               | Description        |
|----------------------|--------------------|
| `npm start`          | Start the service. |
| `npm run start-dev`  | Start the service in dev/watch mode. On source file change service will be restarted. |
| `npm test`           | Run unit tests. |
| `npm test-dev`       | Run unit tests in watch mode. |
| `npm test-int`       | Run integration tests. |
| `npm test-int-dev`   | Run integration tests in watch mode. |

### getUsers

Retrieves all users.

#### Request Parameters

None.

#### Response Parameters

`users` field on a response body holds the list of the users with the following fields:

| Field    | Description        |
|----------|--------------------|
| _id      | ID of the user     |
| username | User name/login    |
| name     | Full Name          |
| email    | Email Address      |

#### Sample request/response

##### Request

```shell
curl -X GET \
  -H 'Accept: application/json' \
  http://localhost:3000/api/getUsers
```

##### Response on success

```json
{
  "users": [
    {
      "_id": "607e8d0844e1bd7da5e0cd97",
      "username": "some_user",
      "name": "Some User",
      "email": "some@email.com"
    }
  ]
}
```

##### Response on success but no users exist yet

```json
{
  "users": []
}
```

### insertUser

Creates a new user.

#### Request Parameters

| Field    | Description        | Is Mandatory? |
|----------|--------------------|---------------|
| username | User name/login    | Yes           |
| name     | Full Name          | Yes           |
| email    | Email Address      | Yes           |

#### Response Parameters

`user.id` field on a response body holds the newly created user's ID.

#### Sample request/response

##### Request

```shell
curl -X POST \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  http://localhost:3000/api/insertUser \
  -d '{
    "username": "some_guy",
    "name": "Some Guy",
    "email": "some_guy@gmail.com",
    "password": "123Qw+@cvb"
  }'
```

##### Response on success

HTTP Code: `200`

```json
{
  "user": {
    "id": "607e8d0844e1bd7da5e0cd97"
  }
}
```

##### Response on error

HTTP Code: `400`

```json
{
  "error": "Invalid username"
}
```
