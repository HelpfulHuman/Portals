describe('Portal#useDefaultInterceptors()', function () {

  /**
   * @test
   */
  it('returns an instance of Portal with default interceptors', function () {
    var web = new portals.Portal();

    expect(web._requestInterceptors).to.have.lengthOf(1);
    expect(web._responseInterceptors).to.have.lengthOf(0);

    web.useDefaultInterceptors();

    expect(web._requestInterceptors).to.have.lengthOf(4);
    expect(web._responseInterceptors).to.have.lengthOf(1);
  });

});
