describe('create()', function () {

  /**
   * @test
   */
  it('returns an instance of Portal', function () {
    var web = portals.create();

    expect(web).to.be.instanceOf(portals.Portal);
  });

});
