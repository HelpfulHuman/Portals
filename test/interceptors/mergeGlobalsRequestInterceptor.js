var mergeGlobalsRequestInterceptor = portals.interceptors.mergeGlobalsRequest;

describe('mergeGlobalsRequestInterceptor', function () {

  /**
   * @test
   */
  it('it does shallow merging of values', function () {
    var req  = { globals: { method: 'GET', body: '' }};
    var opts = { method: 'POST', url: '/foo' };
    var res  = mergeGlobalsRequestInterceptor.call(req, opts);

    expect(res).to.deep.equal({
      method: opts.method,
      url: opts.url,
      body: req.globals.body
    });
  });

  /**
   * @test
   */
  it('does not convert arrays to objects with string indexes', function () {
    var req  = { globals: { arr: ['a','b','c'] }};
    var opts = { arr: ['c', 'd', 'e', 'f'] };
    var res  = mergeGlobalsRequestInterceptor.call(req, opts);

    expect(res).to.deep.equal({
      arr: opts.arr
    });
  });

  /**
   * @test
   */
  it('it does deep merging of values', function () {
    var req  = { globals: { headers: { Accept: 'application/json' }}};
    var opts = { headers: { Authorization: 'Bearer xxxx' }};
    var res  = mergeGlobalsRequestInterceptor.call(req, opts);

    expect(res).to.deep.equal({
      headers: {
        Accept: req.globals.headers.Accept,
        Authorization: opts.headers.Authorization
      }
    });
  });

});
