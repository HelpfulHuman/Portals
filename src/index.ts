export interface Request {
  url: string;
  method?: HttpMethodLiteral | Method;
  headers?: object;
  body?: any;
  cors?: boolean;
  withCredentials?: boolean;
}

export interface Response {
  statusCode: number;
  headers: object;
  contentType: string;
  xhr: XMLHttpRequest;
  body: any;
}

export interface NextFunction<Response> {
  (): Promise<Response>;
}

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

export interface Middleware<Request, Response> {
  (request: Request, next: NextFunction<Response>): Promise<Response>;
}

export * from "./portal";
export * from "./supportsJson";
export * from "./withPrefix";
export * from "./withHeader";
export * from "./withBearer";