/**
 * Creates an XHR/AJAX request object and returns it.  Accounts
 * for browsers that do not support or implement the
 * XMLHttpRequest.withCredentials property.
 *
 * @return {XMLHttpRequest}
 */
export function createRequestObject () {
  // create our XHR variable
  var xhr = new XMLHttpRequest();

  // if we need send CORS requests on browsers that don't
  // support CORS using XMLHttpRequest then we need to look
  // for an alternative
  if (
    ! 'withCredentials' in xhr &&
    typeof XDomainRequest !== 'undefined'
  ) {
    xhr = new XDomainRequest();
  }

  return xhr;
}

/**
 * Creates a promise chain for the given XHR and request objects.
 * Pipes request and response values through the appropriate
 * interceptors and passes the error to each error handler if
 * needed.
 *
 * @param  {XMLHttpRequest} xhr
 * @param  {Object} req
 * @param  {Array} onReq
 * @param  {Array} onRes
 * @param  {Array} onErr
 * @return {Promise}
 */
export function sendRequest (xhr, req, onReq = [], onRes = [], onErr = []) {
  return Promise.resolve(req)
  .then(applyInterceptors.bind(null, onReq, xhr))
  .then(validateRequest)
  .then(sendRequestObject.bind(null, xhr))
  .then(formatResponse)
  .then(applyInterceptors.bind(null, onRes, xhr))
  .catch(invokeErrorHandlers.bind(null, onErr, xhr));
}

/**
 * Returns a promise for the onload and onerror events
 * of the given XHR object.
 *
 * @param  {XMLHttpRequest} xhr
 * @param  {Object} req
 * @return {Promise}
 */
export function sendRequestObject (xhr, req) {
  return new Promise(function (accept, reject) {
    // process the onload event
    xhr.onload = function () {
      accept(this);
    };
    // process the fatal error event
    xhr.onerror = function () {
      reject(new Error('Portals was unable to make the network request!'));
    };
    // open our xhr request object and configure it
    xhr.open(req.method, req.url, true);
    xhr.withCredentials = req.withCredentials;
    // add the headers to the request
    for (let k in req.headers) {
      xhr.setRequestHeader(k, req.headers[k]);
    }
    // send the request
    xhr.send(req.body);
  });
}

/**
 * Pipes a value through each interceptor function while always
 * supplying the XHR object as the second argument to each one.
 * Returns the result of the promise chain.
 *
 * @param  {Array} interceptors
 * @param  {XMLHttpRequest} xhr
 * @param  {*} val
 * @return {Promise}
 */
export function applyInterceptors (interceptors, xhr, val) {
  return interceptors.reduce(function (current, next) {
    return current.then(val => next(val, xhr));
  }, Promise.resolve(val));
}

/**
 * Loops through each of the given error handlers, passing each one the
 * error object and the XHR object before returning a rejected promise
 * with the same error.
 *
 * @param  {Array} handlers
 * @param  {XMLHttpRequest} xhr
 * @param  {Error} err
 * @return {Promise}
 */
export function invokeErrorHandlers (handlers, xhr, err) {
  handlers.forEach(handler => handler(err, xhr));
  return Promise.reject(err);
}

/**
 * Formats a resolved XHR object as a simple object literal
 * with the status code, basic headers, response type and body
 * contents.
 *
 * @param  {XMLHttpRequest} xhr
 * @return {Object}
 */
export function formatResponse (xhr) {
  return {
    status: xhr.status,
    headers: {
      'Content-Type': xhr.getResponseHeader('Content-Type'),
      'Cache-Control': xhr.getResponseHeader('Cache-Control'),
      'Expires': xhr.getResponseHeader('Expires')
    },
    type: xhr.responseType,
    body: xhr.responseText
  };
}

/**
 * Validates request options and ensures URL and method are provided.
 *
 * @param  {Object} req
 * @return {Object}
 */
export function validateRequest (req) {
  // ensure method is present and a string
  if (typeof req.method !== 'string') {
    throw new Error('Invalid request method provided');
  }

  // ensure url is present and a string
  if (typeof req.url !== 'string') {
    throw new Error('Invalid url provided');
  }

  // ensure that "headers" is an object
  if (typeof req.headers !== 'object' || Array.isArray(req.headers)) {
    throw new Error('Invalid headers object provided');
  }

  return req;
}

/**
 * Replaces {tokens} with values from the given object literal
 * of key value pairs.
 *
 * @param  {String} str
 * @param  {Object} obj
 * @return {String}
 */
export function parseTokens (str, obj) {
  return str.replace(/{ *([a-zA-Z0-9\-\_]+) *}/g, function (m, m1) {
    return obj[m1] || '{' + m1 + '}';
  });
}

/**
 * Creates a query string out of an object of key value pairs.
 *
 * @param  {Object} query
 * @return {String}
 */
export function queryString (query) {
  return Object.keys(query).map(function (key, i) {
    // capture the value so we can modify if needed
    let val = query[key];
    // if the value is an array, comma-separate it
    if (Array.isArray(val)) val = val.join(',');
    // return the resulting query string
    return ((i === 0 ? '?' : '&') + key + '=' + val);
  }).join('');
}
