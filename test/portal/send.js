describe('Portal#send()', function () {

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
  it('throws an error if options is not an object', function () {
    expect(function () {
      web.send();
    }).to.throw('Options must be an object!');
  });

  /**
   * @test
   */
  it('sends a simple GET request with success', function (done) {
    var opts = { method: 'GET', url: '/' };
    var data = JSON.stringify({ foo: 'bar' });
    var promise = web.send(opts);

    // set up the fake response
    this.requests[0].respond(200, { 'Content-Type': 'application/json' }, data);

    // proceed with promise resolution
    promise.then(function (res) {
      expect(res.status).to.equal(200);
      expect(res.body).to.equal(data);
      expect(res.headers).to.be.an('object')
        .with.property('Content-Type')
        .that.equals('application/json');
      done();
    });
  });

  /**
   * @test
   */
  it('sends a simple GET request with failure', function (done) {
    var opts = { method: 'GET', url: '/' };
    var data = JSON.stringify({ foo: 'bar' });
    var promise = web.send(opts);

    // set up the fake response
    this.requests[0].respond(402, { 'Content-Type': 'application/json' }, data);

    // proceed with promise resolution
    promise.catch(function (err) {
      expect(err.status).to.equal(402);
      expect(err.body).to.equal(data);
      expect(err.headers).to.be.an('object')
        .with.property('Content-Type')
        .that.equals('application/json');
      done();
    });
  });

});
