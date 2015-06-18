var parseJsonResponseInterceptor = portals.interceptors.parseJsonResponse;

describe('parseJsonResponseInterceptor', function () {

  /**
   * @test
   */
  it('leaves the data property alone if Content-Type is not JSON', function () {
    var opts = { body: { foo: 'bar' }, headers: {} };
    var res  = parseJsonResponseInterceptor(opts);

    expect(res).to.deep.equal(opts);
  });

  /**
   * @test
   */
  it('parses the data property as JSON when Content-Type is set', function () {
    var opts = {
      body: JSON.stringify({ foo: 'bar' }),
      headers: { 'Content-Type': 'application/json' }
    };
    var body = JSON.parse(opts.body);
    var res  = parseJsonResponseInterceptor(opts);

    expect(res.body).to.deep.equal(body);
  });

});
