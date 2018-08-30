import { Request, Middleware } from ".";

export type GetToken<Req> = (request: Req) => void | null | string;

/**
 * Adds the Authorization header with the returned string as the header value.
 * Won't set the Authorization token if the result from getToken is falsey.
 */
export function withAuthorization<Req extends Request = Request>(
  getToken: GetToken<Req>,
  prefix: string = "",
): Middleware {
  return function (request, next) {
    let token = getToken(request as Req);
    if (!!token) {
      if (typeof request.headers !== "object") {
        request.headers = {};
      }
      request.headers["Authorization"] = prefix + token;
    }

    return next();
  };
}

/**
 * Adds the Authorization header with the returned string as the bearer token.
 * Won't set the Authorization token if the result from getToken is falsey.
 */
export function withBearer<Req extends Request = Request>(getToken: GetToken<Req>): Middleware {
  return withAuthorization<Req>(getToken, "Bearer ");
}