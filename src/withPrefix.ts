import {Request, Middleware} from "./";

/**
 * Applies the hostname prefix to the URL unless the given
 * URL already has a hostname.
 */
function applyHostnamePrefix(url: string, prefix: string) {
  return (url.indexOf("http") === 0 ? url : prefix + url);
}

/**
 * Applies a URI prefix.
 */
function applyResourcePrefix(url: string, prefix: string) {
  if (url.indexOf("http") === 0) {
    // TODO: Take apart the URL and put it back together with the URI prefix
    //       added to the URI only
  } else {
    return prefix + url;
  }
}

/**
 * Adds the given prefix string to the request's URL.  Application rules
 * differ if the given prefix includes a hostname or not.
 */
export function withPrefix(prefix: string): Middleware<Request, any> {
  const applyPrefix = (
    prefix.indexOf("http") === 0 ? applyHostnamePrefix : applyResourcePrefix
  );

  return function(request, next) {
    request.url = applyPrefix(request.url, prefix);
    return next();
  };
}
