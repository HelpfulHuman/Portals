const { expect } = require('chai');
const { interceptors: { checkStatus } } = require('../../');

describe('interceptors/checkStatus', function () {

  it('throws an error if the given response\'s status does not exist in the array of ok statuses');

  it('returns the given response object if the response\'s status exists in the array of ok statuses');

});
