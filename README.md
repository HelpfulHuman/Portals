# Portals [![Build Status](https://travis-ci.org/HelpfulHuman/Portals.svg?branch=master)](https://travis-ci.org/HelpfulHuman/Portals)

Portals is a library for making XHR/AJAX requests with some syntactic sugar.

The goals of this project are as follows:

* Highly extensible
* Shared options between requests
* Supports promises (and uses ES6 promises when available)
* Smallest file size possible (under 4kb minified desired)
* As few dependencies as possible

## Getting Started

### Install via NPM

```
npm install --save portals
```

And make sure to `require` it:

```javascript
var portals = require('portals')
```

### Install via Bower

```
bower install --save portals
```

## Create an Instance

Once installed, just instantiate an instance of the `Portal` constructor.

```javascript
var http = new portals.Portal()
```

## Sending Requests

Sending requests isn't all that different from other libraries of this nature.  Simply supply a request object with url and method, along with any other request details you may need like a headers object, request body, etc...

The `send()` method, and the helper methods, will return a standard promise with `then()` for successful (200 status code) responses and `catch()` for errors.

```javascript
http.send({
  method: 'GET',
  url: '/some-endpoint',
  headers: {
    'Accept': 'application/json'
  }
})
.then(function (res) {
  // do something with response
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

## Features

All features are just interceptors that come with the library.  These are available on the `interceptors` property and are automatically added when `useDefaultInterceptors()` is called.

### Globals

Often times you may need to set a global value, like a set of headers or default hostname for your request URLs.  This is where using globals and the `mergeGlobalsRequest` interceptor comes in handy.

```javascript
http.globals.hostname = 'http://some-api.com'
http.globals.headers.Accept = 'application/yml'

http.get('/my-endpoint')
// will call "http://some-api.com/my-endpoint"
```

##### Standalone Usage

```javascript
http.onRequest( portals.interceptors.mergeGlobalsRequest )
```

### Concatenate Hostname and Url

Concatenates the `hostname` and `url` for the request if "http" is not present in the URL.  

##### Standalone Usage

```javascript
http.onRequest( portals.interceptors.buildUrlRequest )
```

### [PLANNED] URL Parameter Customization

_Note: This interceptor has yet to be built._

Allow tokens to be added to the url string and have those tokens replaced with matching key values from a "params" object.

**Example:**

```javascript
http.send({
  method: 'GET',
  url: '/posts/:postId',
  params: {
    postId: 100
  }
})

// hits "/posts/100"
```

##### Standalone Usage

```javascript
http.onRequest( portals.interceptors.parseUrlParamsRequest )
```

### [PLANNED] Query String Configuration

_Note: This interceptor has yet to be built._

Builds a query string out of a "query" object.

**Example:**

```javascript
http.send({
  method: 'GET',
  url: '/posts',
  query: {
    page: 20
  }
})

// hits "/posts?page=20"
```

##### Standalone Usage

```javascript
http.onRequest( portals.interceptors.buildQueryRequest )
```

### Encode JSON Request Body

Encodes a `data` or `body` object as JSON if the `Content-Type` header contains `"json"` and sets it as the request body.

##### Standalone Usage

```javascript
http.onRequest( portals.interceptors.encodeJsonRequest )
```

### Parse JSON Response Body

Parses the `body` of the response if the `Content-Type` header contains `"json"`.

##### Standalone Usage

```javascript
http.onRequest( portals.interceptors.parseJsonResponse )
```
