import { withPrefix } from "./withPrefix";

const next = () => Promise.resolve({
  xhr: null as any,
  statusCode: 0,
  contentType: "",
  headers: {},
  body: null,
});

describe("withPrefix()", () => {

  it("doesn't add a hostname prefix to a URL that has a protocol/hostname", async () => {
    let req = { url: "http://foo.example.com/bar" };
    let mw = withPrefix("http://example.com");
    await mw(req, next);
    expect(req.url).toEqual("http://foo.example.com/bar");
  });

  it("adds a hostname prefix to a URL that is just a URI or is lacking an actualy protocol/hostname", async () => {
    let req = { url: "/foo/bar" };
    let mw = withPrefix("http://example.com");
    await mw(req, next);
    expect(req.url).toEqual("http://example.com/foo/bar");
  });

  it("adds the simple URI prefix if the URL is actually just a URI (doesn't have a protocol/hostname)", async () => {
    let req = { url: "/foo/bar" };
    let mw = withPrefix("/baz");
    await mw(req, next);
    expect(req.url).toEqual("/baz/foo/bar");
  });

  it("adds the URI prefix only to the URI or path portion when a protocol/hostname is provided", async () => {
    let req = { url: "http://example.com/bar" };
    let mw = withPrefix("/foo");
    await mw(req, next);
    expect(req.url).toEqual("http://example.com/foo/bar");
  });

});