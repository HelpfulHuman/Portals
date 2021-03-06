import { Request, Response, Middleware, HttpHeaderLiteral } from "./";

export type Portal<Request, Response> = (request: Request) => Promise<Response>;

/**
 * Read all response headers from the given XHR instance into a standard
 * object literal.
 */
export function getAllHeaders(xhr: XMLHttpRequest): HttpHeaderLiteral {
  // Read all headers into a string
  let headers = xhr.getAllResponseHeaders();

  // Split the header components apart into an array
  let arr = headers.trim().split(/[\r\n]+/);

  // Map over all of the headers to create an object
  let output: HttpHeaderLiteral = {};
  for (let line of arr) {
    let parts = line.split(": ");
    let header = parts.shift();
    let value = parts.join(": ");
    if (!!header) {
      output[header] = value;
    }
  }

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
    let xhr = new XMLHttpRequest();

    // Open the request with the given configuration
    xhr.open(request.method!, request.url, true);
    xhr.withCredentials = !!request.withCredentials;

    // Add each header to the XHR request
    if (typeof request.headers === "object") {
      for (let k in request.headers) {
        let value = request.headers[k];
        xhr.setRequestHeader(k, (
          Array.isArray(value) ?
            value.join(", ") :
            value
        ));
      }
    }

    // Reject on error
    xhr.onerror = function (ev: ProgressEvent | any) {
      reject(ev.error || new Error("XHR request failed without reason."));
    };

    // Generate a formatted object for the response
    xhr.onload = function () {
      const res: Response = {
        xhr: xhr,
        statusCode: xhr.status,
        contentType: xhr.getResponseHeader("Content-Type"),
        headers: getAllHeaders(xhr),
        body: xhr.responseText,
      };
      accept(res);
    };

    // Send the request
    xhr.send(request.body);
  });
}

/**
 * Creates and returns a new "portal" instance for creating HTTP
 * requests.  Each request and response is passed through the
 * given middleware.
 */
export function createPortal(...middleware: Middleware[]) {
  // Add our send method as "middleware"
  middleware = middleware.concat(send as any);

  return function portal<
    Req extends Request = Request,
    Res extends Response = Response
  >(request: Req): Promise<Res> {
    let oc_content_type = (request.headers ? request.headers["Content-Type"] : null);

    // Create a new copy of our request object so middleware doesn't mutate
    // a given object
    request = {
      method: "GET",
      withCredentials: false,
      headers: {
        "Content-Type": "text/plain",
      },
      ...request as any,
    };

    // If the request body is a FormData object, then we automatically set
    // the Content-Type regardless of middleware
    if (!oc_content_type && request.body instanceof FormData) {
      request.headers!["Content-Type"] = "multipart/form-data";
    }

    // Track the last invoked middleware index
    let lastIndex = -1;

    // Next function invokes the next middleware in the stack (only once)
    function next(i: number): Promise<any> {
      // Warn and bail if a middleware is invoking its next() method multiple times
      if (lastIndex > i) {
        console.warn("Middleware fired its next() method more than once.");
        return Promise.reject(new Error("Middleware fired its next() method more than once."));
      }

      // Track the last index that will fire
      lastIndex = i;

      // Invoke the next middleware in the stack or report an error
      try {
        let res = middleware[i](request, () => next(i + 1));
        return Promise.resolve(res);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return next(0);
  };
}