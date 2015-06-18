# Portals

Portals is a library for making XHR/AJAX requests with some syntactic sugar.

The goals of this project are as follows:

* Highly extensible
* Shared options between requests
* Supports promises
* Smallest file size possible
* As few dependencies as possible

## Getting Started

Install via NPM

```
npm install --save portals
```

Install via Bower

```
bower install --save portals
```

Then just instantiate an instance of the `Portal` class.

```javascript
var portals = require('portals')

var http = new portals.Portal()
```

## Sending Requests

Sending requests isn't all that different from other libraries of this nature.

```javascript
http.send({
  method: 'GET',
  url: '/some-endpoint'
})
.then(function (res) {
  console.log(res)
})
```

### Helpers

Portals offers the typical helper methods for making method specific calls like `GET`, `POST`, `PUT` and `DELETE`.  These are basic shorthands and more advanced queries will want to make use of `send()`.

```javascript
// GET
http.get('/posts')

// POST
http.post('/posts', { id: 1, name: 'example' })

// PUT
http.put('/posts/1', { name: 'changed example' })

// DELETE
http.del('/posts/1')
```

## Interceptors

Portals is made extensible via "interceptors".  These are simply functions that have the capability to modify request and response data.  Portals ships with a few standard interceptors that you can optionally use by calling the method `useDefaultInterceptors()`.

```javascript
http.useDefaultInterceptors()
```

If you want to cherry pick from the default interceptors, you can find them on the `interceptors` property and add them with the methods below.

```javascript
var http = new portals.Portal()
var encodeJsonRequestInterceptor = portals.interceptors.encodeJsonRequest

http.onRequest(encodeJsonRequestInterceptor)
```

### Adding Interceptors

You can add your own interceptors using either the `onRequest()` or the `onResponse()` methods.

The `onRequest()` method adds a function that will be run when a request is about to go.  It receives the `options` object for the request which contains information like method, url, headers, etc...  Interceptors must return an object with strings for `method` and `url`.

```javascript
var http = new portals.Portal()

http.onRequest(function (config) {
  console.log('logging: ', config.url)

  return config
})

http.get('/my-endpoint')
// will print "logging: /my-endpoint"
```

The response interceptor is almost identical to the request interceptor, accept instead of an `options` object it receives and returns the `response` object for the completed request.

```javascript
var http = new portals.Portal()

http.onResponse(function (res) {
  res.body = 'intercepted!!!'

  return res
})

http.get('/my-endpoint')
// response body will be "intercepted!!!"
```

## Globals

Often times you may need to set a global value, like a set of headers or default hostname for your request URLs.  This is where using globals and the `mergeGlobalsRequest` interceptor comes in handy.

```javascript
var http = new portals.Portal()

// you don't need this if you called the "useDefaultInterceptors()" method
http.onRequest(portals.interceptors.mergeGlobalsRequest)

http.globals.hostname = 'http://some-api.com'
http.globals.headers.Accept = 'application/yml'

http.get('/my-endpoint')
// will call "http://some-api.com/my-endpoint"
```

## Default Interceptors

These are interceptors that come available on the `interceptors` property.

#### `validateRequest`

Ensures that the request is properly prepared.

#### `mergeGlobalsRequest`

Uses the `globals` object on a `Portal` instance as a set of defaults that the request is applied to.

#### `buildUrlRequestInterceptor`

Concatenates the `hostname` and `url` for the request if "http" is not present in the URL.  

#### `encodeJsonRequest`

Encodes the `data` object as JSON if the `Content-Type` header contains `"json"`.

#### `parseJsonResponse`

Parses the `body` of the response if the `Content-Type` header contains `"json"`.
