import { supportsJson, EncodeJSON } from "./supportsJson";
import { Request, Response } from "./";

function mockNext(contentType: string, body: any) {
  return function (): Promise<Response> {
    return Promise.resolve({
      xhr: new XMLHttpRequest(),
      statusCode: 200,
      headers: { "Content-Type": contentType },
      contentType: contentType,
      body: body,
    });
  };
}

describe("supportsJson()", () => {

  it("converts the request body value to a JSON string and sets the Content-Type to application/json when the value is a standard array", async () => {
    let body: any = [];
    let req: Request = { url: "", headers: {}, body };
    await supportsJson()(req, mockNext("", ""));
    expect(req.headers!["Content-Type"]).toEqual("application/json");
    expect(req.body).toEqual(JSON.stringify(body));
  });

  it("converts the request body value to a JSON string and sets the Content-Type to application/json when the value is an object literal", async () => {
    let body: any = { foo: "bar" };
    let req: Request = { url: "", headers: {}, body };
    await supportsJson()(req, mockNext("", ""));
    expect(req.headers!["Content-Type"]).toEqual("application/json");
    expect(req.body).toEqual(JSON.stringify(body));
  });

  it("does not convert the request body value to a JSON string when the body type is null", async () => {
    let body: any = null;
    let req: Request = { url: "", headers: { "Content-Type": "text/plain" }, body };
    await supportsJson()(req, mockNext("", ""));
    expect(req.headers!["Content-Type"]).toEqual("text/plain");
    expect(req.body).toEqual(body);
  });

  it("does not convert the request body value to a JSON string when the body type is a string", async () => {
    let body: any = "already a string";
    let req: Request = { url: "", headers: { "Content-Type": "text/plain" }, body };
    await supportsJson()(req, mockNext("", ""));
    expect(req.headers!["Content-Type"]).toEqual("text/plain");
    expect(req.body).toEqual(body);
  });

  it("does not convert the request body value to a JSON string when the body type is a FormData class instance", async () => {
    let body: any = new FormData();
    let req: Request = { url: "", headers: { "Content-Type": "multipart/form-data" }, body };
    await supportsJson()(req, mockNext("", ""));
    expect(req.headers!["Content-Type"]).toEqual("multipart/form-data");
    expect(req.body).toEqual(body);
  });

  it("converts the request body value to a JSON string and sets the Content-Type to application/json when the json option is explicitly set to true", async () => {
    let body: any = { foo: "bar" };
    let req: Request & EncodeJSON = { url: "/", headers: {}, json: true, body };
    await supportsJson()(req, mockNext("", ""));
    expect(req.headers!["Content-Type"]).toEqual("application/json");
    expect(req.body).toEqual(JSON.stringify(body));
  });

  it("does not parse the response body when the contentType is not a JSON mime-type", async () => {
    let resBody = JSON.stringify({ foo: "bar" });
    let req: Request = { url: "", headers: {} };
    let res = await supportsJson()(req, mockNext("text/plain", resBody));
    expect(res.body).toEqual(resBody);
  });

  it("parses the response body when the contentType is a JSON mime-type", async () => {
    let resBody = { foo: "bar" };
    let req: Request = { url: "", headers: {} };
    let res = await supportsJson()(req, mockNext("application/json", JSON.stringify(resBody)));
    expect(res.body).toMatchObject(resBody);
  });

});