var mergeGlobalsRequestInterceptor = portals.interceptors.mergeGlobalsRequest;

describe('mergeGlobalsRequestInterceptor', function () {

  /**
   * @test
   */
  it('it does shallow merging of values', function () {
    var req  = { globals: { method: 'GET', body: '' }};
    var opts = { method: 'POST', url: '/foo' };
    var res  = mergeGlobalsRequestInterceptor.call(req, opts);

    expect(res.method).to.equal(opts.method);
    expect(res.url).to.equal(opts.url);
    expect(res.body).to.equal(req.globals.body);
  });

  /**
   * @test
   */
  it('it does deep merging of values', function () {
    var req  = { globals: { headers: { Accept: 'application/json' }}};
    var opts = { headers: { Authorization: 'Bearer xxxx' }};
    var res  = mergeGlobalsRequestInterceptor.call(req, opts);

    expect(res.headers.Accept).to.equal(req.globals.headers.Accept);
    expect(res.headers.Authorization).to.equal(opts.headers.Authorization);
  });

});
