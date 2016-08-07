const { expect } = require('chai');
const { interceptors: { encodeJsonRequest } } = require('../../');

describe('interceptors/encodeJsonRequest', function () {

  it('leaves the body property alone if Content-Type is not set to "application/json"', function () {
    const req = { body: { foo: 'bar' }, headers: {} };
    const res  = encodeJsonRequest(req);

    expect(res).to.deep.equal(req);
  });

  it('encodes the body property as JSON when Content-Type is set to "application/json"', function () {
    const req = {
      body: { foo: 'bar' },
      headers: { 'Content-Type': 'application/json' }
    };
    const jsonData = JSON.stringify(req.body);
    const res  = encodeJsonRequest(req);

    expect(res.body).to.equal(jsonData);
  });

});
