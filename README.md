# Portals [![Build Status](https://travis-ci.org/HelpfulHuman/Portals.svg?branch=master)](https://travis-ci.org/HelpfulHuman/Portals)

[![Join the chat at https://gitter.im/HelpfulHuman/Portals](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/HelpfulHuman/Portals?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Portals is a library for making XHR/AJAX requests with some syntactic sugar.

> **Note:** This library assumes you are working in an environment that supports `Object.keys`, `Object.assign` and `Promise`s.  If you are not then you will need to ensure that a polyfill is in place before using this library.

## Getting Started

First things first, you'll need to install the library using `npm`.

```
npm install --save portals
```

Once installed, you can import the `createPortal()` function to get up and running immediately.  This function is a factory that will set up a `Portal` instance with some default interceptors that offer baseline functionality for the most common of requests.

```javascript
import { createPortal } from 'portals';

const http = createPortal({
  globals: {
    hostname: 'https://some-web-service.com',
    headers: {
      Authorization: 'Bearer S#Gwer6in456DFGhje#$5dfgsr5)Lgeryugh'
    }
  }
});
```

### Options

Name | Type | Description
-----|------|------------
`globals` | `Object` | An object containing a default request template that will be applied to each outgoing request.
`json` | `Boolean` | Defaults to `true`.  Enables interceptors for encoding and parsing JSON requests and responses respectively.
`queries` | `Boolean` | Defaults to `true`.  Enables automatic query string building using a `query` object for outgoing requests.
`params` | `Boolean` | Defaults to `true`.  Enables URL tokens to be replaced with matching values in a `params` object for outgoing requests.
`okStatuses` | `Number[]` | An array containing all the "OK" status codes.  Any status code not in this list will result an error.  You can optionally disable this feature entirely by setting it to `false`.  By default, all `200` and `300` status codes are allowed.
`resolveTypes` | `Boolean` | Defaults to `true`.  Attempts to determine the appropriate `Content-Type` header for the request based on the body.

## Sending Requests

Sending requests isn't all that different from other libraries of this nature.  Simply supply a request object with url and method, along with any other request details you may need like a headers object, request body, etc...

The `send()` method, and the helper methods, will return a standard promise with `then()` for successful responses and `catch()` for errors.

```javascript
http.send({
  method: 'GET',
  url: '/some-endpoint',
  headers: {
    Accept: 'application/json'
  }
}).then(function (res) {
  // do something with response
});
```

### Helpers

Portals offers the typical helper methods for making method specific calls like `GET`, `POST`, `PUT` and `DELETE`.  These return the same result as `send()`.  

> **Note:** These examples assume that the `queries` and `params` settings are enabled.

```javascript
// GET /reports?order=asc
http.get('/reports', { query: { order: 'asc' } })

// POST /articles
http.post('/articles', { subject: 'Hello World' })

// PUT /users/93
http.put('/users/{id}', { name: 'Johnny 5' }, { params: { id: 93 } })

// DELETE
http.delete('/users/23');
```

## Interceptors

Portals is made extensible via "interceptors".  These are functions that have the capability to modify request and response data.  Portals ships with a few standard interceptors that are added for you based on the configuration that you pass to `createPortal()`.

If you want to cherry pick from the default interceptors, you can find them on the `interceptors` property and add them with the methods that will be listed below.

```javascript
import { interceptors } from 'portals';
```

### Adding Interceptors

You can add your own interceptors using either the `onRequest()` or the `onResponse()` methods.  Interceptors are expected to pipe modified input to the next interceptor in the chain, allowing modification in a linear fashion.  

Interceptors added to a `Portal` instance and are applied to _all_ requests made by that instance.  Be sure to take this into account when adding new interceptors.

> **Note:** Interceptors will also receive the XHR object for the request as their second argument.  Though it is discouraged to modify the XHR object directly unless absolutely necessary!

### Request Interceptors

The `onRequest()` method adds a function that will be run when a request is about to go.  It receives the request object (often called `req`), which contains information like method, url, headers, etc...  Interceptors must return an object with strings for `method` and `url`.

```javascript
var http = createPortal();

http.onRequest(function (req) {
  console.log('logging: ', req.url);
  return req;
});

http.get('/my-endpoint'); // "logging: /my-endpoint"
```

### Response Interceptors

The response interceptor is almost identical to the request interceptor, except instead of a request object it receives and returns the "response" object (often called `req`) for the completed request.

```javascript
var http = createPortal();

http.onResponse(function (res) {
  res.body = 'intercepted!!!';
  return res;
});

http.get('/my-endpoint').then(function (res) {
  console.log(res.body); // "intercepted!!!"
});
```

### Async Interceptors

Interceptors can also be asynchronous if needed by returning a `Promise`.

```javascript
http.onRequest(function (req) {
  return new Promise(function (accept, reject) {
    setTimeout(function () {
      accept(req);
    }, 5000);
  });
});
```

## Error Handlers

Similarly to interceptors, there are error handlers for when things go wrong.  Whenever an error occurs during a request, all error handlers will be run before the subscribed `.catch()` function is invoked.

```javascript
const http = createPortal();

http.onError(function (err, xhr) {
  // do something due to an error
});
```
