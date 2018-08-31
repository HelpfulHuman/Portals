import { withXSRFToken } from "./withXSRFToken";
import { Request } from ".";

const next = () => Promise.resolve({
  xhr: null as any,
  statusCode: 0,
  contentType: "",
  headers: {},
  body: null,
});

describe("withXSRFToken", () => {

  beforeEach(() => {
    Object.defineProperty(document, "cookie", {
      value: "",
      writable: true,
    });
  });

  it("doesn't attempt to pass the cookie value when no value is found", async () => {

    let req: Request = { url: "" };
    await withXSRFToken()(req, next);
    expect(req.headers).toBeUndefined();

  });

  it("parses the current cookie with the matching name and sets it as the specified header name", async () => {

    document.cookie = "XSRF-TOKEN=foo";
    let req2: Request = { url: "" };
    await withXSRFToken()(req2, next);
    expect(req2.headers!["X-XSRF-TOKEN"]).toEqual("foo");

    document.cookie = "session=123456;XSRF-TOKEN=bar;user_id=45345465;";
    let req3: Request = { url: "" };
    await withXSRFToken()(req3, next);
    expect(req3.headers!["X-XSRF-TOKEN"]).toEqual("bar");

    document.cookie = "session=123456;XSRF-TOKEN=baz;user_id=45345465;";
    let req4: Request = { url: "" };
    await withXSRFToken("session", "X-Custom-Header")(req4, next);
    expect(req4.headers!["X-Custom-Header"]).toEqual("123456");

  });

});