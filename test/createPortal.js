describe("createPortal()", function() {

  it("returns a function for making requests");

  it("sends the request even if no middleware is provided");

  it("does not send the request if a middleware fails to call next()");

  it("passes the same request object to each middleware in the stack");

  it("does not affect the original object passed into the returned function");

});