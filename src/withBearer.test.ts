import {withBearer} from "./withBearer";

const next = () => Promise.resolve();

describe("withBearer()", () => {

  it("does not set the Authorization header if the given function returns an empty or non-string value", async () => {
    var req = { url: "", headers: {} };

    await withBearer(() => null)(req, next);
    expect(req.headers["Authorization"]).toBeUndefined;

    await withBearer(() => "")(req, next);
    expect(req.headers["Authorization"]).toBeUndefined;
  });

  it("sets the Authorization header for the request if a non-empty string is returned from the given function", async () => {
    var req = { url: "", headers: {} };
    await withBearer(() => "example.token")(req, next);
    expect(req.headers["Authorization"]).toEqual("Bearer example.token");
  });

});