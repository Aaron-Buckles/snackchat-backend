# snackchat-backend

## Installation

- Clone this repository
- Run `npm i` to install all dependencies

## Running Backend

### Environment Variables

Create a file named `.env`:

```
DEBUG=http
DB_URI=aaa
JWT_SECRET_KEY=bbb
AWS_ACCESS_KEY_ID=ccc
AWS_SECRET_ACCESS_KEY=ddd
S3_BUCKET_NAME=cs125-snackchat
```

- Make sure that `DB_URI` contains your username and password
  - Something like `mongodb+srv://<username>:<password>@cluster0-ulaiv.mongodb.net/test?retryWrites=true&w=majority`
- Ask me for `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
- Remove `DEBUG` if you don't want to see any debugging information

### Running

- Type `npm run dev` in your terminal
- The default port is 3000: `http://localhost:3000/`
  - If you have the `PORT` environment variable set to something else, then navigate to localhost for that port

## Documentation

- Go to `http://localhost:3000/docs`
