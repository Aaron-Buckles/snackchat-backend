# snackchat-backend

## Installation

- Clone this repository
- Run `npm i` to install all dependencies
  - Must do this for both frontend and backend

## Running Backend

- For database access set the following environment variables in the `/backend` directory
- `DB_USERNAME`, `DB_PASSWORD`, `JWT_KEY`
- For mac use the `export envVar=value` command in terminal:
  - e.g. `export DB_USERNAME=hello123`
- For windows master race use the `set` command in command prompt:

  - e.g. `set DB_USERNAME=hello123`

- For debug logs set the DEBUG environment variable:
  - `DEBUG=snackchat:*`
- To run navigate to the `backend` folder and type `npm run dev` / `nodemon index.js`
- Go to `http://localhost:3000/`
  - If you have the `PORT` environment variable set to something else, then navigate to localhost for that port

## Documentation

- Go to `http://localhost:3000/docs`
- To access a page that requires authentication, use the Authorization key
  - e.g. With axios:

```javascript
let config = {
  headers: {
    Authorization: "mytoken"
  }
  axios.post(URL, data, config)
}
```
