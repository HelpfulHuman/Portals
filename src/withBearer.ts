import {Request, Middleware} from "./";

export type GetToken<Req> = (request: Req) => string;

/**
 * Adds the Authorization header with the returned string as the bearer token.
 * Won't set the Authorization token if the result from getToken is falsey.
 */
export function withBearer<Req extends Request = Request>(getToken: GetToken<Req>): Middleware<Req, any> {
  return function(request, next) {
    var token = getToken(request);
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }

    return next();
  };
}