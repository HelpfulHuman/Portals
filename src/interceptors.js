import { parseTokens, queryString } from './utils';

/**
 * Simple JSON regex check.
 * @type {Regex}
 */
const isJson = /json/i;

/**
 * Higher-order function that will apply the given globals to
 * each request that gets piped through.
 *
 * @param  {Object} globals
 * @return {Function}
 */
export function mergeGlobals (globals) {
  globals = Object.assign({
    hostname: '',
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }, globals);

  return function (req) {
    return Object.assign({}, globals, req);
  }
}

/**
 * Returns a funciton that will build up the URL for a request
 * using the given url, a hostname (if set) and any params or
 * query objects.
 *
 * @param  {Bool} enableQueries
 * @param  {Bool} enableParams
 * @return {Function}
 */
export function buildRequestUrl (enableQueries, enableParams) {
  return function (req) {
    // if "http" is not present in url, add the hostname
    if (req.url.indexOf('http') !== 0) {
      req.url = (req.hostname + '/' + req.url).replace(/\/+/g, '/');
    }

    // if params are present, switch out params with the values
    if (enableParams && typeof req.params === 'object') {
      req.url = parseTokens(req.url, req.params);
    }

    // build and append a query string if necessary
    if (
      enableQueries &&
      typeof req.query === 'object' &&
      ! Array.isArray(req.query)
    ) {
      req.url += queryString(req.query);
    }

    return req;
  }
}

/**
 * Encodes the request body as a JSON string when the body
 * is an object and Content-Type is set to "application/json".
 *
 * @param  {Object} req
 * @return {Object}
 */
export function encodeJsonRequest (req) {
  if (
    typeof req.body === 'object' &&
    isJson.test(req.headers['Content-Type'])
  ) {
    req.body = JSON.stringify(req.body);
  }

  return req;
}

/**
 * Parses a JSON response body if Content-Type on the response
 * is set to "application/json".
 *
 * @param  {Object} res
 * @return {Object}
 */
export function parseJsonResponse (res) {
  if (isJson.test(res.headers['Content-Type'])) {
    res.body = JSON.parse(res.body);
  }

 return res;
}

/**
 * Returns a function that will compare a given response's
 * "status" code against the given list of "ok statuses".  If
 * the list does not contain the status code, then the function
 * will throw an error.
 *
 * @param  {Array} allowed
 * @return {Function}
 */
export function checkStatus (allowed = []) {
  return function (res) {
    if (allowed.indexOf(res.status) === -1) {
      throw new Error('The response contained an invalid status code of ' + res.status);
    }

    return res;
  }
}

/**
 * Attempts to determine the "Content-Type" header for the request
 * based on the body value of the request.
 *
 * @param  {Object} req
 * @return {Object}
 */
export function assumeContentType (req) {
  let type;
  // if the body is an instance of FormData, set type to multipart
  if (req.body instanceof FormData) type = 'multipart/form-data';
  // if the body starts with < assume XML
  else if (req.body.indexOf('<') === 0) type = 'application/xml';
  // re-assign the Content-Type header
  if (type) req.headers['Content-Type'] = type;
  // return the modified request object
  return req;
}
