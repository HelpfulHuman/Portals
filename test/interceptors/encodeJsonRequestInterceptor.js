var encodeJsonRequestInterceptor = portals.interceptors.encodeJsonRequest;

describe('encodeJsonRequestInterceptor', function () {

  /**
   * @test
   */
  it('leaves the data property alone if Content-Type is not JSON', function () {
    var opts = { data: { foo: 'bar' }, headers: {} };
    var res  = encodeJsonRequestInterceptor(opts);

    expect(res).to.deep.equal(opts);
  });

  /**
   * @test
   */
  it('encodes the data property as JSON when Content-Type is set', function () {
    var opts = {
      data: { foo: 'bar' },
      headers: { 'Content-Type': 'application/json' }
    };
    var jsonData = JSON.stringify(opts.data);
    var res  = encodeJsonRequestInterceptor(opts);

    expect(res.body).to.equal(jsonData);
  });

});
