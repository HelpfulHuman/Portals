![Portals](logo.png)

Portals is a library for making XHR requests with middleware support.

## Getting Started

Install the library with `npm`:

```sh
npm install --save portals
```

Once installed, you can import the `createPortal()` function to get up and running immediately.  This function is a factory that will set up a new "portal" for creating HTTP requests.

```ts
import {createPortal} from "portals";

const http = createPortal();

http({ url: "http://example.com/some/endpoint" }).then(res => ...)
```

The example above doesn't do much outside of creating an XHR request for you.  However, the usefulness of this library lies in its use of [middleware](#middleware).  The example below will stringify and parse JSON for the request and response data, prefix given URLs with the desired hostname and add the Authorization header with a Bearer token.

> **Note:** Don't be afraid to have multiple portal functions for different use cases.  The returned function is incredibly simple and contains little overhead.

```ts
import {createPortal, supportsJson, withPrefix, withBearer} from "portals";

const exampleApi = createPortal(
  supportsJson(),
  withPrefix("https://api.example.com")
  withBearer(req => localStorage.getItem("apiToken"))
);
```

### The Request Object

The table below outlines the fields supported by all requests, regardless of middleware.

| Field               | Type      | Description                                                                                                                                                                             |
| ------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **url**             | `string`  | The endpoint address that we'll making a request to.  **This field is required.**                                                                                                       |
| **method**          | `string`  | The HTTP method used for the request.  _Defaults to `"GET"`._                                                                                                                           |
| **headers**         | `object`  | An object literal containing all of the HTTP headers for the request.  Automatically gets mapped to the XHR object for the request.                                                     |
| **body**            | `any`     | The request body used by `POST`, `PUT` and `PATCH` requests.  By default, you should use `string` or `FormData` formats unless you have middleware in place to handle type conversions. |
| **withCredentials** | `boolean` | Sets the value of the `.withCredentials` property of the XHR instance for the request in order to allow secured cross-domain calls. _Defaults to `true`._                               |

### The Response Object

The table below represents the object generated for a response before middleware is applied.

| Field           | Type             | Description                                                                                               |
| --------------- | ---------------- | --------------------------------------------------------------------------------------------------------- |
| **xhr**         | `XMLHttpRequest` | The XHR instance used to perform the request.                                                             |
| **statusCode**  | `number`         | The HTTP status code returned by the server.  Should be within the 200 - 299 for OK or accepted requests. |
| **contentType** | `string`         | The MIME type for the response provided by the `Content-Type` response header.                            |
| **headers**     | `object`         | Response headers in a simplified object literal.                                                          |
| **body**        | `any`            | The body of the response.                                                                                 |

### Error Handling

Because every endpoint handles errors differently, the errors that are reported to your Promise's `.catch()` handler are only for fatal errors related to problems within your middleware or the XHR call itself.  Instead, you can check the status code on the response object that is returned.

## Middleware

The middleware system employed by this library is based on Promises and should feel familiar to people who have used libraries with similar patterns (like [Koa](https://koajs.com)).  Middleware in Portals is a function that accepts a `Request` object and a `next()` function that will invoke and return the result of the next middleware in the stack.  The result of `next()` will _always_ be a `Promise`.

> **Note:** Portals supports native promises and can safely be used with the `async/await` keywords.

```ts
function myMiddleware(request, next) {
  // do something with the request
  return next().then(function(response) {
    // do something with the response
  });
}
```

## Included Middleware

### `supportsJson()`

Encodes object literal `body` values into JSON requests and automatically parses JSON response bodies.

### `withPrefix(prefix)`

Prefix the request URL with either a full hostname or partial URI.

```ts
import {withPrefix} from "portals";

// converts `/foo` to `/api/foo` and...
// converts `http://example.com` to `http://example.com/api`
withPrefix("/api")

// converts `/foo` to `http://example.com/foo` but
// leaves `http://somewhere.else.com/foo` alone
withPrefix("http://example.com")
```

### `withHeader(name, value, override = false)`

Add a header to your request, either as a default if none is provided or as a constant override.  The second argument, `value`, can also be a function that receives the `request` object.

```ts
import {withHeader} from "portals";

// Default header
withHeader("Content-Type", "application/json")

// Constant override header
withHeader("Content-Type", "application/json", true)

// Dynamic header value
withHeader("Content-Type", (req) => (req.body instanceof FormData ? "multipart/form-data" : "application/json"))
```

### `withAuthorization(getToken)`

Passes the `request` object to the given `getToken` method to generate a value for the `Authorization` header.  Optionally supports a custom string `prefix` as the second value that is only applied when a string value is successfully returned from the `getToken` function call.

```ts
import {withAuthorization} from "portals";

withAuthorization(req => localStorage.getItem("apiToken"))
// { headers: { Authorization: "${apiToken}" } }

withAuthorization(req => localStorage.getItem("apiToken"), "Token ")
// { headers: { Authorization: "Token ${apiToken}" } }
```

### `withBearer(getToken)`

Passes the `request` object to the given `getToken` method to generate a Bearer token for the `Authorization` header.

```ts
import {withBearer} from "portals";

withBearer(req => localStorage.getItem("apiToken"))
// { headers: { Authorization: "Bearer ${apiToken}" } }
```
