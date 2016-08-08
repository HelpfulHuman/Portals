const { expect } = require('chai');
const { interceptors: { checkStatus } } = require('../../');

describe('interceptors/checkStatus', function () {

  before(function () {
    this.check = checkStatus([100, 200, 300]);
  });

  it('throws an error if the given response\'s status does not exist in the array of ok statuses', function () {
    const input = { status: 400, body: '' };
    expect(() => this.check(input)).to.throw('The response contained an invalid status code of 400');
  });

  it('returns the given response object if the response\'s status exists in the array of ok statuses', function () {
    const input = { status: 200, body: '' };
    const output = this.check(input);

    expect(output).to.equal(input);
  });

});
