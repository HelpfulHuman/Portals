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

  it('throws an error if an invalid header object is given for the request', function () {
    const method = 'GET';
    const url = '/foo';
    const err = 'Invalid headers object provided';
    expect(() => validateRequest({ method, url })).to.throw(err);
    expect(() => validateRequest({ method, url, headers: [] })).to.throw(err);
    expect(() => validateRequest({ method, url, headers: '{}' })).to.throw(err);
  });

  it('returns the same request object it was called with if method, url and header are all valid', function () {
    const input = { method: 'GET', url: '/foo', headers: {} };
    const output = validateRequest(input);

    expect(output).to.equal(input);
  });

});
