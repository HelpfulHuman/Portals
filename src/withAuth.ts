import { Request, Middleware } from ".";

export type GetToken<Req> = (request: Req) => void | null | string;

/**
 * Adds the Authorization header with the returned string as the header value.
 * Won't set the Authorization token if the result from getToken is falsey.
 */
export function withAuthorization<CustomRequestOptions extends object = any>(
  getToken: GetToken<Request<any, CustomRequestOptions>>,
  prefix: string = "",
): Middleware<Request<any, CustomRequestOptions>, any> {
  return function (request, next) {
    let token = getToken(request);
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
export function withBearer<CustomRequestOptions extends object = any>(
  getToken: GetToken<Request<any, CustomRequestOptions>>,
): Middleware<Request<any, CustomRequestOptions>, any> {
  return withAuthorization<CustomRequestOptions>(getToken, "Bearer ");
}