describe('Portal#onCatch()', function () {

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
      web.onCatch(true);
    }).to.throw('Interceptor must be a function!');
  });

  /**
   * @test
   */
  it('successfully adds an interceptor', function () {
    var fn = function () {};
    web.onCatch(fn);

    var last = web._catchInterceptors.length - 1;
    expect(web._catchInterceptors[last]).to.equal(fn)
  });

});
