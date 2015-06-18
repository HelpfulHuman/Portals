describe('Portal#onRequest()', function () {

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
      web.onRequest(true);
    }).to.throw('Interceptor must be a function!');
  });

  /**
   * @test
   */
  it('successfully adds an interceptor', function () {
    var fn = function () {};
    web.onRequest(fn);

    var last = web._requestInterceptors.length - 1;
    expect(web._requestInterceptors[last]).to.equal(fn)
  });

});
