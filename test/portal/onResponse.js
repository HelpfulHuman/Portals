describe('Portal#onResponse()', function () {

  // test instance
  var web;

  /**
   * @beforeEach
   */
  beforeEach(function () {
    // instantiate a new portal instance
    web = new portals.Portal();
  });

  /**
   * @test
   */
  it('throws an error if given value is not a function', function () {
    expect(function () {
      web.onResponse(true);
    }).to.throw('Interceptor must be a function!');
  });

  /**
   * @test
   */
  it('successfully adds an interceptor', function () {
    var fn = function () {};
    web.onResponse(fn);

    var last = web._responseInterceptors.length - 1;
    expect(web._responseInterceptors[last]).to.equal(fn)
  });

});
