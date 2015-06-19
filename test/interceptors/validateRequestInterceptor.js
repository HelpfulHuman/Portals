var validateRequestInterceptor = portals.interceptors.validateRequest;

describe('validateRequestInterceptor', function () {

  /**
   * @test
   */
  it('throws an error if a valid method is not provided', function () {
    expect(function () {
      validateRequestInterceptor.call({}, {})
    }).to.throw('Invalid method provided');
  });

  /**
   * @test
   */
  it('throws an error if a valid url is not provided', function () {
    expect(function () {
      validateRequestInterceptor.call({}, { method: 'GET' })
    }).to.throw('Invalid url provided');
  });

  /**
   * @test
   */
  it('returns the same object if validation is clean', function () {
    var opts = { method: 'GET', url: '/' };
    var result = validateRequestInterceptor.call({}, opts);

    expect(result).to.equal(opts);
  });

  /**
   * @test
   */
  it('converts headers to an object if it\'s not an object', function () {
    var opts = { method: 'GET', url: '/', headers: 'foo' };
    var result = validateRequestInterceptor.call({}, opts);

    expect(result).have.property('headers').that.is.an('object');
  });

});
