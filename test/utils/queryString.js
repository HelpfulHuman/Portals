const { expect } = require('chai');
const { utils: { queryString } } = require('../../');

describe('utils/queryString', function () {

  it('creates a basic query string using an object containing the desired key/value results', function () {
    const q = queryString({ foo: 'bar', baz: 10, bah: false });

    expect(q).to.equal('?foo=bar&baz=10&bah=false');
  });

});
