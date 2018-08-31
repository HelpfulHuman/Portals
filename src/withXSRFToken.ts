import { Middleware } from ".";

/**
 * Passes along the XSRF header from the XRSF-TOKEN cookie.
 */
export function withXSRFToken(cookieName: string = "XSRF-TOKEN", headerName: string = "X-XSRF-TOKEN"): Middleware<any, any> {
  return function (req, next) {
    const match = document.cookie.match(new RegExp(`(^|;\\s*)(${cookieName})=([^;]*)`));
    const cookie = (match ? decodeURIComponent(match[3]) : "");
    if (cookie) {
      req.headers = { ...req.headers };
      req.headers[headerName] = cookie;
    }
    return next();
  };
}