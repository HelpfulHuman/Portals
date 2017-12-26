export interface Request {
  url: string;
  method?: "GET"|"POST"|"PUT"|"PATCH"|"DELETE"|"HEAD";
  headers?: object;
  body?: any;
  cors?: boolean;
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

export interface Middleware<Request, Response> {
  (request: Request, next: NextFunction<Response>): Promise<Response>;
}

export * from "./portal";
export * from "./supportsJson";
export * from "./withPrefix";
export * from "./withHeader";
export * from "./withBearer";