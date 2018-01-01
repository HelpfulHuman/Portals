import {send, createPortal} from "./portal";
import {Request} from "./";

function mockXHR(resHeaders: object = {}, resBody?: any) {
  var headersString = "";
  for (var k in resHeaders) {
    headersString += `${k}: ${resHeaders[k]}\r\n`;
  }

  var xhr = {
    open: jest.fn(),
    setRequestHeader: jest.fn(),
    getResponseHeader: jest.fn(k => resHeaders[k]),
    getAllResponseHeaders: jest.fn().mockReturnValue(headersString),
    withCredentials: false,
    responseText: resBody,
    send: jest.fn(() => {
      xhr.onload();
    }),
    onload() {},
    onerror(ev: ErrorEvent) {},
  };

  window["XMLHttpRequest"] = jest.fn().mockImplementation(() => xhr);

  return xhr;
}

describe("send()", () => {

  it("opens the request with the given URL and method properties", async () => {
    var xhr = mockXHR();
    var req = { url: "http://example.com", method: "PUT", headers: {} };
    var res = await send(req as Request);
    expect(xhr.open.mock.calls.length).toEqual(1);
    expect(xhr.open.mock.calls[0][0]).toEqual(req.method);
    expect(xhr.open.mock.calls[0][1]).toEqual(req.url)
    expect(xhr.open.mock.calls[0][2]).toEqual(true);
  });

  it("sets the withCredentials value to true when the cors option is set to true", async () => {
    var xhr = mockXHR();
    var req = { url: "", cors: true, method: "GET", headers: {} };
    var res = await send(req as Request);
    expect(xhr.withCredentials).toEqual(req.cors);
  });

  it("sets the request headers using the key/value pairs in the given headers object literal", async () => {
    var xhr = mockXHR();
    var req = { url: "", method: "GET", headers: {
      "Content-Type": "multipart/form-data",
      "Accept": "application/json",
    } };
    var res = await send(req as Request);
    expect(xhr.setRequestHeader.mock.calls.length).toEqual(2);
    expect(xhr.setRequestHeader.mock.calls).toEqual([
      ["Content-Type", "multipart/form-data"],
      ["Accept", "application/json"],
    ]);
  });

  it("sends the value of the body property on the request object", async () => {
    var xhr = mockXHR();
    var req = { url: "", method: "GET", headers: {}, body: "test" };
    var res = await send(req as Request);
    expect(xhr.send.mock.calls.length).toEqual(1);
    expect(xhr.send.mock.calls[0][0]).toEqual(req.body);
  });

  it("returns the Response object via the promise when the request is completed", async () => {
    var xhr = mockXHR({ "Content-Type": "text/plain", "Cache-Control": "no-cache" }, "testcontent");
    var req = { url: "", method: "GET", headers: {} };
    var res = await send(req as Request);
    expect(res.contentType).toEqual("text/plain");
    expect(xhr.responseText).toEqual("testcontent");
    expect(res.body).toEqual(xhr.responseText);
    expect(res.xhr).toEqual(xhr);
    expect(res.headers["Content-Type"]).toEqual("text/plain");
    expect(res.headers["Cache-Control"]).toEqual("no-cache");
  });

  it("passes errors from the XHR instance to the catch method of the promise", async () => {
    var xhr = mockXHR();
    var req = { url: "", method: "GET", headers: {} };
    // expect()
    var res = await send(req as Request);
  });

});

describe("createPortal()", () => {

  it("sets defaults for method, headers and cors when only a URL is provided", async () => {
    var url = "/";
    var mw = jest.fn((req, next) => {
      expect(req).toEqual({
        url: url,
        method: "GET",
        headers: { "Content-Type": "text/plain" },
        cors: true,
      });
    });
    var testPortal = createPortal(mw);
    var res = await testPortal({ url });
  });

  it("immediately invokes the XHR instance's send method when no middleware are provided", async () => {
    var xhr = mockXHR({}, "helloworld");
    var testPortal = createPortal();
    var res = await testPortal({ url: "/test" });
    expect(xhr.open.mock.calls[0]).toEqual(["GET", "/test", true]);
    expect(xhr.send.mock.calls.length).toEqual(1);
    expect(res.body).toEqual("helloworld");
  });

  it("invokes the first middleware and then no more when the next() method is not invoked", async () => {
    var mw = jest.fn(req => null);
    var testPortal = createPortal(mw, mw);
    var res = await testPortal({ url: "" });
    expect(mw.mock.calls.length).toEqual(1);
  });

  it("invokes each middleware until the next() method is no longer invoked", async () => {
    var mw = jest.fn((req, next) => next());
    var endTest = jest.fn();
    var testPortal = createPortal(mw, mw, mw, mw, endTest);
    var res = await testPortal({ url: "" });
    expect(mw.mock.calls.length).toEqual(4);
    expect(endTest.mock.calls.length).toEqual(1);
  });

});