const { expect } = require('chai');
const { interceptors: { parseJsonResponse } } = require('../../');

describe('interceptors/parseJsonResponse', function () {

  it('leaves the response body alone if Content-Type is not set to "application/json"', function () {
    const body = { foo: 'bar' };
    const input = { body: JSON.stringify(body), headers: {} };
    const output  = parseJsonResponse(input);

    expect(output.body).to.equal(input.body);
  });

  it('attempts to parse the response body when Content-Type is set to "application/json"', function () {
    const body = { foo: 'bar' };
    const input = {
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    };
    const output = parseJsonResponse(input);

    expect(output.body).to.deep.equal(body);
  });

});
