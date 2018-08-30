import { Request, Middleware } from "./";

export type WithHeaderValue<Req> =
  | string
  | string[]
  | { (request: Req): string | string[] };

/**
 * Add a header to the request that can either override, or be overridden
 * by, the headers in the request.
 */
export function withHeader<Req extends Request = Request>(
  name: string,
  value: WithHeaderValue<Req>,
  override: boolean = false,
): Middleware {
  // If value isn't a function, make it one
  const getValue = (typeof value !== "function" ? () => value : value);

  return function (request, next) {
    if (typeof request.headers !== "object") {
      request.headers = {};
    }

    if (override) {
      request.headers[name] = getValue(request as Req);
    } else {
      request.headers = { [name]: getValue(request as Req), ...request.headers };
    }
    return next();
  };
}