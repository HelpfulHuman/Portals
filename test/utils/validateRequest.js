const { expect } = require('chai');
const { utils: { validateRequest } } = require('../../');

describe('utils/validateRequest', function () {

  it('throws an error if an invalid method is given for the request', function () {
    const err = 'Invalid request method provided';
    expect(() => validateRequest({})).to.throw(err);
    expect(() => validateRequest({ method: false })).to.throw(err);
    expect(() => validateRequest({ method: 9899898 })).to.throw(err);
  });

  it('throws an error if an invalid url is given for the request', function () {
    const method = 'GET';
    const err = 'Invalid url provided';
    expect(() => validateRequest({ method })).to.throw(err);
    expect(() => validateRequest({ method, url: true })).to.throw(err);
    expect(() => validateRequest({ method, url: [] })).to.throw(err);
  });

  it('replaces the headers property with an empty object if an invalid object is given', function () {
    const method = 'GET';
    const url = '/foo';
    expect(validateRequest({ method, url })).to.have.property('headers').that.deep.equals({});
    expect(validateRequest({ method, url, headers: [] })).to.have.property('headers').that.deep.equals({});
    expect(validateRequest({ method, url, headers: '{}' })).to.have.property('headers').that.deep.equals({});
  });

  it('returns the same request object it was called with if method, url and header are all valid', function () {
    const input = { method: 'GET', url: '/foo', headers: {} };
    const output = validateRequest(input);

    expect(output).to.equal(input);
  });

});
