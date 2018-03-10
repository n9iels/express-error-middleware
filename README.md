# Express Error Middleware
Express Error Middleware is a middleware for Express to handle and log errors in a REST API. When a error occures, it will log the error in the console and send a JSON object to the client.

## Installation and usage
Install the package with NPM
```
npm install --save express-error-middleware
```

Use one of the following example below to load and configure the middleware

JavaScript example:
```js
const Logger = require("express-error-middleware")

app.use(Logger.errorHandlingMiddleware({ logLevel: ["error", "warning", "info"] }))

// Send the the error as JSON object
app.use((err: Error, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    res.send(err)
})
```

TypeScrpt example
```ts
import * as Logger from "express-error-middleware"

app.use(Logger.errorHandlingMiddleware({ logLevel: ["error", "warning", "info"] }))

// Send the the error as JSON object
app.use((err: Error, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    res.json(err)
})
```

### Options
The following configuration options are available:
| Option        | Default                        | Description                                                                          |
| ------------- |------------------------------- | ------------------------------------------------------------------------------       |
| logLevel      | `["error", "warning", "info"]` | The level of logging in the console. Only errors of the given levels will be logged. |

## Error handling
The middleware will use the data given to the `next()` function to log and return an error. The return error will be a JSON object with a `status` and `message` attribute.

### Status code
You can set the status code of a response by passing a valid HTTP status code to the `next()` function. The response will contain a correspondending message for the status code.

```js
app.get("/crash", (req, res, next) => {
    next(400) // Use a valid HTTP status code
})
```

The code above results in the following response:
```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "status": 400,
  "message": "Bad Request"
}
```
The following logging will be written to the console
```
2018-03-10T16:33:48.011Z - INFO - GET /crash (400) - Bad Request
```

### Message
A custom message will always be seen as a `500 Internal Server Error`.

```js
app.get("/crash", (req, res, next) => {
    next("Don't panic!") // Use a valid HTTP status code
})
```

The code above results in the following response:
```
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "status": 500,
  "message": "Don't panic!"
}
```
The following logging will be written to the console
```
2018-03-10T16:33:48.011Z - ERROR - GET /crash (500) - Don't panic!
```

### Object
You can pass a object to the `next()` function to add more information to the error.
```js
app.get("/crash", (req, res, next) => {
    // The 'status' and 'message' attributes are mendatory
    next({
        status: 401
        message: "You are not allowed to see this!",
        info: "More information in this response"
    })
})
```

The code above results in the following response:
```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "status": 401,
  "message": "You are not allowed to see this!",
  "info": "More information in this response"
}
```
The following logging will be written to the console
```
2018-03-10T16:33:48.011Z - ERROR - GET /crash (401) - You are not allowed to see this!
```

### Error
When a `Error` object is given the status code will be always `500` with the given message.

```js
app.get("/crash", (req, res, next) => {
    next(new Error("Something went wrong...")) // Use a valid HTTP status code
})
```

The code above results in the following response:
```
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "status": 500,
  "message": "Something went wrong..."
}
```
The following logging will be written to the console
```
2018-03-10T16:33:48.011Z - INFO - GET /crash (500) - Something went wrong...
```

## Error logging
The middleware also provides a simple log method. See the example below
```js
const Logger = require("express-error-middleware")
Logger.log("error", "PANIC!!")
Logger.log("warning", "Something seems not right here...")
Logger.log("info", "For your information")
```

The code above produces the following output in the console
```
2018-03-10T16:33:48.011Z - ERROR - PANIC!!
2018-03-10T16:33:48.011Z - WARNING - Something seems not right here...
2018-03-10T16:33:48.011Z - INFO - For your information
```