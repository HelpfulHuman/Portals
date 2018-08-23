import { send, createPortal } from "./portal";
import { Request, HttpHeaderLiteral } from "./";

function mockXHR(resHeaders: HttpHeaderLiteral = {}, resBody?: any) {
  let headersString = "";
  for (let k in resHeaders) {
    headersString += `${k}: ${resHeaders[k]}\r\n`;
  }

  let xhr = {
    open: jest.fn(),
    setRequestHeader: jest.fn(),
    getResponseHeader: jest.fn(k => resHeaders[k]),
    getAllResponseHeaders: jest.fn().mockReturnValue(headersString),
    withCredentials: false,
    responseText: resBody,
    send: jest.fn(() => {
      xhr.onload();
    }),
    onload() { },
    onerror(ev: ErrorEvent) { },
  };

  (window as any)["XMLHttpRequest"] = jest.fn().mockImplementation(() => xhr);

  return xhr;
}

describe("send()", () => {

  it("opens the request with the given URL and method properties", async () => {
    let xhr = mockXHR();
    let req = { url: "http://example.com", method: "PUT", headers: {} };
    await send(req as Request);
    expect(xhr.open.mock.calls.length).toEqual(1);
    expect(xhr.open.mock.calls[0][0]).toEqual(req.method);
    expect(xhr.open.mock.calls[0][1]).toEqual(req.url);
    expect(xhr.open.mock.calls[0][2]).toEqual(true);
  });

  it("sets the withCredentials value to true when the withCredentials option is set to true", async () => {
    let xhr = mockXHR();
    let req = { url: "", withCredentials: true, method: "GET", headers: {} };
    await send(req as Request);
    expect(xhr.withCredentials).toEqual(req.withCredentials);
  });

  it("sets the request headers using the key/value pairs in the given headers object literal", async () => {
    let xhr = mockXHR();
    let req = {
      url: "", method: "GET", headers: {
        "Content-Type": "multipart/form-data",
        "Accept": "application/json",
      },
    };
    await send(req as Request);
    expect(xhr.setRequestHeader.mock.calls.length).toEqual(2);
    expect(xhr.setRequestHeader.mock.calls).toEqual([
      ["Content-Type", "multipart/form-data"],
      ["Accept", "application/json"],
    ]);
  });

  it("sends the value of the body property on the request object", async () => {
    let xhr = mockXHR();
    let req = { url: "", method: "GET", headers: {}, body: "test" };
    await send(req as Request);
    expect(xhr.send.mock.calls.length).toEqual(1);
    expect(xhr.send.mock.calls[0][0]).toEqual(req.body);
  });

  it("returns the Response object via the promise when the request is completed", async () => {
    let xhr = mockXHR({ "Content-Type": "text/plain", "Cache-Control": "no-cache" }, "testcontent");
    let req = { url: "", method: "GET", headers: {} };
    let res = await send(req as Request);
    expect(res.contentType).toEqual("text/plain");
    expect(xhr.responseText).toEqual("testcontent");
    expect(res.body).toEqual(xhr.responseText);
    expect(res.xhr).toEqual(xhr);
    expect(res.headers["Content-Type"]).toEqual("text/plain");
    expect(res.headers["Cache-Control"]).toEqual("no-cache");
  });

  xit("passes errors from the XHR instance to the catch method of the promise", async () => {
  });

});

describe("createPortal()", () => {

  it("sets defaults for method, headers and withCredentials when only a URL is provided", async () => {
    let url = "/";
    let mw = jest.fn((req, next) => {
      expect(req).toEqual({
        url: url,
        method: "GET",
        headers: { "Content-Type": "text/plain" },
        withCredentials: false,
      });
    });
    let testPortal = createPortal(mw);
    await testPortal({ url });
  });

  it("immediately invokes the XHR instance's send method when no middleware are provided", async () => {
    let xhr = mockXHR({}, "helloworld");
    let testPortal = createPortal();
    let res = await testPortal({ url: "/test" });
    expect(xhr.open.mock.calls[0]).toEqual(["GET", "/test", true]);
    expect(xhr.send.mock.calls.length).toEqual(1);
    expect(res.body).toEqual("helloworld");
  });

  it("invokes the first middleware and then no more when the next() method is not invoked", async () => {
    let mw = jest.fn(req => null);
    let testPortal = createPortal(mw, mw);
    await testPortal({ url: "" });
    expect(mw.mock.calls.length).toEqual(1);
  });

  it("invokes each middleware until the next() method is no longer invoked", async () => {
    let mw = jest.fn((req, next) => next());
    let endTest = jest.fn();
    let testPortal = createPortal(mw, mw, mw, mw, endTest);
    await testPortal({ url: "" });
    expect(mw.mock.calls.length).toEqual(4);
    expect(endTest.mock.calls.length).toEqual(1);
  });

});