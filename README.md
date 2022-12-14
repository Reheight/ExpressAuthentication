# ExpressAuthentication

## _Rapid Authentication Development_

Express Authentication is a boilerplate for Express authentication using a form of 'access-tokens' but this should not be mistaken with OAuth2 as this does not contain refresh tokens and such. Once a token expires, they will need to login again.

> You can actually keep users logged in by refreshing the access-token in the backend by checking if the session still exists but is just expired and if that's true then you can update the current access-token with a updated one and feed that to the client.

## Technology

ExpressAuthentication uses a number of open source projects to work properly:

- [Express] - Backend server to host the API
- [Prisma] - ORM for SQL
- [@Prisma/Client] - Client for Prisma
- [bcrypt] - Secure Encryption
- [cors] - Cross-Origin Protection
- [body-parser] - Middleware to assist us reading requests in Express
- [dotenv] - Creates an easy way to access .env variables
- [jsonwebtoken] - Secure way of handling data exchange between users and servers such as authentication

## Installation

ExpressAuthentication has been verified to work on [Node.js](https://nodejs.org/) v16.17+

Install the dependencies start the server

```sh
cd expressauthentication
npm i
npm run start
```

## License

MIT

[express]: https://www.npmjs.com/package/express
[prisma]: https://www.npmjs.com/package/prisma
[@prisma/client]: https://www.npmjs.com/package/@prisma/client
[bcrypt]: https://www.npmjs.com/package/bcrypt
[cors]: https://www.npmjs.com/package/cors
[body-parser]: https://www.npmjs.com/package/body-parser
[dotenv]: https://www.npmjs.com/package/dotenv
[jsonwebtoken]: https://www.npmjs.com/package/jsonwebtoken
