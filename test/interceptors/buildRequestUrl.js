const { expect } = require('chai');
const { interceptors: { buildRequestUrl } } = require('../../');

describe('interceptors/buildRequestUrl', function () {

  it('returns the response\'s url as-is if no additional parameters are provided');

  it('returns a url that is prefixed with the given hostname property if the given url does not start with http or https');

  it('returns a url with a query string attached if a query object is provided');

  it('returns a url with parameter tokens parsed if a params object with matching keys if provided');

});
