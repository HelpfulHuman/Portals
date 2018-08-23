export type Request<Body = any, CustomOptions extends object = any> = CustomOptions & {
  url: string;
  method: HttpMethodLiteral | Method;
  headers?: HttpHeaderLiteral;
  body?: Body;
  withCredentials?: boolean;
};

export type Response<Body = any, CustomValues extends object = any> = CustomValues & {
  statusCode: number;
  headers: HttpHeaderLiteral;
  contentType: string;
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

export interface Middleware<Request, Response> {
  (request: Request, next: NextFunction<Response>): Promise<Response>;
}

export * from "./portal";
export * from "./supportsJson";
export * from "./withPrefix";
export * from "./withHeader";
export * from "./withAuth";