import * as _utils from './utils';
import * as _int from './interceptors';
import _Portal from './portal';

const OK_CODES = [
  200, 201, 202, 203, 204, 205, 206, 207, 208, 226,
  300, 301, 302, 303, 304, 305, 306, 307, 308
];

export const utils = _utils;

export const interceptors = _int;

export const Portal = _Portal;

/**
 * Creates a Portal instance and configures it with some default
 * interceptors based on the given options.
 *
 * @param  {Object} opts
 * @return {Portal}
 */
export function createPortal (opts = {}) {
  // set up our options with our defaults underneath
  opts = Object.assign({
    globals: null,
    json: true,
    queries: true,
    params: true,
    okStatuses: OK_CODES,
    resolveTypes: true
  }, opts);

  // create our portal instance
  const portal = new _Portal();

  // add globals interceptor if any globals are set
  portal.onRequest(_int.mergeGlobals(opts.globals));

  // attempt to resolve Content-Types when enabled
  if (opts.resolveTypes) {
    portal.onRequest(_int.assumeContentType);
  }

  // builds a complete url for each request
  portal.onRequest(
    _int.buildRequestUrl(opts.queries, opts.params)
  );

  // if enabled, check the status codes of responses
  if (Array.isArray(opts.okStatuses)) {
    portal.onResponse(_int.checkStatus(opts.okStatuses));
  }

  // add JSON encoding/decoding when enabled
  if (opts.json) {
    portal.onRequest(_int.encodeJsonRequest);
    portal.onResponse(_int.parseJsonResponse);
  }

  // return our configured portal instance!
  return portal;
}
