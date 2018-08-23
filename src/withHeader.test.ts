import { Request } from ".";
import { withHeader } from "./withHeader";

const next = () => Promise.resolve();

describe("withHeader()", () => {

  it("sets the header value when the header has not previously been set", async () => {
    let req: Request = { url: "", headers: {} };
    await withHeader("Content-Type", "application/json")(req, next);
    expect(req.headers!["Content-Type"]).toEqual("application/json");
  });

  it("does not override a previously set header value when the override option is undefined or set to false", async () => {
    let req: Request = { url: "", headers: { "Content-Type": "multipart/form-data" } };
    await withHeader("Content-Type", "application/json")(req, next);
    expect(req.headers!["Content-Type"]).toEqual("multipart/form-data");
  });

  it("overrides a previously set header value when the override argument is set to true", async () => {
    let req: Request = { url: "", headers: { "Content-Type": "multipart/form-data" } };
    await withHeader("Content-Type", "application/json", true)(req, next);
    expect(req.headers!["Content-Type"]).toEqual("application/json");
  });

});