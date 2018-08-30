import { Middleware } from "./";

export type EncodeJSON = { json?: boolean; };

/**
 * Encode and parse JSON requests and responses.
 */
export function supportsJson(): Middleware {
  return function (req, next) {
    if (
      (req as any).json === true ||
      (req.body !== null &&
        (req.body instanceof Object || Array.isArray(req.body)))
    ) {
      if (typeof req.headers !== "object") {
        req.headers = {};
      }
      req.headers["Content-Type"] = "application/json";
      req.body = JSON.stringify(req.body);
    }

    return next().then(function (res) {
      if (res.contentType && res.contentType.indexOf("json") > -1) {
        res.body = JSON.parse(res.body);
      }
      return res;
    });
  };
}