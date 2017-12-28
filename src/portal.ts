import {Request, Response, Middleware} from "./";

export interface Portal<Request, Response> {
  (request: Request): Promise<Response>;
}

/**
 * Read all response headers from the given XHR instance into a standard
 * object literal.
 */
export function getAllHeaders(xhr: XMLHttpRequest): object {
  // Read all headers into a string
  var headers = xhr.getAllResponseHeaders();

  // Split the header components apart into an array
  var arr = headers.trim().split(/[\r\n]+/);

  // Map over all of the headers to create an object
  var output = {};
  arr.forEach(function (line) {
    var parts = line.split(": ");
    var header = parts.shift();
    var value = parts.join(": ");
    output[header] = value;
  });

  // Return the object
  return output;
}

/**
 * Sends the request to the server.  This is used by createPortal() after
 * all middleware has been applied.
 */
export function send(request: Request): Promise<Response> {
  return new Promise(function (accept, reject) {
    // Create the XHR object for the request
    var xhr = new XMLHttpRequest();

    // Open the request with the given configuration
    xhr.open(request.method, request.url, true);
    xhr.withCredentials = request.cors;

    // Add each header to the XHR request
    for (var k in request.headers) {
      xhr.setRequestHeader(k, request.headers[k]);
    }

    // Reject on error
    xhr.onerror = function (ev) {
      reject(ev.error);
    };

    // Generate a formatted object for the response
    xhr.onload = function () {
      accept({
        xhr: xhr,
        statusCode: xhr.status,
        contentType: xhr.getResponseHeader("Content-Type"),
        headers: getAllHeaders(xhr),
        body: xhr.responseText,
      });
    }

    // Send the request
    xhr.send(request.body);
  });
};

/**
 * Creates and returns a new "portal" instance for creating HTTP
 * requests.  Each request and response is passed through the
 * given middleware.
 */
export function createPortal<Req extends Request = Request, Res extends Response = Response>(...middleware: Middleware<Req, Res>[]): Portal<Req, Res> {
  // Add our send method as "middleware"
  middleware = middleware.concat(send as any);

  return function(request) {
    // If the request body is a FormData object, set our Content-Type header
    var contentType = (
      request.body instanceof FormData ? "multipart/form-data" : "text/plain"
    );

    // Create a new copy of our request object so middleware doesn't mutate
    // a given object
    request = {
      method: "GET",
      cors: true,
      headers: {
        "Content-Type": contentType,
      },
      ...request as any,
    };

    // If the request body is a FormData object, then we automatically set
    // the Content-Type regardless of middleware
    if (request.body instanceof FormData) {
      request.headers["Content-Type"] = "multipart/form-data";
    }

    // Track the last invoked middleware index
    var lastIndex = -1;

    // Next function invokes the next middleware in the stack (only once)
    function next(i: number) {
      // Warn and bail if a middleware is invoking its next() method multiple times
      if (lastIndex > i) {
        console.warn("Middleware fired its next() method more than once.");
        return;
      }

      // Track the last index that will fire
      lastIndex = i;

      // Invoke the next middleware in the stack or report an error
      try {
        var res = middleware[i](request, () => next(i + 1));
        return Promise.resolve(res);
      } catch (err) {
        return Promise.reject(err);
      }
    };

    return next(0);
  };
}