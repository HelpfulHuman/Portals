const { expect } = require('chai');
const { utils: { validateRequest } } = require('../../');

describe('utils/validateRequest', function () {

  it('throws an error if an invalid method is given for the request');

  it('throws an error if an invalid url is given for the request');

  it('throws an error if an invalid header object is given for the request');

  it('returns the same request object it was called with if method, url and header are all valid');

});
