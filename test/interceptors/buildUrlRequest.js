var buildUrlRequestInterceptor = portals.interceptors.buildUrlRequest;

describe('buildUrlRequestInterceptor', function () {

  it('does not throw an error if hostname is undefined', function () {
    var opts = { url: '/foo' };
    var res  = buildUrlRequestInterceptor(opts);

    expect(res.url).to.equal(opts.url);
  });

  it('leaves the url alone if it contains "http"', function () {
    var opts = {
      url: 'http://foo.com/bar',
      hostname: 'http://baz.com'
    };

    var res = buildUrlRequestInterceptor(opts);

    expect(res.url).to.equal(opts.url);
  });

  it('prefixes the hostname when provided', function () {
    var url = '/bar';
    var opts = {
      url: url,
      hostname: 'http://foo.com'
    };

    var res = buildUrlRequestInterceptor(opts);

    expect(res.url).to.equal(opts.hostname + url);
  });

});
