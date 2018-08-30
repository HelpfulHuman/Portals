export type Request<Body = any> = {
  url: string;
  method: HttpMethodLiteral | Method;
  headers?: HttpHeaderLiteral;
  body?: Body;
  withCredentials?: boolean;
};

export type Response<Body = any> = {
  statusCode: number;
  headers: HttpHeaderLiteral;
  contentType: null | string;
  xhr: XMLHttpRequest;
  body: Body;
};

export interface NextFunction<Response> {
  (): Promise<Response>;
}

export type HttpHeaderLiteral = {
  [key: string]: string | string[];
};

export type HttpMethodLiteral = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD" | "UPDATE";

export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
  HEAD = "HEAD",
  UPDATE = "UPDATE",
}

export type Middleware<Req extends Request = Request, Res extends Response = Response> = (request: Req, next: NextFunction<Res>) => Promise<Res>;

export * from "./portal";
export * from "./supportsJson";
export * from "./withPrefix";
export * from "./withHeader";
export * from "./withAuth";