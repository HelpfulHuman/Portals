import {Request, Response, Middleware} from "./";

export type EncodeJSON = { json: boolean; };

/**
 * Encode and parse JSON requests and responses.
 */
export function supportsJson(): Middleware<Request & EncodeJSON, Response> {
  return function(req, next) {

    if (
      req.json === true ||
      (req.body !== null &&
        (req.body instanceof Object || Array.isArray(req.body)))
    ) {
      req.headers["Content-Type"] = "application/json";
      req.body = JSON.stringify(req.body);
    }

    return next().then(function (res) {
      if (res.contentType.indexOf("json") > -1) {
        res.body = JSON.parse(res.body);
      }
      return res;
    });
  };
}