import { Request } from ".";
import { withAuthorization } from "./withAuth";

const next = () => Promise.resolve();

describe("withAuthorization()", () => {

  it("does not set the Authorization header if the given function returns an empty or non-string value", async () => {
    let req: Request = { url: "", headers: {} };

    await withAuthorization(() => null)(req, next);
    expect(req.headers!["Authorization"]).toBeUndefined;

    await withAuthorization(() => "")(req, next);
    expect(req.headers!["Authorization"]).toBeUndefined;
  });

  it("sets the Authorization header for the request if a non-empty string is returned from the given function", async () => {
    let req: Request = { url: "", headers: {} };
    await withAuthorization(() => "example.token")(req, next);
    expect(req.headers!["Authorization"]).toEqual("example.token");
  });

  it("adds the given prefix to the token when a non-empty string is returned from the given function", async () => {
    let req: Request = { url: "", headers: {} };
    await withAuthorization(() => "example.token", "Bearer ")(req, next);
    expect(req.headers!["Authorization"]).toEqual("Bearer example.token");
  });

});